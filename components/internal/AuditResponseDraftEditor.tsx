"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useState, useTransition } from "react";

const DRAFT_STATUSES = [
  "draft",
  "reviewed",
  "ready_to_send",
  "sent",
  "archived",
] as const;

type AuditResponseDraftEditorProps = {
  accessKey: string;
  draft: {
    id: string;
    status: string;
    subject: string | null;
    openingSummary: string | null;
    painSummary: string | null;
    recommendedSystemsSummary: string | null;
    proposedNextSteps: string | null;
    followUpEmailBody: string | null;
    internalReviewNotes: string | null;
  };
};

const fieldStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  background: "rgba(255,255,255,0.045)",
  color: "#fff",
  padding: "12px 14px",
  fontSize: 14,
  lineHeight: 1.45,
  outline: "none",
} satisfies CSSProperties;

const labelStyle = {
  display: "grid",
  gap: 8,
  color: "rgba(255,255,255,0.62)",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0,
} satisfies CSSProperties;

export function AuditResponseDraftEditor({
  accessKey,
  draft,
}: AuditResponseDraftEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(draft.status);
  const [subject, setSubject] = useState(draft.subject ?? "");
  const [openingSummary, setOpeningSummary] = useState(
    draft.openingSummary ?? "",
  );
  const [painSummary, setPainSummary] = useState(draft.painSummary ?? "");
  const [recommendedSystemsSummary, setRecommendedSystemsSummary] = useState(
    draft.recommendedSystemsSummary ?? "",
  );
  const [proposedNextSteps, setProposedNextSteps] = useState(
    draft.proposedNextSteps ?? "",
  );
  const [followUpEmailBody, setFollowUpEmailBody] = useState(
    draft.followUpEmailBody ?? "",
  );
  const [internalReviewNotes, setInternalReviewNotes] = useState(
    draft.internalReviewNotes ?? "",
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setMessage("");
    setError("");

    const response = await fetch("/api/internal/audit-response-drafts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-flowops-internal-key": accessKey,
      },
      body: JSON.stringify({
        id: draft.id,
        status,
        subject,
        openingSummary,
        painSummary,
        recommendedSystemsSummary,
        proposedNextSteps,
        followUpEmailBody,
        internalReviewNotes,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !data?.success) {
      setError(data?.message || "Unable to update this draft.");
      return;
    }

    setMessage("Draft saved");
    startTransition(() => router.refresh());
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <label style={labelStyle}>
        Draft status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          style={fieldStyle}
        >
          {DRAFT_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label style={labelStyle}>
        Subject
        <input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          style={fieldStyle}
        />
      </label>

      <label style={labelStyle}>
        Opening summary
        <textarea
          value={openingSummary}
          onChange={(event) => setOpeningSummary(event.target.value)}
          rows={4}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <label style={labelStyle}>
        Pain summary
        <textarea
          value={painSummary}
          onChange={(event) => setPainSummary(event.target.value)}
          rows={5}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <label style={labelStyle}>
        Recommended systems summary
        <textarea
          value={recommendedSystemsSummary}
          onChange={(event) => setRecommendedSystemsSummary(event.target.value)}
          rows={5}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <label style={labelStyle}>
        Proposed next steps
        <textarea
          value={proposedNextSteps}
          onChange={(event) => setProposedNextSteps(event.target.value)}
          rows={7}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <label style={labelStyle}>
        Follow-up email body
        <textarea
          value={followUpEmailBody}
          onChange={(event) => setFollowUpEmailBody(event.target.value)}
          rows={12}
          style={{ ...fieldStyle, resize: "vertical", whiteSpace: "pre-wrap" }}
        />
      </label>

      <label style={labelStyle}>
        Internal review notes
        <textarea
          value={internalReviewNotes}
          onChange={(event) => setInternalReviewNotes(event.target.value)}
          rows={5}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          style={{
            border: 0,
            borderRadius: 999,
            background: "#fff",
            color: "#05060a",
            cursor: isPending ? "wait" : "pointer",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0,
            padding: "12px 18px",
            textTransform: "uppercase",
          }}
        >
          {isPending ? "Saving..." : "Save draft"}
        </button>
        {message ? <span style={{ color: "#70e5a0", fontSize: 13 }}>{message}</span> : null}
        {error ? <span style={{ color: "#ff8f8f", fontSize: 13 }}>{error}</span> : null}
      </div>
    </div>
  );
}
