import { NextResponse } from "next/server";
import { z } from "zod";

import {
  AUDIT_FOLLOW_UP_STATUSES,
  AUDIT_WORK_ITEM_STATUSES,
  updateAuditWorkItemStatus,
} from "@/lib/audit/admin";
import { validateInternalAccessKey } from "@/lib/internal/access";
import { checkInternalPatchRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(AUDIT_WORK_ITEM_STATUSES).optional(),
  followUpStatus: z.enum(AUDIT_FOLLOW_UP_STATUSES).optional(),
  internalNotes: z.string().max(4000).optional(),
  nextAction: z.string().max(500).optional(),
});

type InternalApiResponse =
  | {
      success: true;
      item: Awaited<ReturnType<typeof updateAuditWorkItemStatus>>;
    }
  | {
      success: false;
      message: string;
    };

export async function PATCH(request: Request) {
  const rateLimit = checkInternalPatchRateLimit(request, "audit-work-items");

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many update attempts. Please try again shortly.",
      } satisfies InternalApiResponse,
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
      } satisfies InternalApiResponse,
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
      } satisfies InternalApiResponse,
      { status: 400 },
    );
  }

  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid audit work item update.",
      } satisfies InternalApiResponse,
      { status: 400 },
    );
  }

  try {
    const item = await updateAuditWorkItemStatus(parsed.data);

    return NextResponse.json(
      {
        success: true,
        item,
      } satisfies InternalApiResponse,
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Internal audit work item update failed:", message);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update audit work item.",
      } satisfies InternalApiResponse,
      { status: 500 },
    );
  }
}
