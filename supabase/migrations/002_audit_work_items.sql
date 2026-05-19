-- FlowOps migration 002: internal audit work items
-- Requires 001_audit_requests.sql.

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
