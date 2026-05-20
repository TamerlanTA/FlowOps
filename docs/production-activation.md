# Production Activation Guide

This guide activates the FlowOps Free AI Operations Audit lead capture path for production.

The implemented flow is:

```text
FlowOps website form -> POST /api/audit-request -> Supabase audit_requests insert -> Supabase audit_work_items insert -> optional Resend email -> optional n8n webhook -> internal audit workspace -> internal response drafts
```

No client auth, payments, public dashboard, or client portal login is required. The internal audit workspace uses temporary shared-key access and should be replaced with proper authenticated admin access later.

## A. Supabase Setup

1. Create or open the production Supabase project.

2. Open the Supabase Dashboard.

3. Go to `SQL Editor`.

4. Apply the schema.

Option A: apply the full current snapshot:

```bash
supabase/schema.sql
```

Option B: apply migrations in order:

```bash
supabase/migrations/001_audit_requests.sql
supabase/migrations/002_audit_work_items.sql
supabase/migrations/003_audit_response_drafts.sql
```

5. Paste the SQL into the Supabase SQL Editor and run it.

6. Verify the tables exist:

```sql
select table_schema, table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('audit_requests', 'audit_work_items', 'audit_response_drafts')
order by table_name;
```

Expected: one row each for `public.audit_requests`, `public.audit_work_items`, and `public.audit_response_drafts`.

7. Verify RLS is enabled:

```sql
select relname, relrowsecurity
from pg_class
where relname in ('audit_requests', 'audit_work_items', 'audit_response_drafts')
order by relname;
```

Expected: `relrowsecurity = true` for all three tables.

8. Verify indexes exist:

```sql
select indexname
from pg_indexes
where schemaname = 'public'
  and tablename in ('audit_requests', 'audit_work_items', 'audit_response_drafts')
order by indexname;
```

Expected indexes:

- `audit_response_drafts_audit_request_id_idx`
- `audit_response_drafts_audit_work_item_id_idx`
- `audit_response_drafts_created_at_idx`
- `audit_response_drafts_pkey`
- `audit_response_drafts_status_idx`
- `audit_requests_created_at_idx`
- `audit_requests_pkey`
- `audit_requests_status_idx`
- `audit_requests_work_email_idx`
- `audit_work_items_audit_request_id_idx`
- `audit_work_items_created_at_idx`
- `audit_work_items_follow_up_status_idx`
- `audit_work_items_pkey`
- `audit_work_items_priority_idx`
- `audit_work_items_status_idx`

9. Verify no public read/update/delete policies were created:

```sql
select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename in ('audit_requests', 'audit_work_items', 'audit_response_drafts')
order by tablename, policyname;
```

Expected for the current server-route model: no rows.

Security model: browser requests go to the Next.js API route. The route uses `SUPABASE_SERVICE_ROLE_KEY` server-side only. The browser does not insert directly into Supabase. `audit_work_items` and `audit_response_drafts` are internal-only and should later be exposed only through an authenticated admin/service layer.

## B. Environment Variables

Set these in local `.env.local` and in the production host such as Vercel.

For local setup details, use:

