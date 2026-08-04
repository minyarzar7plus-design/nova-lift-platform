const crypto = require('crypto');
const { z } = require('zod');
const db = require('../config/db');

const decisionSchema = z.object({ decision: z.enum(['APPROVE', 'REJECT', 'ESCALATE']), rationale: z.string().trim().min(10).max(1000) });
const audit = (client, actorId, action, entityId, metadata, requestId) => client.query(
  'INSERT INTO audit_events (id, actor_id, action, entity_type, entity_id, request_id, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7)',
  [crypto.randomUUID(), actorId, action, 'payment_exception', entityId, requestId || null, JSON.stringify(metadata)]
);

exports.list = async (req, res, next) => { try {
  const { rows } = await db.query("SELECT id, provider_reference, payment_type, amount_minor, currency, reason_code, status, submitted_at, resolved_at FROM payment_exceptions WHERE status = COALESCE($1::exception_status, status) ORDER BY submitted_at ASC LIMIT 100", [req.query.status || null]);
  res.json({ data: rows });
} catch (error) { next(error); } };

exports.decide = async (req, res, next) => {
  const parsed = decisionSchema.safeParse(req.body); if (!parsed.success) return res.status(422).json({ error: 'Invalid decision payload.', details: parsed.error.flatten() });
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('SELECT * FROM payment_exceptions WHERE id=$1 FOR UPDATE', [req.params.id]);
    const item = result.rows[0]; if (!item) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Exception not found.' }); }
    if (item.status !== 'PENDING_REVIEW') { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Exception is already resolved.' }); }
    const previous = await client.query('SELECT reviewer_id, reviewer_role, decision FROM payment_exception_decisions WHERE exception_id=$1', [item.id]);
    if (previous.rows.some(d => d.reviewer_id === req.user.sub)) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'A reviewer may decide only once.' }); }
    if (previous.rows.some(d => d.reviewer_role === req.user.role)) { await client.query('ROLLBACK'); return res.status(409).json({ error: 'Second approval must come from a different role.' }); }
    const { decision, rationale } = parsed.data;
    await client.query('INSERT INTO payment_exception_decisions (id, exception_id, reviewer_id, reviewer_role, decision, rationale) VALUES ($1,$2,$3,$4,$5,$6)', [crypto.randomUUID(), item.id, req.user.sub, req.user.role, decision, rationale]);
    const finalStatus = decision === 'REJECT' ? 'REJECTED' : decision === 'ESCALATE' ? 'ESCALATED' : previous.rows.some(d => d.decision === 'APPROVE') ? 'APPROVED' : 'PENDING_REVIEW';
    if (finalStatus !== 'PENDING_REVIEW') await client.query('UPDATE payment_exceptions SET status=$1, resolved_at=now() WHERE id=$2', [finalStatus, item.id]);
    await audit(client, req.user.sub, 'payment_exception.decision_recorded', item.id, { decision, finalStatus }, req.id);
    await client.query('COMMIT');
    res.json({ id: item.id, status: finalStatus, paymentExecution: 'NOT_PERFORMED' });
  } catch (error) { await client.query('ROLLBACK'); next(error); } finally { client.release(); }
};
