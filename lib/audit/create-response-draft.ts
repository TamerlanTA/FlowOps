import "server-only";

type DraftWorkItemInput = {
  id: string;
  auditRequestId: string;
  companyWebsite: string | null;
  workEmail: string;
  businessType: string | null;
  teamSize: string | null;
  detectedPains: string[];
  recommendedSystems: string[];
  priority: string;
  status: string;
  nextAction: string | null;
};

export type GeneratedAuditResponseDraft = {
  subject: string;
  openingSummary: string;
  painSummary: string;
  recommendedSystemsSummary: string;
  proposedNextSteps: string;
  followUpEmailBody: string;
  internalReviewNotes: string;
  rawPayload: Record<string, unknown>;
};

const PAIN_LABELS: Record<string, string> = {
  lead_capture: "lead capture and qualification",
  sales_follow_up: "sales follow-up and pipeline consistency",
  voice_operations: "phone coverage and caller handling",
  inbox_support: "inbox, email, and support response flow",
  manual_operations: "manual operations, handoffs, and spreadsheet-based work",
  reporting_visibility: "reporting visibility, KPIs, and operational intelligence",
};

const SYSTEM_DESCRIPTIONS: Record<string, string> = {
  LeadOS: "lead research, qualification, and routing",
  SalesOS: "CRM follow-up, pipeline hygiene, and next-step automation",
  VoiceOS: "AI receptionist, call handling, and phone intake workflow",
  InboxOS: "email, support, and inbox triage automation",
  OpsOS: "internal workflow automation across tools and handoffs",
  ReportOS: "dashboards, reporting, and operating intelligence",
};

function listOrFallback(values: string[], fallback: string) {
  return values.length ? values.join(", ") : fallback;
}

function readablePains(values: string[]) {
  return values.map((value) => PAIN_LABELS[value] ?? value.replace(/_/g, " "));
}

function readableSystems(values: string[]) {
  return values.map((value) => {
    const description = SYSTEM_DESCRIPTIONS[value];
    return description ? `${value} for ${description}` : value;
  });
}

function companyReference(item: DraftWorkItemInput) {
  return item.companyWebsite || item.businessType || "your operation";
}

export function generateAuditResponseDraft(
  item: DraftWorkItemInput,
): GeneratedAuditResponseDraft {
  const company = companyReference(item);
  const painList = readablePains(item.detectedPains);
  const systemList = readableSystems(item.recommendedSystems);
  const systemsShort = listOrFallback(item.recommendedSystems, "the most relevant FlowOps systems");
  const contextParts = [
    item.businessType ? `Business type: ${item.businessType}` : null,
    item.teamSize ? `Team size: ${item.teamSize}` : null,
    item.companyWebsite ? `Website: ${item.companyWebsite}` : null,
  ].filter(Boolean);

  const subject = `FlowOps audit next steps for ${company}`;
  const openingSummary = [
    `Based on your audit request, we identified a few likely operational areas to review for ${company}.`,
    contextParts.length ? contextParts.join(" | ") : "The request includes enough context to begin a focused diagnostic review.",
    "This is an initial internal response draft, not a completed audit report.",
  ].join(" ");

  const painSummary = painList.length
    ? `The request points toward ${listOrFallback(painList, "operational friction")} as the main areas to inspect. The diagnostic should confirm where work slows down, where ownership is unclear, and where existing tools are not carrying the workflow reliably.`
    : "The request does not yet contain a clear operational pain pattern. The diagnostic should start by mapping the workflow, identifying manual steps, and confirming where the team loses time or visibility.";

  const recommendedSystemsSummary = systemList.length
    ? `Initial system fit: ${systemList.join("; ")}. These recommendations should be validated during the diagnostic before any implementation plan is proposed.`
    : "No system recommendation should be finalized yet. Use the diagnostic review to determine whether LeadOS, SalesOS, VoiceOS, InboxOS, OpsOS, or ReportOS is the right starting point.";

  const proposedNextSteps = [
    "1. Review the submitted workflow context and clarify the current operating process.",
    "2. Map the main handoffs, tools, bottlenecks, and failure points.",
    "3. Estimate where automation or operational infrastructure could reduce manual work.",
    `4. Confirm whether ${systemsShort} should be recommended as the first deployment path.`,
    "5. Prepare a concise implementation roadmap and discuss it with the client.",
  ].join("\n");

  const followUpEmailBody = [
    `Hi,`,
    "",
    "Thanks for requesting a FlowOps AI Operations Audit.",
    "",
    `Based on your audit request, we identified a few likely operational areas to review around ${listOrFallback(painList, "manual workflow friction and operating visibility")}. The next step is a short diagnostic review so we can map the workflow, confirm the bottlenecks, and recommend the right FlowOps system path without guessing.`,
    "",
    systemList.length
      ? `At first glance, the most relevant starting point may include ${systemsShort}. We will validate that during the review before proposing an implementation roadmap.`
      : "We will use the review to determine which FlowOps system should be considered first.",
    "",
    "If helpful, we can use the diagnostic to produce a workflow map, automation opportunity list, system recommendation, and practical implementation roadmap.",
    "",
    "Best,",
    "FlowOps",
  ].join("\n");

  const internalReviewNotes = [
    "Template-generated internal draft. Review before sending.",
    "Do not claim the audit is complete.",
    "Do not add metrics unless verified with the client.",
    `Priority from work item: ${item.priority}. Current work item status: ${item.status}.`,
    item.nextAction ? `Current next action: ${item.nextAction}.` : "Set a specific next action after review.",
  ].join("\n");

  return {
    subject,
    openingSummary,
    painSummary,
    recommendedSystemsSummary,
    proposedNextSteps,
    followUpEmailBody,
    internalReviewNotes,
    rawPayload: {
      auditWorkItemId: item.id,
      auditRequestId: item.auditRequestId,
      companyWebsite: item.companyWebsite,
      workEmail: item.workEmail,
      businessType: item.businessType,
      teamSize: item.teamSize,
      detectedPains: item.detectedPains,
      recommendedSystems: item.recommendedSystems,
      priority: item.priority,
      status: item.status,
      generatedBy: "deterministic_template_v1",
    },
  };
}
