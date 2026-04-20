import "server-only";

import { getEnv } from "@/lib/env";
import { LeadPayload, toWhatsAppUrl } from "@/lib/lead";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

export async function sendLeadToTelegram(
  lead: LeadPayload,
  leadId: string,
): Promise<void> {
  const env = getEnv();

  const emailReplyLink = `mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`FlowOps audit request - ${lead.company}`)}`;
  const whatsappReplyLink = toWhatsAppUrl(lead.whatsapp);

  const message = [
    "<b>New Lead Request - FlowOps</b>",
    "",
    `<b>ID:</b> <code>${escapeHtml(leadId)}</code>`,
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Company:</b> ${escapeHtml(lead.company)}`,
    `<b>Business Type:</b> ${escapeHtml(lead.businessType)}`,
    `<b>Revenue:</b> ${escapeHtml(lead.revenueRange)}`,
    `<b>Email:</b> ${escapeHtml(lead.email)}`,
    `<b>WhatsApp:</b> ${escapeHtml(lead.whatsapp)}`,
    "",
    "<b>Problem Description:</b>",
    escapeHtml(lead.problemDescription),
    "",
    `<a href=\"${emailReplyLink}\">Reply via Email</a> | <a href=\"${whatsappReplyLink}\">Reply on WhatsApp</a>`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram notification failed: ${details}`);
  }
}
