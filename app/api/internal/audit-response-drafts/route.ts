import { NextResponse } from "next/server";
import { z } from "zod";

import {
  AUDIT_RESPONSE_DRAFT_STATUSES,
  updateAuditResponseDraft,
} from "@/lib/audit/admin";
import { validateInternalAccessKey } from "@/lib/internal/access";
import { checkInternalPatchRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(AUDIT_RESPONSE_DRAFT_STATUSES).optional(),
  subject: z.string().max(300).optional(),
  openingSummary: z.string().max(3000).optional(),
  painSummary: z.string().max(3000).optional(),
  recommendedSystemsSummary: z.string().max(3000).optional(),
  proposedNextSteps: z.string().max(5000).optional(),
  followUpEmailBody: z.string().max(8000).optional(),
  internalReviewNotes: z.string().max(4000).optional(),
});

type InternalDraftApiResponse =
  | {
      success: true;
      draft: Awaited<ReturnType<typeof updateAuditResponseDraft>>;
    }
  | {
      success: false;
      message: string;
    };

export async function PATCH(request: Request) {
  const rateLimit = checkInternalPatchRateLimit(
    request,
    "audit-response-drafts",
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many update attempts. Please try again shortly.",
      } satisfies InternalDraftApiResponse,
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  if (!validateInternalAccessKey(request.headers.get("x-flowops-internal-key"))) {
    return NextResponse.json(
      {
        success: false,
        message: "Access denied.",
      } satisfies InternalDraftApiResponse,
      { status: 401 },
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
      } satisfies InternalDraftApiResponse,
      { status: 400 },
    );
  }

  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid audit response draft update.",
      } satisfies InternalDraftApiResponse,
      { status: 400 },
    );
  }

  try {
    const draft = await updateAuditResponseDraft(parsed.data);

    return NextResponse.json(
      {
        success: true,
        draft,
      } satisfies InternalDraftApiResponse,
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Internal audit response draft update failed:", message);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update audit response draft.",
      } satisfies InternalDraftApiResponse,
      { status: 500 },
    );
  }
}
