import "server-only";

export type AuditNotificationPayload = {
  auditRequestId?: string;
  auditWorkItemId?: string;
  workEmail: string;
  companyWebsite?: string;
  businessType?: string;
  mainOperationalPain?: string;
  teamSize?: string;
  currentTools?: string;
  biggestBottleneck?: string;
  source?: string;
  pageUrl?: string;
  systemInterest?: string;
  detectedPains?: string[];
  recommendedSystems?: string[];
  priority?: string;
  nextAction?: string;
};

function line(label: string, value: string | undefined) {
  return `${label}: ${value?.trim() || "Not provided"}`;
}

function listLine(label: string, value: string[] | undefined) {
  return `${label}: ${value?.length ? value.join(", ") : "Not available"}`;
}

export async function sendAuditNotificationEmail(
  payload: AuditNotificationPayload,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FLOWOPS_NOTIFICATION_EMAIL;

  if (!apiKey || !to) {
    return { skipped: true as const };
  }

  const text = [
    "New FlowOps AI Operations Audit Request",
    "",
    line("Audit request ID", payload.auditRequestId),
    line("Audit work item ID", payload.auditWorkItemId),
    "",
    line("Work email", payload.workEmail),
    line("Company website", payload.companyWebsite),
    line("Business type", payload.businessType),
    line("Team size", payload.teamSize),
    line("System interest", payload.systemInterest),
    line("Current tools", payload.currentTools),
    "",
    "Main operational pain:",
    payload.mainOperationalPain || "Not provided",
    "",
    "Biggest bottleneck:",
    payload.biggestBottleneck || "Not provided",
    "",
    "Internal triage:",
    listLine("Detected pains", payload.detectedPains),
    listLine("Recommended systems", payload.recommendedSystems),
    line("Priority", payload.priority),
    line("Next action", payload.nextAction),
    "",
    line("Source", payload.source),
    line("Page URL", payload.pageUrl),
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "FlowOps Audit <onboarding@resend.dev>",
      to,
      subject: `New FlowOps audit request: ${payload.workEmail}`,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend notification failed: ${response.status} ${body}`);
  }

  return { skipped: false as const };
}
