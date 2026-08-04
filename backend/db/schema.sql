-- Apply through a migration tool in production. Do not store card data or wallet secrets.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TYPE user_role AS ENUM ('user', 'support_agent', 'payment_reviewer', 'payment_approver', 'compliance_admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending_verification');
CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE ticket_status AS ENUM ('open', 'waiting_for_user', 'resolved');
CREATE TYPE exception_status AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ESCALATED');
CREATE TYPE decision_type AS ENUM ('APPROVE', 'REJECT', 'ESCALATE');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 80),
  role user_role NOT NULL DEFAULT 'user',
  status user_status NOT NULL DEFAULT 'pending_verification',
  membership_level SMALLINT NOT NULL DEFAULT 1 CHECK (membership_level BETWEEN 1 AND 5),
  email_verified_at TIMESTAMPTZ,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by UUID REFERENCES users(id),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX users_referrer_idx ON users(referred_by);

CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, used_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, description TEXT NOT NULL,
  category TEXT NOT NULL, membership_level SMALLINT NOT NULL DEFAULT 1 CHECK (membership_level BETWEEN 1 AND 5), estimated_minutes SMALLINT CHECK (estimated_minutes > 0),
  active BOOLEAN NOT NULL DEFAULT true, created_by UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tasks_active_idx ON tasks(active, created_at DESC);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id), task_id UUID NOT NULL REFERENCES tasks(id),
  status order_status NOT NULL DEFAULT 'pending', notes TEXT, assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(), completed_at TIMESTAMPTZ, updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_user_idx ON orders(user_id, assigned_at DESC);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL, body TEXT NOT NULL, read_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON notifications(user_id, read_at, created_at DESC);

CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id), subject TEXT NOT NULL, body TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open', assigned_to UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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
  created_by UUID NOT NULL REFERENCES users(id)
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
  actor_id UUID NOT NULL REFERENCES users(id),
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
