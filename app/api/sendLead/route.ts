import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { sendLeadAutoReplyEmail } from "@/lib/integrations/email";
import { saveLeadToGoogleSheets } from "@/lib/integrations/googleSheets";
import { sendLeadToTelegram } from "@/lib/integrations/telegram";
import { getLeadFieldErrors, leadSchema } from "@/lib/lead";

export const runtime = "nodejs";

type SendLeadSuccess = {
  success: true;
  message: string;
  leadId: string;
};

type SendLeadError = {
  success: false;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = (await request.json()) as unknown;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON payload.",
        } satisfies SendLeadError,
        { status: 400 },
      );
    }

    const parsedLead = leadSchema.safeParse(body);

    if (!parsedLead.success) {
      const response: SendLeadError = {
        success: false,
        message: "Invalid form data. Please check highlighted fields.",
        fieldErrors: getLeadFieldErrors(parsedLead.error),
      };

      return NextResponse.json(response, { status: 400 });
    }

    const lead = parsedLead.data;
    const leadId = `lead_${Date.now()}_${randomUUID().slice(0, 8)}`;

    await Promise.all([
      sendLeadToTelegram(lead, leadId),
      saveLeadToGoogleSheets(lead, leadId),
      sendLeadAutoReplyEmail(lead, leadId),
    ]);

    const response: SendLeadSuccess = {
      success: true,
      message:
        "Thanks. Your request has been received. We will contact you within one business day.",
      leadId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to process lead:", error);

    const response: SendLeadError = {
      success: false,
      message: "Unable to process your request right now. Please try again.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
