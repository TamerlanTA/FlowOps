import "server-only";

export async function forwardAuditRequestToN8n(payload: unknown) {
  const webhookUrl = process.env.N8N_AUDIT_WEBHOOK_URL;

  if (!webhookUrl) {
    return { skipped: true as const };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`n8n webhook failed with status ${response.status}`);
    }

    return { skipped: false as const };
  } finally {
    clearTimeout(timeout);
  }
}
