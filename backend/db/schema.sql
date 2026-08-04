-- Payment-provider exception queue only. It must not hold card data or wallet secrets.
CREATE TYPE exception_status AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ESCALATED');
CREATE TYPE decision_type AS ENUM ('APPROVE', 'REJECT', 'ESCALATE');

CREATE TABLE payment_exceptions (
  id UUID PRIMARY KEY,
  provider_reference TEXT NOT NULL UNIQUE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('DEPOSIT', 'REFUND')),
  amount_minor BIGINT NOT NULL CHECK (amount_minor > 0),
  currency CHAR(3) NOT NULL,
  reason_code TEXT NOT NULL,
  status exception_status NOT NULL DEFAULT 'PENDING_REVIEW',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  created_by UUID NOT NULL
);

CREATE TABLE payment_exception_decisions (
  id UUID PRIMARY KEY,
  exception_id UUID NOT NULL REFERENCES payment_exceptions(id),
  reviewer_id UUID NOT NULL,
  reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('payment_reviewer', 'payment_approver', 'compliance_admin')),
  decision decision_type NOT NULL,
  rationale TEXT NOT NULL CHECK (char_length(rationale) >= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exception_id, reviewer_id)
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  request_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The database account used by the application may only insert audit events.
CREATE FUNCTION deny_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'audit_events are append-only'; END; $$;
CREATE TRIGGER audit_events_no_update BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION deny_audit_mutation();
CREATE INDEX payment_exceptions_status_submitted_idx ON payment_exceptions(status, submitted_at);
CREATE INDEX audit_events_entity_idx ON audit_events(entity_type, entity_id, occurred_at);
