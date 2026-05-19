# End-To-End QA Checklist

Use this checklist before enabling real FlowOps audit operations in production.

## Prerequisites

- Apply Supabase migrations in order:
  1. `supabase/migrations/001_audit_requests.sql`
  2. `supabase/migrations/002_audit_work_items.sql`
  3. `supabase/migrations/003_audit_response_drafts.sql`
- Or apply the full snapshot: `supabase/schema.sql`
- Configure required env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `FLOWOPS_INTERNAL_ACCESS_KEY`
- Configure optional env vars as needed:
  - `RESEND_API_KEY`
  - `FLOWOPS_NOTIFICATION_EMAIL`
  - `N8N_AUDIT_WEBHOOK_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Run:

```bash
npm run lint
npm run build
```

Resend is optional and email notification is postponed for MVP launch. The team can monitor new requests in `/internal/audits?key=...`. The preferred free notification path is:

```text
N8N_AUDIT_WEBHOOK_URL -> n8n workflow -> Telegram message
```

## MVP Success Criteria Without Resend

Minimum pass:

1. `audit_requests` row is created.
2. `audit_work_items` row is created.
3. `/internal/audits?key=VALID_INTERNAL_KEY` opens.
4. `/internal/audits/[id]?key=VALID_INTERNAL_KEY` opens and creates `audit_response_drafts`.
5. status and draft editing work.

## Public Audit Form

### Valid Submission

1. Open the public website.
2. Complete the Free AI Operations Audit form with a valid work email.
3. Include at least one meaningful operational pain or bottleneck.
4. Submit the form.

Or use curl:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "companyWebsite": "https://example.com",
    "businessType": "B2B services",
    "mainOperationalPain": "Missed leads and slow CRM follow-up create stale pipeline.",
    "teamSize": "11-25",
    "currentTools": "HubSpot, Gmail, spreadsheets",
    "biggestBottleneck": "Manual reporting and follow-up reminders are unreliable.",
    "selectedSystem": "SalesOS",
    "pageUrl": "http://localhost:3000"
  }'
```

Expected:

- frontend shows `Audit Request Received`
- API returns HTTP `200`
- response includes `success: true`
- no duplicate user-facing success appears before server success

### Invalid Email

Submit the form or curl with an invalid email:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "not-an-email",
    "mainOperationalPain": "Manual reporting is slow."
  }'
```

Expected:

- HTTP `400`
- `success: false`
- safe validation message

### Honeypot Rejection

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "mainOperationalPain": "Manual reporting is slow.",
    "companyNameConfirm": "bot-filled"
  }'
```

Expected:

- HTTP `400`
- safe user-facing rejection
- no Supabase rows created for that payload

### Public Rate Limit

Send 6 valid-ish audit request payloads from the same network within 10 minutes.

Example:

```bash
for i in 1 2 3 4 5 6; do
  curl -i -X POST http://localhost:3000/api/audit-request \
    -H "Content-Type: application/json" \
    -d "{
      \"workEmail\": \"ops+$i@example.com\",
      \"companyWebsite\": \"https://example.com\",
      \"businessType\": \"B2B services\",
      \"mainOperationalPain\": \"Manual workflow bottlenecks and slow follow-up.\",
      \"biggestBottleneck\": \"CRM updates depend on manual reminders.\"
    }"
done
```

Expected:

- first 5 requests proceed to normal validation/storage behavior
- 6th request returns HTTP `429`
- response includes safe message
- `Retry-After` header is present

Note: local in-memory rate limits reset when the dev server restarts.

## Supabase Rows

After a valid submission, verify:

```sql
select id, created_at, work_email, company_website, status, source
from public.audit_requests
order by created_at desc
limit 5;
```

Expected:

- latest `audit_requests` row exists
- `work_email`, `company_website`, `source`, `user_agent`, and `page_url` are populated when available

Verify work item:

```sql
select id, audit_request_id, status, priority, detected_pains, recommended_systems, next_action
from public.audit_work_items
order by created_at desc
limit 5;
```

Expected:

- latest `audit_work_items` row exists
- `audit_request_id` references the new request
- `detected_pains` and `recommended_systems` reflect deterministic rules where relevant
- `priority` is `normal` or `high`

## Internal Workspace Access

### Access Denied

Open:

```text
/internal/audits
/internal/audits?key=wrong
```

Expected:

- page shows `Access required`
- no internal data is rendered

### Access Allowed

Open:

```text
/internal/audits?key=VALID_INTERNAL_KEY
```

Expected:

- page shows `Internal Audit Operations`
- work items render
- route is not linked from public navigation

## Internal Status Update

Use the UI or curl:

```bash
curl -i -X PATCH http://localhost:3000/api/internal/audit-work-items \
  -H "Content-Type: application/json" \
  -H "x-flowops-internal-key: VALID_INTERNAL_KEY" \
  -d '{
    "id": "AUDIT_WORK_ITEM_UUID",
    "status": "reviewing",
    "followUpStatus": "drafted",
    "nextAction": "Prepare audit response.",
    "internalNotes": "QA status update."
  }'
```

Expected:

- HTTP `200`
- `success: true`
- row updates in Supabase
- invalid key returns HTTP `401`
- excessive PATCH attempts return HTTP `429`

## Response Draft

### Open Draft

From `/internal/audits?key=VALID_INTERNAL_KEY`, click `Open draft`.

Expected:

- `/internal/audits/[id]?key=VALID_INTERNAL_KEY` loads
- page shows `Internal Audit Response Draft`
- first open creates an `audit_response_drafts` row
- draft copy is template-based
- draft copy does not claim the audit is complete
- draft copy does not invent metrics

Verify row:

```sql
select id, audit_work_item_id, audit_request_id, status, subject
from public.audit_response_drafts
order by created_at desc
limit 5;
```

### Edit Draft

Use the page editor or curl:

```bash
curl -i -X PATCH http://localhost:3000/api/internal/audit-response-drafts \
  -H "Content-Type: application/json" \
  -H "x-flowops-internal-key: VALID_INTERNAL_KEY" \
  -d '{
    "id": "AUDIT_RESPONSE_DRAFT_UUID",
    "status": "reviewed",
    "subject": "FlowOps audit next steps",
    "internalReviewNotes": "QA draft edit."
  }'
```

Expected:

- HTTP `200`
- `success: true`
- draft row updates
- invalid key returns HTTP `401`
- invalid status returns HTTP `400`
- excessive PATCH attempts return HTTP `429`

## Notifications

### Optional Resend Notification

Resend is not required for MVP launch.

If `RESEND_API_KEY` and `FLOWOPS_NOTIFICATION_EMAIL` are configured later:

- submit a valid public audit request
- verify notification email arrives
- verify it includes request/work item context

If not configured:

- audit request should still store successfully
- no email is expected

### Optional n8n Webhook To Telegram

If `N8N_AUDIT_WEBHOOK_URL` is configured:

- submit a valid public audit request
- verify n8n receives the payload
- verify n8n forwards a Telegram message if that workflow is configured
- verify webhook failures do not erase stored Supabase rows

If not configured:

- audit request should still store successfully
- no webhook execution is expected

## No Automatic Client Email

Confirm:

- opening a draft does not send an email
- editing a draft does not send an email
- setting draft status to `sent` is only a manual marker
- no route sends `follow_up_email_body` to a client automatically

## Rate Limiting Limitations

Current rate limiting is in-memory:

- useful for local/dev and basic single-instance protection
- resets on server restart
- does not synchronize across serverless instances
- should be replaced later with Upstash Redis, Vercel KV, or Supabase-backed rate limiting
