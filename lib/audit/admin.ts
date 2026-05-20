import "server-only";

import { generateAuditResponseDraft } from "@/lib/audit/create-response-draft";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export const AUDIT_WORK_ITEM_STATUSES = [
  "new",
  "reviewing",
  "response_prepared",
  "contacted",
  "closed",
] as const;

export const AUDIT_FOLLOW_UP_STATUSES = [
  "not_started",
  "drafted",
  "sent",
  "waiting",
  "completed",
] as const;

export const AUDIT_RESPONSE_DRAFT_STATUSES = [
  "draft",
  "reviewed",
  "ready_to_send",
  "sent",
  "archived",
] as const;

export type AuditWorkItemStatus = (typeof AUDIT_WORK_ITEM_STATUSES)[number];
export type AuditFollowUpStatus = (typeof AUDIT_FOLLOW_UP_STATUSES)[number];
export type AuditResponseDraftStatus =
  (typeof AUDIT_RESPONSE_DRAFT_STATUSES)[number];

export type AuditWorkItem = {
  id: string;
  auditRequestId: string;
  createdAt: string;
  updatedAt: string;
  status: AuditWorkItemStatus;
  priority: "normal" | "high" | string;
  companyWebsite: string | null;
  workEmail: string;
  businessType: string | null;
  teamSize: string | null;
  detectedPains: string[];
  recommendedSystems: string[];
  internalNotes: string | null;
  nextAction: string | null;
  followUpStatus: AuditFollowUpStatus;
  followUpDueAt: string | null;
};

type AuditWorkItemRow = {
  id: string;
  audit_request_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  priority: string;
  company_website: string | null;
  work_email: string;
  business_type: string | null;
  team_size: string | null;
  detected_pains: string[] | null;
  recommended_systems: string[] | null;
  internal_notes: string | null;
  next_action: string | null;
  follow_up_status: string;
  follow_up_due_at: string | null;
};

export type AuditResponseDraft = {
  id: string;
  auditWorkItemId: string;
  auditRequestId: string;
  createdAt: string;
  updatedAt: string;
  status: AuditResponseDraftStatus;
  subject: string | null;
  openingSummary: string | null;
  painSummary: string | null;
  recommendedSystemsSummary: string | null;
  proposedNextSteps: string | null;
  followUpEmailBody: string | null;
  internalReviewNotes: string | null;
};

type AuditResponseDraftRow = {
  id: string;
  audit_work_item_id: string;
  audit_request_id: string;
  created_at: string;
  updated_at: string;
  status: string;
  subject: string | null;
  opening_summary: string | null;
  pain_summary: string | null;
  recommended_systems_summary: string | null;
  proposed_next_steps: string | null;
  follow_up_email_body: string | null;
  internal_review_notes: string | null;
};

type ListAuditWorkItemsOptions = {
  status?: string;
  priority?: string;
  limit?: number;
};

type UpdateAuditWorkItemInput = {
  id: string;
  status?: string;
  followUpStatus?: string;
  internalNotes?: string;
  nextAction?: string;
};

type UpdateAuditResponseDraftInput = {
  id: string;
  status?: string;
  subject?: string;
  openingSummary?: string;
  painSummary?: string;
  recommendedSystemsSummary?: string;
  proposedNextSteps?: string;
  followUpEmailBody?: string;
  internalReviewNotes?: string;
};

function isAuditWorkItemStatus(value: string): value is AuditWorkItemStatus {
  return AUDIT_WORK_ITEM_STATUSES.includes(value as AuditWorkItemStatus);
}

function isAuditFollowUpStatus(value: string): value is AuditFollowUpStatus {
  return AUDIT_FOLLOW_UP_STATUSES.includes(value as AuditFollowUpStatus);
}

function isAuditResponseDraftStatus(
  value: string,
): value is AuditResponseDraftStatus {
  return AUDIT_RESPONSE_DRAFT_STATUSES.includes(
    value as AuditResponseDraftStatus,
  );
}

function normalizeRow(row: AuditWorkItemRow): AuditWorkItem {
  return {
    id: row.id,
    auditRequestId: row.audit_request_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: isAuditWorkItemStatus(row.status) ? row.status : "new",
    priority: row.priority,
    companyWebsite: row.company_website,
    workEmail: row.work_email,
    businessType: row.business_type,
    teamSize: row.team_size,
    detectedPains: row.detected_pains ?? [],
    recommendedSystems: row.recommended_systems ?? [],
    internalNotes: row.internal_notes,
    nextAction: row.next_action,
    followUpStatus: isAuditFollowUpStatus(row.follow_up_status)
      ? row.follow_up_status
      : "not_started",
    followUpDueAt: row.follow_up_due_at,
  };
}

function normalizeDraftRow(row: AuditResponseDraftRow): AuditResponseDraft {
  return {
    id: row.id,
    auditWorkItemId: row.audit_work_item_id,
    auditRequestId: row.audit_request_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: isAuditResponseDraftStatus(row.status) ? row.status : "draft",
    subject: row.subject,
    openingSummary: row.opening_summary,
    painSummary: row.pain_summary,
    recommendedSystemsSummary: row.recommended_systems_summary,
    proposedNextSteps: row.proposed_next_steps,
    followUpEmailBody: row.follow_up_email_body,
    internalReviewNotes: row.internal_review_notes,
  };
}