```text
docs/local-secret-setup.md
```

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FLOWOPS_INTERNAL_ACCESS_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
FLOWOPS_NOTIFICATION_EMAIL=
N8N_AUDIT_WEBHOOK_URL=
```

### `NEXT_PUBLIC_SUPABASE_URL`

Required for MVP activation.

The Supabase project URL, for example:

```text
https://PROJECT_REF.supabase.co
```

This value is public-safe, but it is still required by the server utility.

### `SUPABASE_SERVICE_ROLE_KEY`

Required for MVP activation.

Server-side only. Never expose this key in client components, `NEXT_PUBLIC_` variables, browser code, screenshots, logs, or documentation examples.

### `FLOWOPS_INTERNAL_ACCESS_KEY`

Required for MVP activation because the team will monitor incoming work through the internal audit workspace instead of paid email notification.

This is a temporary shared internal access key for:

```text
/internal/audits?key=YOUR_INTERNAL_KEY
```

It is not production authentication. Do not commit the real value, do not expose it in screenshots, and replace this model later with proper authenticated admin access. In production, use a long random value; short keys fail closed.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional for the current server-side insert path.

Documented for future browser-safe Supabase work only. Do not switch the audit form to direct browser inserts unless the RLS policy model is intentionally changed and reviewed.

### `RESEND_API_KEY`

Optional future paid email notification integration.

Resend is not required for MVP activation. If omitted, audit requests still store in Supabase, work items are still created, and the internal workspace remains usable.

### `FLOWOPS_NOTIFICATION_EMAIL`

Optional future email notification recipient. Not required for MVP activation.

### `N8N_AUDIT_WEBHOOK_URL`

Optional.

If configured, the API route forwards the stored audit request to this n8n webhook after the Supabase insert succeeds.

Preferred free notification path:

```text
N8N_AUDIT_WEBHOOK_URL -> n8n workflow -> Telegram message
```

## MVP Success Criteria Without Resend

Resend is optional and email notification is postponed for MVP launch.

Minimum successful activation means:

1. `audit_requests` row is created.
2. `audit_work_items` row is created.
3. `/internal/audits?key=...` opens with the internal key.
4. `/internal/audits/[id]?key=...` opens and creates `audit_response_drafts`.
5. status and draft editing work.

Optional notification can be handled for free with n8n forwarding to Telegram.

## C. Rate Limiting

Stage 7 adds lightweight in-memory rate limiting:

- public audit requests: 5 submissions per 10 minutes per IP
- internal PATCH routes: 60 updates per 10 minutes per IP/internal-key combination

Rate limited requests return HTTP `429` with a safe JSON message and `Retry-After` header.

Important limitation: this is in-memory protection. It is useful for local/dev and basic single-instance protection, but it resets on server restart and does not synchronize across serverless instances. Replace it later with Upstash Redis, Vercel KV, or Supabase-backed rate limiting before high-volume production traffic.

## D. Local Testing

1. Install dependencies:

```bash
npm install
```

2. Check local env presence without printing secret values:

```bash
npm run check:env
```

3. Run lint:

```bash
npm run lint
```

4. Run production build:

```bash
npm run build
```

5. Start the dev server:

```bash
npm run dev
```

If port `3000` is occupied, Next.js may use another port such as `3001`. Adjust curl URLs accordingly.

6. Valid payload test:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "companyWebsite": "https://example.com",
    "businessType": "B2B services",
    "mainOperationalPain": "Leads are missed and follow-up depends on manual reminders.",
    "teamSize": "11-25",
    "currentTools": "HubSpot, Gmail, Slack",
    "biggestBottleneck": "CRM updates and follow-up are not reliable.",
    "selectedSystem": "SalesOS",
    "pageUrl": "http://localhost:3000"
  }'
```

Expected with Supabase env configured and schema applied:

- HTTP `200`
- `success: true`
- `requestId` returned
- row created in `audit_requests`

Expected without Supabase env:

- HTTP `503`
- `success: false`
- development message explaining missing Supabase configuration

7. Invalid email test:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "not-an-email",
    "mainOperationalPain": "Manual reporting creates delays.",
    "biggestBottleneck": "Weekly spreadsheet reporting is slow."
  }'
```

Expected:

- HTTP `400`
- `success: false`
- validation error response

8. Honeypot test:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "mainOperationalPain": "Manual reporting creates delays.",
    "companyNameConfirm": "bot-filled"
  }'
```

Expected:

- HTTP `400`
- safe user-facing rejection

## E. Production Testing

1. Add production env vars in Vercel or the active hosting provider.

Minimum required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FLOWOPS_INTERNAL_ACCESS_KEY`

Recommended:

- `N8N_AUDIT_WEBHOOK_URL`
- `RESEND_API_KEY` and `FLOWOPS_NOTIFICATION_EMAIL` only if paid Resend email notification is intentionally enabled later

2. Redeploy the site.

3. Open the production website.

4. Submit a real Free AI Operations Audit request through the frontend.

5. Verify the frontend success state says:

```text
Audit Request Received
```

6. Verify the Supabase row:

```sql
select id, created_at, work_email, company_website, status, source
from public.audit_requests
order by created_at desc
limit 5;
```

7. Verify the internal work item row:

```sql
select id, created_at, audit_request_id, status, priority, detected_pains, recommended_systems, next_action
from public.audit_work_items
order by created_at desc
limit 5;
```

8. Verify internal workspace access if configured:

```text
https://YOUR_DOMAIN/internal/audits?key=YOUR_INTERNAL_KEY
```

Expected:

- invalid or missing key shows `Access required`
- valid key shows `Internal Audit Operations`
- the route is not linked from public navigation

9. Verify a status update from the internal workspace or with curl:

```bash
curl -i -X PATCH https://YOUR_DOMAIN/api/internal/audit-work-items \
  -H "Content-Type: application/json" \
  -H "x-flowops-internal-key: YOUR_INTERNAL_KEY" \
  -d '{
    "id": "AUDIT_WORK_ITEM_UUID",
    "status": "reviewing",
    "followUpStatus": "drafted",
    "nextAction": "Prepare audit response.",
    "internalNotes": "Reviewed in internal workspace."
  }'
