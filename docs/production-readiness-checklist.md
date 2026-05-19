# Production Readiness Checklist

Use this checklist before turning on real FlowOps audit request capture.

## Code And Build

- [ ] `npm install` completed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] No secrets are committed to git.
- [ ] `.env.example` contains placeholders only.
- [ ] `.env.local` has been created locally using `docs/local-secret-setup.md`.
- [ ] `git check-ignore -v .env.local` confirms local secrets are ignored.
- [ ] `npm run check:env` passes without printing secret values.

## Supabase

- [ ] Supabase production project exists.
- [ ] `supabase/schema.sql` has been applied in the production project, or migrations have been applied in order.
- [ ] Migration order verified: `001_audit_requests.sql`, `002_audit_work_items.sql`, `003_audit_response_drafts.sql`.
- [ ] `public.audit_requests` table exists.
- [ ] `public.audit_work_items` table exists.
- [ ] `public.audit_response_drafts` table exists.
- [ ] RLS is enabled on `public.audit_requests`.
- [ ] RLS is enabled on `public.audit_work_items`.
- [ ] RLS is enabled on `public.audit_response_drafts`.
- [ ] `audit_requests` indexes exist for `created_at`, `status`, and `work_email`.
- [ ] `audit_work_items` indexes exist for `audit_request_id`, `created_at`, `status`, `priority`, and `follow_up_status`.
- [ ] `audit_response_drafts` indexes exist for `audit_work_item_id`, `audit_request_id`, `created_at`, and `status`.
- [ ] No public select/update/delete policies exist.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is configured server-side only.
- [ ] Browser does not write directly to Supabase.

## Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configured.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured.
- [ ] `FLOWOPS_INTERNAL_ACCESS_KEY` configured for MVP internal monitoring.
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured only if needed for future client-side Supabase work.
- [ ] `RESEND_API_KEY` omitted or configured only if paid Resend notification is intentionally enabled later.
- [ ] `FLOWOPS_NOTIFICATION_EMAIL` omitted or configured only if paid Resend notification is intentionally enabled later.
- [ ] `N8N_AUDIT_WEBHOOK_URL` configured only if free n8n-to-Telegram notification is required.
- [ ] `FLOWOPS_INTERNAL_ACCESS_KEY` is long, random, and not shared through screenshots or public docs.

## End-To-End Test

- [ ] Submit a real audit request from the production frontend.
- [ ] Frontend shows `Audit Request Received`.
- [ ] Supabase row is created in `audit_requests`.
- [ ] Internal row is created in `audit_work_items`.
- [ ] `work_email`, `company_website`, `business_type`, `main_operational_pain`, `team_size`, `current_tools`, and `biggest_bottleneck` are stored correctly.
- [ ] `detected_pains`, `recommended_systems`, `priority`, and `next_action` are populated for the internal work item.
- [ ] `raw_payload`, `user_agent`, and `page_url` are populated.
- [ ] Resend is confirmed optional; missing Resend env vars do not block audit capture.
- [ ] Optional n8n workflow receives payload if webhook is configured.
- [ ] Full `docs/e2e-qa-checklist.md` has been completed.

## MVP Success Criteria Without Resend

- [ ] `audit_requests` row is created.
- [ ] `audit_work_items` row is created.
- [ ] `/internal/audits?key=VALID_KEY` opens.
- [ ] `/internal/audits/[id]?key=VALID_KEY` opens and creates `audit_response_drafts`.
- [ ] status and draft editing work.
- [ ] Team can monitor new requests from the internal workspace without email notification.

## Internal Audit Workspace

- [ ] `/internal/audits` without a key shows `Access required`.
- [ ] `/internal/audits?key=wrong` shows `Access required`.
- [ ] `/internal/audits?key=VALID_KEY` loads `Internal Audit Operations`.
- [ ] Internal audit work items render with company, email, pains, systems, priority, status, follow-up status, next action, and created timestamp.
- [ ] Status update from the internal workspace succeeds.
- [ ] `PATCH /api/internal/audit-work-items` without `x-flowops-internal-key` returns HTTP `401`.
- [ ] `PATCH /api/internal/audit-work-items` with invalid status returns HTTP `400`.
- [ ] Internal PATCH rate limit returns HTTP `429` after excessive updates.
- [ ] Internal route is not linked from public navigation.

## Internal Response Drafting

- [ ] Each work item has an `Open draft` link.
- [ ] `/internal/audits/[id]?key=VALID_KEY` loads `Internal Audit Response Draft`.
- [ ] First draft open creates a row in `audit_response_drafts`.
- [ ] Draft includes subject, opening summary, pain summary, recommended systems summary, proposed next steps, follow-up email body, and internal review notes.
- [ ] Draft copy does not claim the audit is complete.
- [ ] Draft copy does not include invented metrics.
- [ ] Editing a draft succeeds from the internal page.
- [ ] `PATCH /api/internal/audit-response-drafts` without `x-flowops-internal-key` returns HTTP `401`.
- [ ] `PATCH /api/internal/audit-response-drafts` with invalid status returns HTTP `400`.
- [ ] Draft PATCH rate limit returns HTTP `429` after excessive updates.
- [ ] No client email is sent automatically from the draft page.

## Security And Operations

- [ ] Service role key is not present in client bundles, browser code, screenshots, logs, or docs.
- [ ] Resend sender/domain is production-ready.
- [ ] n8n webhook is idempotent and can tolerate duplicate or retried processing.
- [ ] Basic honeypot test returns HTTP `400`.
- [ ] Invalid email test returns HTTP `400`.
- [ ] Public audit request rate limit returns HTTP `429` after excessive submissions.
- [ ] Missing config test returns HTTP `503` in development.
- [ ] Temporary internal access key is treated as a secret and not shared in screenshots or public docs.

## Known Pending Items

- [ ] In-memory rate limiting has been replaced or accepted as temporary for the deployment environment.
- [ ] Serverless limitation of in-memory rate limiting has been reviewed.
- [ ] Proper authenticated admin access is still pending for the internal workspace.
- [ ] AI-assisted draft generation is not implemented yet and should require review guardrails.
- [ ] Dependency vulnerabilities from `npm audit` have been reviewed. Stage 7 audit reported 7 findings: 3 moderate and 4 high. `npm audit fix --force` would move `next` outside the current dependency range, so no automatic fix was applied.
- [ ] Production monitoring/log review process is defined.
- [ ] Manual desktop/mobile frontend QA completed.
