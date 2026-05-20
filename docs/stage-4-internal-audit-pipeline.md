# Stage 4 Internal Audit Operations Pipeline

Stage 4 adds the first internal operations layer behind the Free AI Operations Audit request.

The public website experience is unchanged. There is still no auth, payment, public dashboard, admin panel, or AI-generated report.

## What Was Added

- `public.audit_work_items` in `supabase/schema.sql`
- `lib/audit/create-work-item.ts`
- audit work item creation inside `POST /api/audit-request`
- optional internal triage fields in Resend notification payloads
- optional internal triage fields in n8n webhook payloads

The capture flow is now:

```text
Frontend audit form
-> POST /api/audit-request
-> Supabase audit_requests row
-> Supabase audit_work_items row
-> optional Resend notification
-> optional n8n webhook
```

## Schema Changes

`supabase/schema.sql` now creates two tables:

- `audit_requests`: inbound website submissions
- `audit_work_items`: internal FlowOps audit operations queue

`audit_work_items` includes:

- `audit_request_id`
- `status`
- `priority`
- `company_website`
- `work_email`
- `business_type`
- `team_size`
- `detected_pains`
- `recommended_systems`
- `internal_notes`
- `next_action`
- `follow_up_status`
- `follow_up_due_at`
- `raw_payload`

Indexes were added for:

- `audit_request_id`
- `status`
- `priority`
- `follow_up_status`
- `created_at`

RLS is enabled. No public policies are created. The table is intended for server-side service role writes now and an authenticated internal admin/service layer later.

## Deterministic Classification Logic

`lib/audit/create-work-item.ts` performs rule-based classification only.

It looks at submitted pain, bottleneck, tools, business type, and selected system interest.

Current mapping:

- lead generation, missed leads, lead qualification -> `LeadOS`
- follow-up, pipeline, CRM -> `SalesOS`
- phone, calls, receptionist -> `VoiceOS`
- email, support, inbox -> `InboxOS`
- manual process, handoff, spreadsheets -> `OpsOS`
- reporting, visibility, KPIs -> `ReportOS`

Priority is:

- `high` when multiple severe pain signals are detected or three or more pain categories match
- `normal` by default

The default internal next action is:

```text
Review operational pain and prepare audit response
```

No LLM calls are made in this stage.

## Request To Work Item Flow

1. The API route validates and normalizes the incoming request.
2. The route inserts the original request into `audit_requests`.
3. After the insert succeeds, the route creates an `audit_work_items` row.
4. If work item creation fails, the API logs a minimal server-side error and continues.
5. Resend and n8n receive triage metadata when a work item was created.
6. The user still receives success as long as the original audit request was saved.

This keeps lead capture reliable while adding internal operational visibility.

## Email And n8n Payloads

Resend notification can now include:

- audit request ID
- audit work item ID
- detected pains
- recommended systems
- priority
- next action

n8n webhook payload can now receive:

- `audit_request_id`
- `audit_work_item_id`
- detected pain tags
- recommended systems
- priority
- next action
- original normalized request payload

Notifications remain optional and non-blocking after storage.

## How This Supports A Future Internal Workspace

`audit_work_items` is the foundation for a future internal audit workspace where the FlowOps team can:

- triage new audit requests
- filter by status, priority, and follow-up state
- assign next actions
- track recommended FlowOps systems
- build the first audit response without exposing internal data publicly

That future workspace should require authentication and a reviewed authorization model before any internal data is exposed.

## Local Testing

Run:

```bash
npm run lint
npm run build
npm run dev
```

With Supabase env vars configured and `supabase/schema.sql` applied, submit:

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

- HTTP `200`
- row in `audit_requests`
- row in `audit_work_items`
- `detected_pains` includes lead, sales, manual operations, or reporting signals depending on submitted text
- `recommended_systems` includes matching FlowOps systems
- `priority` is `high` when multiple severe signals are present

## Manual Classification Test Cases

There is no existing unit test framework in this project, so Stage 4 does not add a new test stack.

Suggested manual cases:

- `"missed leads and lead qualification"` -> `LeadOS`
- `"CRM follow-up and stale pipeline"` -> `SalesOS`
- `"missed calls and no receptionist"` -> `VoiceOS`
- `"support inbox backlog and unanswered email"` -> `InboxOS`
- `"manual handoffs and spreadsheets"` -> `OpsOS`
- `"reporting gaps and no KPI visibility"` -> `ReportOS`
- multiple severe signals -> `high` priority

## Intentionally Not Included

- public client dashboard
- admin UI
- authentication
- payments
- database reads from the browser
- LLM-generated audit reports
- automatic outreach or follow-up sequencing
- rate limiting

Rate limiting and authenticated internal operations should be handled before high-volume production traffic.
