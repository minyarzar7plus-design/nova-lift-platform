# Core API

All protected endpoints require `Authorization: Bearer <JWT>`.

- `POST /api/v1/auth/register` — creates an unverified account.
- `POST /api/v1/auth/verify-email` — verifies an emailed, single-use token.
- `POST /api/v1/auth/login` — returns a 30-minute access token for an active user.
- `GET /api/v1/tasks`, `POST /api/v1/tasks/orders`, `GET /api/v1/tasks/orders` — catalog and user order workflow.
- `POST /api/v1/support/tickets`, `GET /api/v1/user/notifications` — support and notifications.
- `GET /api/v1/admin/overview`, `/users`, `/analytics/registrations` — role-protected operations views.

In production, connect `email_verification_tokens` to a transactional email provider. Never include the verification token in an HTTP response outside development.
