-- FlowOps migration 003: internal audit response drafts
-- Requires 001_audit_requests.sql and 002_audit_work_items.sql.

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
