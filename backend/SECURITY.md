# Payment exception controls

`POST /api/v1/payment-exceptions/:id/decisions` records an administrative decision only. It never triggers a provider transfer, updates a user balance, or releases funds.

Two distinct identities with different approved roles must submit `APPROVE` before an exception reaches `APPROVED`. Any `REJECT` or `ESCALATE` is final. The first reviewer must never be able to supply the second decision.

Before deployment, use a managed PostgreSQL service with encrypted backups, grant the API database role `INSERT` only on `audit_events`, deliver authentication through your identity provider, and send audit events to an independent immutable log store. Have Myanmar-qualified counsel and the licensed payment partner approve the exact operational policy.
