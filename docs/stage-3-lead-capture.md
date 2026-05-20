# Stage 3 Lead Capture

## What Was Implemented

Stage 3 wires the Free AI Operations Audit request into a production-oriented server flow:

- `POST /api/audit-request` validates and normalizes audit requests.
- Requests are stored first in Supabase table `audit_requests`.
- Resend notification email is sent after storage when configured.
- n8n webhook forwarding runs after storage when configured.
- Resend or n8n failures do not fail the user request after Supabase insert succeeds.
- The frontend audit form now shows loading, success, and safe error states.
- A hidden honeypot field rejects simple bot submissions.

No auth, payments, client portal login, or full SaaS backend was added.

## Required Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
FLOWOPS_NOTIFICATION_EMAIL=
N8N_AUDIT_WEBHOOK_URL=
```

Required for database capture:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional notifications:

- `RESEND_API_KEY`
- `FLOWOPS_NOTIFICATION_EMAIL`
- `N8N_AUDIT_WEBHOOK_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is documented for future browser-safe Supabase work, but the Stage 3 audit request flow does not use it in client components.

## Apply Supabase Schema

Run the SQL in:

```bash
supabase/schema.sql
```

The schema creates `public.audit_requests` with RLS enabled. The intended security model is:

- Browser submits to the Next.js API route.
- Next.js route inserts with server-only `SUPABASE_SERVICE_ROLE_KEY`.
- No public select/update/delete policies are created.
- No anon insert policy is required because inserts do not happen directly from the browser.

## Local Testing

Start the app:

```bash
npm run dev
```

Test validation without env configuration:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "companyWebsite": "example.com",
    "businessType": "B2B services",
    "mainOperationalPain": "Leads are missed and follow-up depends on manual reminders.",
    "teamSize": "11-25",
    "currentTools": "HubSpot, Gmail, Slack",
    "biggestBottleneck": "CRM updates and follow-up are not reliable.",
    "selectedSystem": "SalesOS",
    "pageUrl": "http://localhost:3000"
  }'
```

Expected without Supabase env:

- HTTP `503`
- JSON `success: false`
- Development message explaining missing Supabase configuration

Expected with Supabase env and schema applied:

- HTTP `200`
- JSON `success: true`
- `requestId` returned
- row inserted into `audit_requests`

Test honeypot rejection:

```bash
curl -i -X POST http://localhost:3000/api/audit-request \
  -H "Content-Type: application/json" \
  -d '{
    "workEmail": "ops@example.com",
    "mainOperationalPain": "Manual reporting.",
    "companyNameConfirm": "bot-filled"
  }'
```

Expected:

- HTTP `400`
- safe user-facing error

## API Behavior

The route:

- accepts `POST` JSON only
- validates `workEmail`
- trims and normalizes `companyWebsite`
- requires either `mainOperationalPain` or `biggestBottleneck`
- rejects oversized text fields
- rejects filled honeypot field
- stores row in Supabase first
- sends Resend and n8n notifications after storage
- logs minimal server-side errors without secrets

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is used only in server code.
- Do not import `lib/supabase/server.ts` into client components.
- RLS is enabled on `audit_requests`.
- Public read/update/delete is intentionally not allowed.
- The current route includes basic anti-spam only. Add rate limiting before high-volume paid traffic.

## Future Wiring

Recommended next step:

1. Add production Supabase env variables.
2. Apply `supabase/schema.sql`.
3. Configure `FLOWOPS_NOTIFICATION_EMAIL` and `RESEND_API_KEY`.
4. Add `N8N_AUDIT_WEBHOOK_URL` when the internal audit pipeline is ready.
5. Build the n8n workflow that turns audit requests into internal tasks, scoring, and follow-up.