```

Expected: HTTP `200` and `success: true`.

10. Verify Resend notification email if configured.

11. Verify internal response draft creation if the internal workspace is configured:

```text
https://YOUR_DOMAIN/internal/audits/AUDIT_WORK_ITEM_UUID?key=YOUR_INTERNAL_KEY
```

Expected:

- valid key shows `Internal Audit Response Draft`
- first open creates an `audit_response_drafts` row
- draft text is template-based and does not claim audit completion
- no client email is sent automatically

12. Verify draft editing:

```bash
curl -i -X PATCH https://YOUR_DOMAIN/api/internal/audit-response-drafts \
  -H "Content-Type: application/json" \
  -H "x-flowops-internal-key: YOUR_INTERNAL_KEY" \
  -d '{
    "id": "AUDIT_RESPONSE_DRAFT_UUID",
    "status": "reviewed",
    "subject": "FlowOps audit next steps",
    "internalReviewNotes": "Reviewed internally. Ready for manual follow-up edits."
  }'
```

Expected: HTTP `200` and `success: true`.

13. Verify n8n workflow execution if `N8N_AUDIT_WEBHOOK_URL` is configured.

## F. End-To-End QA

Before production launch, run:

```text
docs/e2e-qa-checklist.md
```

It covers public form submission, validation errors, honeypot rejection, rate limiting, Supabase rows, internal access, status updates, draft opening/editing, and optional Resend/n8n verification.

## G. Troubleshooting

### HTTP 503 Missing Config

Likely cause:

- `NEXT_PUBLIC_SUPABASE_URL` missing
- `SUPABASE_SERVICE_ROLE_KEY` missing

Fix:

- Add both env vars locally and in production.
- Restart local dev server or redeploy production.

### HTTP 400 Validation Error

Likely cause:

- invalid `workEmail`
- missing both `mainOperationalPain` and `biggestBottleneck`
- invalid `companyWebsite`
- honeypot field filled
- oversized text field

Fix:

- Check the API response `fieldErrors`.
- Submit a valid email and at least one meaningful pain/bottleneck field.

### Supabase Insert Error

Likely cause:

- schema not applied
- table name mismatch
- service role key belongs to another Supabase project
- project URL/key mismatch
- `audit_work_items` missing after Stage 4 schema changes
- `audit_response_drafts` missing after Stage 6 schema changes

Fix:

- Re-run `supabase/schema.sql`.
- Verify `public.audit_requests`, `public.audit_work_items`, and `public.audit_response_drafts` exist.
- Verify production env vars point to the same Supabase project.

Important: if `audit_requests` storage succeeds but `audit_work_items` creation fails, the user still receives success and the server logs the internal work item error. Fix the schema and manually triage any captured requests that did not receive work items.

### Resend Sender Or Domain Issue

Likely cause:

- `RESEND_API_KEY` missing or invalid
- sender domain not verified
- Resend account restrictions

Fix:

- Verify the Resend API key.
- Configure a verified sending domain.
- Update the `from` value in `lib/email/audit-notification.ts` if needed.

Important: Resend failure after Supabase insert does not erase the lead capture. The API still returns success if storage succeeded.

### n8n Webhook Timeout Or Failure

Likely cause:

- invalid webhook URL
- inactive workflow
- n8n endpoint timeout
- payload rejected by workflow

Fix:

- Confirm the webhook URL is active.
- Inspect n8n execution logs.
- Keep webhook handling idempotent because requests are already stored in Supabase.

Important: n8n failure after Supabase insert does not erase the lead capture. The API still returns success if storage succeeded.

### CORS Concerns

The frontend posts to the same Next.js origin at `/api/audit-request`, so browser CORS should not be an issue for the normal website flow.

Do not expose Supabase direct insert from the browser unless you intentionally add and review an anon insert RLS policy.

### Internal Workspace Access Issues

Likely cause:

- missing `FLOWOPS_INTERNAL_ACCESS_KEY`
- wrong `?key=` value
- wrong `x-flowops-internal-key` header for PATCH
- Supabase env vars missing
- `audit_work_items` schema not applied

Fix:

- Configure `FLOWOPS_INTERNAL_ACCESS_KEY` in production.
- Redeploy after changing env vars.
- Re-apply `supabase/schema.sql`.
- Confirm `/internal/audits` is not linked from public navigation.

Important: the Stage 5 internal workspace uses temporary shared-key access. It should be replaced by authenticated admin access before broader team use.

### Internal Draft Page Issues

Likely cause:

- missing `audit_response_drafts` table
- invalid work item id
- wrong internal key
- Supabase service role env vars missing

Fix:

- Re-run the updated `supabase/schema.sql`.
- Open the draft from `/internal/audits?key=YOUR_INTERNAL_KEY` using `Open draft`.
- Confirm no automatic client email sending is expected in Stage 6.

## Sources

- [Supabase Row Level Security docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase API security docs](https://supabase.com/docs/guides/api/securing-your-api)
