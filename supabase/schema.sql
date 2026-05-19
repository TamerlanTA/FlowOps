-- FlowOps audit capture and internal operations schema
--
-- Security model:
-- - The website submits audit requests to a Next.js server route.
-- - The server route uses SUPABASE_SERVICE_ROLE_KEY server-side only.
-- - The service role key must never be exposed to browser/client components.
-- - RLS is enabled for defense in depth.
-- - No public SELECT/UPDATE/DELETE policies are created.
-- - No anon INSERT policy is required for the preferred server-route model.
-- - Internal audit work items are created by the server route only and should
--   later be exposed only through an authenticated admin/service layer.
-- - Internal response drafts are generated and edited through the server/service
--   layer only. They are not sent to clients automatically.

create extension if not exists pgcrypto;

create table if not exists public.audit_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  work_email text not null,
  company_website text,
  business_type text,
  main_operational_pain text,
  team_size text,
  current_tools text,
  biggest_bottleneck text,
  source text not null default 'flowops_website',
  status text not null default 'new',
  raw_payload jsonb,
  user_agent text,
  page_url text
);

create index if not exists audit_requests_created_at_idx
  on public.audit_requests (created_at desc);

create index if not exists audit_requests_status_idx
  on public.audit_requests (status);

create index if not exists audit_requests_work_email_idx
  on public.audit_requests (work_email);

alter table public.audit_requests enable row level security;

comment on table public.audit_requests is
  'Inbound FlowOps AI Operations Audit requests. Inserted by the Next.js API route with the Supabase service role key.';

comment on column public.audit_requests.raw_payload is
  'Full normalized request snapshot for fields not promoted to first-class columns, such as selected system interest or company name.';

create table if not exists public.audit_work_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  audit_request_id uuid not null references public.audit_requests(id) on delete cascade,
  status text not null default 'new',
  priority text not null default 'normal',
  company_website text,
  work_email text not null,
  business_type text,
  team_size text,
  detected_pains text[] not null default '{}',
  recommended_systems text[] not null default '{}',
  internal_notes text,
  next_action text,
  follow_up_status text not null default 'not_started',
  follow_up_due_at timestamptz,
  raw_payload jsonb
);

create index if not exists audit_work_items_audit_request_id_idx
  on public.audit_work_items (audit_request_id);

create index if not exists audit_work_items_status_idx
  on public.audit_work_items (status);

create index if not exists audit_work_items_priority_idx
  on public.audit_work_items (priority);

create index if not exists audit_work_items_follow_up_status_idx
  on public.audit_work_items (follow_up_status);

create index if not exists audit_work_items_created_at_idx
  on public.audit_work_items (created_at desc);

alter table public.audit_work_items enable row level security;

comment on table public.audit_work_items is
  'Internal FlowOps audit operations queue. Created by the server route after an audit request is stored. No public access policies should be added.';

comment on column public.audit_work_items.detected_pains is
  'Deterministic rule-based operational pain tags inferred from the submitted audit request. No LLM analysis is performed at capture time.';

comment on column public.audit_work_items.recommended_systems is
  'Deterministic recommended FlowOps systems for internal triage, such as LeadOS, SalesOS, VoiceOS, InboxOS, OpsOS, and ReportOS.';

create table if not exists public.audit_response_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  audit_work_item_id uuid not null references public.audit_work_items(id) on delete cascade,
  audit_request_id uuid not null references public.audit_requests(id) on delete cascade,
  status text not null default 'draft',
  subject text,
  opening_summary text,
  pain_summary text,
  recommended_systems_summary text,
  proposed_next_steps text,
  follow_up_email_body text,
  internal_review_notes text,
  raw_payload jsonb
);

create index if not exists audit_response_drafts_audit_work_item_id_idx
  on public.audit_response_drafts (audit_work_item_id);

create index if not exists audit_response_drafts_audit_request_id_idx
  on public.audit_response_drafts (audit_request_id);

create index if not exists audit_response_drafts_status_idx
  on public.audit_response_drafts (status);

create index if not exists audit_response_drafts_created_at_idx
  on public.audit_response_drafts (created_at desc);

alter table public.audit_response_drafts enable row level security;

comment on table public.audit_response_drafts is
  'Internal structured audit response drafts generated from audit work items. No public access policies should be added.';

comment on column public.audit_response_drafts.follow_up_email_body is
  'Template-based internal follow-up email draft. This is not sent automatically.';

comment on column public.audit_response_drafts.raw_payload is
  'Snapshot of the work item and deterministic template inputs used to create the draft. No LLM generation is performed.';
