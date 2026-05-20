-- FlowOps migration 001: inbound audit requests
-- Apply before 002_audit_work_items.sql and 003_audit_response_drafts.sql.

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
