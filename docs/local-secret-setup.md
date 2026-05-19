# Local Secret Setup

Use this guide to create a local `.env.local` for FlowOps production activation testing.

Do not commit `.env.local`. Do not paste real values into docs, tickets, screenshots, terminal transcripts, or chat.

## 1. Confirm `.env.local` Is Ignored

The project `.gitignore` includes:

```text
.env*
```

Verify locally:

```bash
git check-ignore -v .env.local
```

Expected: git prints the `.gitignore` rule that ignores `.env.local`.

## 2. Create `.env.local`

Create the file at:

```text
/Users/tamerlan/Desktop/FlowOps2/.env.local
```

Use this structure with real values filled in locally only:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FLOWOPS_INTERNAL_ACCESS_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
FLOWOPS_NOTIFICATION_EMAIL=
N8N_AUDIT_WEBHOOK_URL=
```

## 3. Required For MVP Activation

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FLOWOPS_INTERNAL_ACCESS_KEY`

These allow:

```text
POST /api/audit-request -> audit_requests -> audit_work_items -> internal review in /internal/audits
```

`NEXT_PUBLIC_SUPABASE_URL` is public-safe, but it still belongs in `.env.local` for local runtime configuration.

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed publicly.

`FLOWOPS_INTERNAL_ACCESS_KEY` protects the temporary internal workspace. Use a long random value and treat it like a password.

## 4. Optional Variables

Optional future paid email notification:

- `RESEND_API_KEY`
- `FLOWOPS_NOTIFICATION_EMAIL`

Resend is not required for MVP launch. Audit lead capture works without email notification.

Optional free notification path:

- `N8N_AUDIT_WEBHOOK_URL`

Preferred free notification path:

```text
N8N_AUDIT_WEBHOOK_URL -> n8n workflow -> Telegram message
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is documented for future browser-safe Supabase use. The current audit insert path does not use it from the browser.

## 5. Server-Only Secrets

Never expose these values in client components or `NEXT_PUBLIC_` variables:

- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `N8N_AUDIT_WEBHOOK_URL`
- `FLOWOPS_INTERNAL_ACCESS_KEY`

Treat `FLOWOPS_INTERNAL_ACCESS_KEY` like a temporary password. Use a long random value in production.

## 6. Check Env Presence Without Printing Secrets

Run:

```bash
npm run check:env
```

Expected:

- required variables show `present`
- optional variables show `present` or `missing`
- missing Resend variables warn only and do not fail MVP activation
- no secret values are printed

## 7. Local Smoke Test Flow

After `.env.local` is configured:

```bash
npm run lint
npm run build
npm run dev
```

Then follow:

```text
docs/e2e-qa-checklist.md
```

If real values are not configured yet, live E2E remains pending.
