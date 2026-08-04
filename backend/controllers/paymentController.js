exports.wallet = (_, res) => res.json({ mode: 'demo', balance: 1240.5, paymentsEnabled: false });
exports.submit = (_, res) => res.status(403).json({ error: 'Payments are disabled in demo mode.' });
