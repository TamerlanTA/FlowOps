import "server-only";

import { getEnv } from "@/lib/env";
import { LeadPayload } from "@/lib/lead";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

export async function sendLeadAutoReplyEmail(
  lead: LeadPayload,
  leadId: string,
): Promise<void> {
  const env = getEnv();

  const subject = "We received your FlowOps audit request";

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#070a14; color:#e8eefc; padding:24px;">
      <div style="max-width:620px; margin:0 auto; border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; background:rgba(255,255,255,0.03);">
        <h1 style="font-size:24px; margin:0 0 12px;">Thanks, ${escapeHtml(lead.name)}.</h1>
        <p style="margin:0 0 16px; line-height:1.6; color:#c7d2e9;">
          Your process audit request has been received. Our team is reviewing your submission and will reply within one business day.
        </p>
        <p style="margin:0 0 16px; line-height:1.6; color:#c7d2e9;">
          <strong>Reference:</strong> ${escapeHtml(leadId)}<br />
          <strong>Company:</strong> ${escapeHtml(lead.company)}
        </p>
        <div style="margin:16px 0; padding:14px; border-radius:12px; background:rgba(68,120,255,0.14); color:#d6e3ff;">
          Next step: we will send you a practical automation plan based on the process challenges you submitted.
        </div>
        <p style="margin:16px 0 0; color:#9db1d6; font-size:13px;">
          FlowOps AI Automation Agency
        </p>
      </div>
    </div>
  `;

  const text = [
    `Thanks, ${lead.name}.`,
    "",
    "Your process audit request has been received.",
    "Our team will reply within one business day.",
    "",
    `Reference: ${leadId}`,
    `Company: ${lead.company}`,
    "",
    "FlowOps AI Automation Agency",
  ].join("\n");

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.EMAIL_SERVICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: lead.email, name: lead.name }],
          subject,
        },
      ],
      from: {
        email: env.EMAIL_FROM,
        name: "FlowOps",
      },
      content: [
        {
          type: "text/plain",
          value: text,
        },
        {
          type: "text/html",
          value: html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Auto-reply email failed: ${details}`);
  }
}
