# Stage 6 Internal Audit Response Drafting

Stage 6 adds an internal, deterministic response drafting system for FlowOps audit work items.

This is internal-only. It does not add a public dashboard, client login, payments, email sending, LLM calls, or AI-generated audit reports.

## What Was Added

- `audit_response_drafts` table in `supabase/schema.sql`
- `lib/audit/create-response-draft.ts`
- draft helper functions in `lib/audit/admin.ts`
- internal draft page at `/internal/audits/[id]?key=...`
- draft edit API at `PATCH /api/internal/audit-response-drafts`
- client editor component at `components/internal/AuditResponseDraftEditor.tsx`
- `Open draft` link from `/internal/audits`

The internal flow is now:

```text
audit_work_items row
-> open /internal/audits/[id]?key=...
-> get or create audit_response_drafts row
-> edit structured draft internally
-> no automatic client email sending
```

## Schema Changes

`supabase/schema.sql` now includes:

- `audit_requests`
- `audit_work_items`
- `audit_response_drafts`

`audit_response_drafts` fields:

- `id`
- `created_at`
- `updated_at`
- `audit_work_item_id`
- `audit_request_id`
- `status`
- `subject`
- `opening_summary`
- `pain_summary`
- `recommended_systems_summary`
- `proposed_next_steps`
- `follow_up_email_body`
- `internal_review_notes`
- `raw_payload`

Indexes:

- `audit_work_item_id`
- `audit_request_id`
- `status`
- `created_at`

RLS is enabled. No public policies are created. Access is through the server/service layer only.

## Draft Generation Logic

Draft generation is deterministic and template-based.

Inputs:

- company website
- work email
- business type
- team size
- detected pains
- recommended systems
- priority
- work item status
- next action

Generated fields:

- subject
- opening summary
- pain summary
- recommended systems summary
- proposed next steps
- follow-up email body
- internal review notes

Rules:

- Do not invent metrics.
- Do not claim audit completion.
- Do not claim AI-generated audit reports.
- Use language such as: “Based on your audit request, we identified a few likely operational areas to review...”
- Position the next step as a diagnostic review or short discovery call.
- Keep the draft professional, clear, and concise.

## How To Open And Edit A Draft

Open the internal list:

```text
/internal/audits?key=YOUR_INTERNAL_KEY
```

Click:

```text
Open draft
```

Or open directly:

```text
/internal/audits/AUDIT_WORK_ITEM_ID?key=YOUR_INTERNAL_KEY
```

On first open, the server creates an `audit_response_drafts` row if one does not already exist.

Editable fields:

- status
- subject
- opening summary
- pain summary
- recommended systems summary
- proposed next steps
- follow-up email body
- internal review notes

Allowed draft statuses:

- `draft`
- `reviewed`
- `ready_to_send`
- `sent`
- `archived`

## Draft Edit API

Route:

```text
PATCH /api/internal/audit-response-drafts
```

Required header:

```text
x-flowops-internal-key: YOUR_INTERNAL_KEY
```

Accepted JSON fields:

- `id`
- `status`
- `subject`
- `openingSummary`
- `painSummary`
- `recommendedSystemsSummary`
- `proposedNextSteps`
- `followUpEmailBody`
- `internalReviewNotes`

The route validates the internal key, draft id, status, and field lengths. It returns safe JSON errors and logs minimal server-side details.

## Why Email Is Not Sent Automatically

Stage 6 prepares response content only.

No automatic client email is sent because:

- the draft must be reviewed by a human
- the audit is not complete at request time
- client claims and metrics must be verified
- the shared-key internal workspace is not a full production admin system yet

Email sending can be added later after authenticated admin access, review workflow, and sender/domain policy are finalized.

## Security Limitations

This stage inherits the Stage 5 temporary shared-key model:

- anyone with the key can open and edit internal drafts
- the key is passed to the client editor for PATCH updates
- the route must not be linked publicly
- the key should be rotated if exposed

Replace this with proper authenticated admin access before broader team use.

## Future AI-Assisted Draft Plan

Later, FlowOps can add AI-assisted draft generation after the internal workflow is stable.

Recommended future guardrails:

- human review required before sending
- clear label for AI-assisted text
- no unverified metrics
- source fields shown beside generated text
- audit log of prompt/input/output
- strict rate limits and permission checks
- no direct email sending without explicit admin action

## Test Steps

Run:

```bash
npm run lint
npm run build
```

Manual checks:

- apply the updated `supabase/schema.sql`
- open `/internal/audits?key=VALID_KEY`
- click `Open draft`
- verify `/internal/audits/[id]?key=VALID_KEY` loads
- verify an `audit_response_drafts` row is created on first open
- edit draft fields and save
- verify `PATCH /api/internal/audit-response-drafts` returns `success: true`
- confirm no client email is sent
- confirm invalid key shows `Access required` or returns HTTP `401`