const WORK_ITEM_SELECT = [
  "id",
  "audit_request_id",
  "created_at",
  "updated_at",
  "status",
  "priority",
  "company_website",
  "work_email",
  "business_type",
  "team_size",
  "detected_pains",
  "recommended_systems",
  "internal_notes",
  "next_action",
  "follow_up_status",
  "follow_up_due_at",
].join(",");

const DRAFT_SELECT = [
  "id",
  "audit_work_item_id",
  "audit_request_id",
  "created_at",
  "updated_at",
  "status",
  "subject",
  "opening_summary",
  "pain_summary",
  "recommended_systems_summary",
  "proposed_next_steps",
  "follow_up_email_body",
  "internal_review_notes",
].join(",");

export async function listAuditWorkItems(options: ListAuditWorkItemsOptions = {}) {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);
  const supabase = getSupabaseServiceClient();

  let query = supabase
    .from("audit_work_items")
    .select(WORK_ITEM_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options.status && isAuditWorkItemStatus(options.status)) {
    query = query.eq("status", options.status);
  }

  if (options.priority && ["normal", "high"].includes(options.priority)) {
    query = query.eq("priority", options.priority);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Audit work item list failed: ${error.message}`);
  }

  return ((data ?? []) as unknown as AuditWorkItemRow[]).map(normalizeRow);
}

export async function getAuditWorkItemById(id: string) {
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("audit_work_items")
    .select(WORK_ITEM_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Audit work item lookup failed: ${error.message}`);
  }

  return normalizeRow(data as unknown as AuditWorkItemRow);
}

export async function updateAuditWorkItemStatus(input: UpdateAuditWorkItemInput) {
  if (!input.id) {
    throw new Error("Missing audit work item id.");
  }

  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status !== undefined) {
    if (!isAuditWorkItemStatus(input.status)) {
      throw new Error("Invalid audit work item status.");
    }
    patch.status = input.status;
  }

  if (input.followUpStatus !== undefined) {
    if (!isAuditFollowUpStatus(input.followUpStatus)) {
      throw new Error("Invalid follow-up status.");
    }
    patch.follow_up_status = input.followUpStatus;
  }

  if (input.internalNotes !== undefined) {
    patch.internal_notes = input.internalNotes.trim() || null;
  }

  if (input.nextAction !== undefined) {
    patch.next_action = input.nextAction.trim() || null;
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("audit_work_items")
    .update(patch)
    .eq("id", input.id)
    .select(WORK_ITEM_SELECT)
    .single();

  if (error) {
    throw new Error(`Audit work item update failed: ${error.message}`);
  }

  return normalizeRow(data as unknown as AuditWorkItemRow);
}

export async function getOrCreateAuditResponseDraft(item: AuditWorkItem) {
  const supabase = getSupabaseServiceClient();
  const existing = await supabase
    .from("audit_response_drafts")
    .select(DRAFT_SELECT)
    .eq("audit_work_item_id", item.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.error) {
    throw new Error(
      `Audit response draft lookup failed: ${existing.error.message}`,
    );
  }

  if (existing.data) {
    return normalizeDraftRow(existing.data as unknown as AuditResponseDraftRow);
  }

  const generated = generateAuditResponseDraft(item);
  const created = await supabase
    .from("audit_response_drafts")
    .insert({
      audit_work_item_id: item.id,
      audit_request_id: item.auditRequestId,
      status: "draft",
      subject: generated.subject,
      opening_summary: generated.openingSummary,
      pain_summary: generated.painSummary,
      recommended_systems_summary: generated.recommendedSystemsSummary,
      proposed_next_steps: generated.proposedNextSteps,
      follow_up_email_body: generated.followUpEmailBody,
      internal_review_notes: generated.internalReviewNotes,
      raw_payload: generated.rawPayload,
    })
    .select(DRAFT_SELECT)
    .single();

  if (created.error) {
    throw new Error(
      `Audit response draft creation failed: ${created.error.message}`,
    );
  }

  return normalizeDraftRow(created.data as unknown as AuditResponseDraftRow);
}

export async function updateAuditResponseDraft(
  input: UpdateAuditResponseDraftInput,
) {
  if (!input.id) {
    throw new Error("Missing audit response draft id.");
  }

  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status !== undefined) {
    if (!isAuditResponseDraftStatus(input.status)) {
      throw new Error("Invalid audit response draft status.");
    }
    patch.status = input.status;
  }

  if (input.subject !== undefined) {
    patch.subject = input.subject.trim() || null;
  }

  if (input.openingSummary !== undefined) {
    patch.opening_summary = input.openingSummary.trim() || null;
  }

  if (input.painSummary !== undefined) {
    patch.pain_summary = input.painSummary.trim() || null;
  }

  if (input.recommendedSystemsSummary !== undefined) {
    patch.recommended_systems_summary =
      input.recommendedSystemsSummary.trim() || null;
  }

  if (input.proposedNextSteps !== undefined) {
    patch.proposed_next_steps = input.proposedNextSteps.trim() || null;
  }

  if (input.followUpEmailBody !== undefined) {
    patch.follow_up_email_body = input.followUpEmailBody.trim() || null;
  }

  if (input.internalReviewNotes !== undefined) {
    patch.internal_review_notes = input.internalReviewNotes.trim() || null;
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("audit_response_drafts")
    .update(patch)
    .eq("id", input.id)
    .select(DRAFT_SELECT)
    .single();

  if (error) {
    throw new Error(`Audit response draft update failed: ${error.message}`);
  }

  return normalizeDraftRow(data as unknown as AuditResponseDraftRow);
}
