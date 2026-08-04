# Deployment setup

## 1. Create a private GitHub repository

Push this `Nova-lift-platform` folder to a private repository. Do not commit `.env` files, payment-provider keys, customer documents, or database backups.

## 2. Provision Render services

In Render, choose **New → Blueprint** and select the repository. Render reads `render.yaml` and creates:

- `nova-lift-api` (Node API)
- `nova-lift-admin` (static admin console)
- `nova-lift-audit-db` (PostgreSQL)

Set `CORS_ORIGINS` after the frontend domain exists, for example `https://app.example.mm`. Keep automatic deploy disabled until staging review is passed.

After the Blueprint is ready, open `nova-lift-audit-db` in Render and use its **Connect** panel to copy the PSQL command. Run it from a terminal with the PostgreSQL client installed, then execute `\i backend/db/schema.sql` from the repository root. This initializes the account, order, support, approval, and append-only audit tables. Then load the 40-item starter catalog with `\i backend/db/seed_tasks.sql`, or the 200-item VIP catalog (40 per VIP level) with `\i backend/db/seed_vip_tasks.sql`.

## 3. Deploy the mobile frontend to Vercel

Import the same GitHub repository in Vercel. Set **Root Directory** to `frontend`; use the detected Next.js build settings. Set `NEXT_PUBLIC_API_BASE_URL` to the Render API origin, for example `https://nova-lift-api.onrender.com/api/v1`.

## 4. Connect the domain through Cloudflare

Add your domain to Cloudflare, change the registrar nameservers, then add CNAME records for the Vercel app and Render API/admin origins. Enable Full (strict) SSL, WAF managed rules, bot protection, and rate limiting for `/api/*`.

## Go-live gate

Do not enable payment-provider credentials until the licensed provider, legal counsel, security reviewer, and operations owner have approved the deployment. The current API cannot execute payments; it only records controlled exception decisions.
