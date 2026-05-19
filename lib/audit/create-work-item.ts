import "server-only";

import { getSupabaseServiceClient } from "@/lib/supabase/server";

export type NormalizedAuditRequest = {
  workEmail: string;
  companyWebsite?: string;
  businessType?: string;
  mainOperationalPain?: string;
  teamSize?: string;
  currentTools?: string;
  biggestBottleneck?: string;
  selectedSystem?: string;
  source?: string;
  pageUrl?: string | null;
};

export type AuditWorkItemResult = {
  id: string;
  detectedPains: string[];
  recommendedSystems: string[];
  priority: "normal" | "high";
  nextAction: string;
};

const PAIN_RULES = [
  {
    pain: "lead_capture",
    systems: ["LeadOS"],
    severe: ["missed lead", "lost lead", "lead leak", "no lead", "cold outreach"],
    keywords: ["lead", "prospect", "qualification", "research", "inbound", "outbound"],
  },
  {
    pain: "sales_follow_up",
    systems: ["SalesOS"],
    severe: ["no follow-up", "missed follow-up", "stale pipeline", "crm chaos"],
    keywords: ["follow-up", "follow up", "pipeline", "crm", "deal", "sales", "reminder"],
  },
  {
    pain: "voice_operations",
    systems: ["VoiceOS"],
    severe: ["missed call", "unanswered call", "no receptionist"],
    keywords: ["phone", "call", "caller", "receptionist", "voicemail", "appointment"],
  },
  {
    pain: "inbox_support",
    systems: ["InboxOS"],
    severe: ["support backlog", "unanswered email", "missed email"],
    keywords: ["email", "inbox", "support", "ticket", "gmail", "outlook", "reply"],
  },
  {
    pain: "manual_operations",
    systems: ["OpsOS"],
    severe: ["manual process", "manual work", "handoff breaks", "spreadsheet chaos"],
    keywords: ["manual", "handoff", "spreadsheet", "sheets", "excel", "copy paste", "task"],
  },
  {
    pain: "reporting_visibility",
    systems: ["ReportOS"],
    severe: ["no visibility", "reporting gap", "missing kpi", "blind spot"],
    keywords: ["report", "dashboard", "visibility", "kpi", "metrics", "analytics", "forecast"],
  },
] as const;

const DEFAULT_NEXT_ACTION = "Review operational pain and prepare audit response";

function normalizeText(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function containsAny(text: string, terms: readonly string[]) {
  return terms.some((term) => text.includes(term));
}

export function classifyAuditRequest(payload: NormalizedAuditRequest) {
  const text = normalizeText([
    payload.mainOperationalPain,
    payload.biggestBottleneck,
    payload.currentTools,
    payload.businessType,
    payload.selectedSystem,
  ]);

  const detectedPains: string[] = [];
  const recommendedSystems = new Set<string>();
  let severeSignalCount = 0;

  for (const rule of PAIN_RULES) {
    const hasKeyword = containsAny(text, rule.keywords);
    const hasSevereSignal = containsAny(text, rule.severe);

    if (hasKeyword || hasSevereSignal) {
      detectedPains.push(rule.pain);
      rule.systems.forEach((system) => recommendedSystems.add(system));
    }

    if (hasSevereSignal) {
      severeSignalCount += 1;
    }
  }

  if (recommendedSystems.size === 0 && payload.selectedSystem) {
    recommendedSystems.add(payload.selectedSystem);
  }

  return {
    detectedPains,
    recommendedSystems: Array.from(recommendedSystems),
    priority:
      severeSignalCount >= 2 || detectedPains.length >= 3
        ? ("high" as const)
        : ("normal" as const),
    nextAction: DEFAULT_NEXT_ACTION,
  };
}

export async function createAuditWorkItem(
  auditRequestId: string,
  payload: NormalizedAuditRequest,
): Promise<AuditWorkItemResult | null> {
  const classification = classifyAuditRequest(payload);

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("audit_work_items")
      .insert({
        audit_request_id: auditRequestId,
        status: "new",
        priority: classification.priority,
        company_website: payload.companyWebsite || null,
        work_email: payload.workEmail,
        business_type: payload.businessType || null,
        team_size: payload.teamSize || null,
        detected_pains: classification.detectedPains,
        recommended_systems: classification.recommendedSystems,
        internal_notes: null,
        next_action: classification.nextAction,
        follow_up_status: "not_started",
        raw_payload: payload,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Audit work item insert failed:", error.message);
      return null;
    }

    return {
      id: data.id as string,
      ...classification,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Audit work item creation failed:", message);
    return null;
  }
}
