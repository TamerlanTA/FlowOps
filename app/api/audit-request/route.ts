import { NextResponse } from "next/server";
import { z } from "zod";

import { createAuditWorkItem } from "@/lib/audit/create-work-item";
import { sendAuditNotificationEmail } from "@/lib/email/audit-notification";
import { forwardAuditRequestToN8n } from "@/lib/integrations/n8n";
import { checkAuditRequestRateLimit } from "@/lib/security/rate-limit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuditRequestResponse =
  | {
      success: true;
      message: string;
      requestId: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[] | undefined>;
    };

function sanitizeSingleLine(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMultiLine(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeWebsite(value: string | undefined) {
  const website = sanitizeSingleLine(value);

  if (!website) {
    return "";
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

const auditRequestSchema = z
  .object({
    workEmail: z
      .preprocess(
        (value) => sanitizeSingleLine(value).toLowerCase(),
        z.string().email(),
      )
      .refine((value) => EMAIL_REGEX.test(value), "Invalid email address"),
    companyWebsite: z
      .preprocess((value) => normalizeWebsite(value as string | undefined), z.string())
      .optional()
      .refine((value) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }, "Invalid company website"),
    businessType: z
      .preprocess(sanitizeSingleLine, z.string().max(120))
      .optional(),
    mainOperationalPain: z
      .preprocess(sanitizeMultiLine, z.string().max(MAX_TEXT_LENGTH))
      .optional(),
    teamSize: z.preprocess(sanitizeSingleLine, z.string().max(60)).optional(),
    currentTools: z
      .preprocess(sanitizeMultiLine, z.string().max(MAX_TEXT_LENGTH))
      .optional(),
    biggestBottleneck: z
      .preprocess(sanitizeMultiLine, z.string().max(MAX_TEXT_LENGTH))
      .optional(),
    selectedSystem: z
      .preprocess(sanitizeSingleLine, z.string().max(80))
      .optional(),
    company: z.preprocess(sanitizeSingleLine, z.string().max(160)).optional(),
    pageUrl: z.preprocess(sanitizeSingleLine, z.string().max(500)).optional(),
    source: z
      .preprocess(sanitizeSingleLine, z.string().max(80))
      .optional()
      .default("flowops_website"),
    companyNameConfirm: z
      .preprocess(sanitizeSingleLine, z.string().max(200))
      .optional(),
  })
  .superRefine((value, ctx) => {
    const pain = value.mainOperationalPain?.trim() ?? "";
    const bottleneck = value.biggestBottleneck?.trim() ?? "";

    if (!pain && !bottleneck) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["mainOperationalPain"],
        message: "Describe the main pain or biggest bottleneck.",
      });
    }
  });

export async function POST(request: Request) {
  const rateLimit = checkAuditRequestRateLimit(request);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Too many audit requests from this network. Please try again shortly.",
      } satisfies AuditRequestResponse,
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON payload.",
      } satisfies AuditRequestResponse,
      { status: 400 },
    );
  }

  const parsed = auditRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the audit request fields and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      } satisfies AuditRequestResponse,
      { status: 400 },
    );
  }

  const auditRequest = parsed.data;

  if (auditRequest.companyNameConfirm) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process this audit request.",
      } satisfies AuditRequestResponse,
      { status: 400 },
    );
  }

  const row = {
    work_email: auditRequest.workEmail,
    company_website: auditRequest.companyWebsite || null,
    business_type: auditRequest.businessType || null,
    main_operational_pain: auditRequest.mainOperationalPain || null,
    team_size: auditRequest.teamSize || null,
    current_tools: auditRequest.currentTools || null,
    biggest_bottleneck: auditRequest.biggestBottleneck || null,
    source: auditRequest.source || "flowops_website",
    status: "new",
    raw_payload: auditRequest,
    user_agent: request.headers.get("user-agent"),
    page_url: auditRequest.pageUrl || request.headers.get("referer"),
  };

  let insertedId: string;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("audit_requests")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      console.error("Audit request Supabase insert failed:", error.message);
      return NextResponse.json(
        {
          success: false,
          message:
            "Audit request capture is not available right now. Please try again shortly.",
        } satisfies AuditRequestResponse,
        { status: 500 },
      );
    }

    insertedId = data.id as string;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Audit request configuration error:", message);

    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === "development"
            ? message
            : "Audit request capture is not configured yet.",
      } satisfies AuditRequestResponse,
      { status: 503 },
    );
  }

  const workItem = await createAuditWorkItem(insertedId, {
    workEmail: auditRequest.workEmail,
    companyWebsite: auditRequest.companyWebsite,
    businessType: auditRequest.businessType,
    mainOperationalPain: auditRequest.mainOperationalPain,
    teamSize: auditRequest.teamSize,
    currentTools: auditRequest.currentTools,
    biggestBottleneck: auditRequest.biggestBottleneck,
    selectedSystem: auditRequest.selectedSystem,
    source: row.source,
    pageUrl: row.page_url,
  });

  const notificationPayload = {
    auditRequestId: insertedId,
    auditWorkItemId: workItem?.id,
    workEmail: auditRequest.workEmail,
    companyWebsite: auditRequest.companyWebsite,
    businessType: auditRequest.businessType,
    mainOperationalPain: auditRequest.mainOperationalPain,
    teamSize: auditRequest.teamSize,
    currentTools: auditRequest.currentTools,
    biggestBottleneck: auditRequest.biggestBottleneck,
    source: row.source,
    pageUrl: row.page_url ?? undefined,
    systemInterest: auditRequest.selectedSystem,
    detectedPains: workItem?.detectedPains,
    recommendedSystems: workItem?.recommendedSystems,
    priority: workItem?.priority,
    nextAction: workItem?.nextAction,
  };

  await Promise.allSettled([
    sendAuditNotificationEmail(notificationPayload),
    forwardAuditRequestToN8n({
      audit_request_id: insertedId,
      audit_work_item_id: workItem?.id,
      ...notificationPayload,
      rawPayload: auditRequest,
    }),
  ]).then((results) => {
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Audit request notification failed:", result.reason);
      }
    });
  });

  return NextResponse.json(
    {
      success: true,
      message:
        "Audit request received. We will review your operation and contact you with next steps.",
      requestId: insertedId,
    } satisfies AuditRequestResponse,
    { status: 200 },
  );
}
