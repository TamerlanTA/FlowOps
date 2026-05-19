# Stage 5 Internal Admin Audit Workspace

Stage 5 adds a minimal internal workspace for FlowOps to view and manage incoming AI Operations Audit work items.

This is internal-only. It is not a client portal, public SaaS dashboard, auth system, payment flow, or customer-facing workspace.

## What Was Added

- `FLOWOPS_INTERNAL_ACCESS_KEY` placeholder in `.env.example`
- `lib/internal/access.ts`
- `lib/audit/admin.ts`
- `app/internal/audits/page.tsx`
- `app/api/internal/audit-work-items/route.ts`
- `components/internal/AuditWorkItemActions.tsx`

The internal workspace route is:

```text
/internal/audits?key=YOUR_INTERNAL_KEY
```

It is intentionally not linked from the public navigation.

## Access Model

Stage 5 uses a temporary shared internal access key.

- Admin page reads `?key=...` server-side.
- PATCH API reads `x-flowops-internal-key`.
- The configured key is read only from `FLOWOPS_INTERNAL_ACCESS_KEY`.
- The configured key is never exposed through a `NEXT_PUBLIC_` variable.
- In production, access fails closed if `FLOWOPS_INTERNAL_ACCESS_KEY` is missing.
- In local development only, if no key is configured, the fallback key is:

```text
flowops-dev-internal
```

This fallback exists only to keep local testing explicit and replaceable.

## Temporary Security Limitation

For V1 status updates, the client action component receives the provided access key from the page and sends it to the internal PATCH route as a header.

That means anyone with the URL key can update work items. Treat the key like a password:

- do not publish it
- do not put it in screenshots
- rotate it if shared accidentally
- replace this model with proper authenticated admin access before broader production use

## Admin Page Behavior

The page shows:

- company website
- work email
- business type
- team size
- detected pains
- recommended systems
- priority
- status
- follow-up status
- next action
- created timestamp
- internal notes editor

Filters:

- all
- new
- reviewing
- high priority

The page is labelled `Internal Audit Operations` and explicitly says it is not a client portal.

## Update API Behavior

Route:

```text
PATCH /api/internal/audit-work-items
```

Required header:

```text
x-flowops-internal-key: YOUR_INTERNAL_KEY
```

Accepted JSON fields:

- `id`
- `status`
- `followUpStatus`
- `internalNotes`
- `nextAction`

Allowed `status` values:

- `new`
- `reviewing`
- `response_prepared`
- `contacted`
- `closed`

Allowed `followUpStatus` values:

- `not_started`
- `drafted`
- `sent`
- `waiting`
- `completed`

The route returns safe JSON errors and logs minimal server-side details.

## How To Open Locally

Set `.env.local`:

```bash
FLOWOPS_INTERNAL_ACCESS_KEY=replace-with-local-secret
```

Then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/internal/audits?key=replace-with-local-secret
```

If no local key is configured, development fallback:

```text
http://localhost:3000/internal/audits?key=flowops-dev-internal
```

Do not rely on the fallback in production.

## Status Update Test

With Supabase env vars configured and at least one `audit_work_items` row:

```bash
curl -i -X PATCH http://localhost:3000/api/internal/audit-work-items \
  -H "Content-Type: application/json" \
  -H "x-flowops-internal-key: replace-with-local-secret" \
  -d '{
    "id": "AUDIT_WORK_ITEM_UUID",
    "status": "reviewing",
    "followUpStatus": "drafted",
    "nextAction": "Prepare audit response and send next-step email.",
    "internalNotes": "Reviewed from Stage 5 workspace."
  }'
```

Expected:

- HTTP `200`
- `success: true`
- updated row returned
- `updated_at` changes

Invalid key expected:

- HTTP `401`
- `success: false`

Invalid status expected:

- HTTP `400`
- `success: false`

## Test Steps

Run:

```bash
npm run lint
npm run build
```

Manual checks:

- `/internal/audits` without key shows `Access required`
- `/internal/audits?key=wrong` shows `Access required`
- valid key loads internal work items
- save update changes status/follow-up/notes/next action
- PATCH without `x-flowops-internal-key` returns `401`
- public navigation does not link to the internal route

## Future Replacement

Replace shared-key access with:

- proper admin authentication
- role-based authorization
- secure session handling
- audit logs for internal updates
- protected internal routes without URL keys
- possibly row-level policies for authenticated admin roles

Do this before adding more internal users or exposing richer operational data.
