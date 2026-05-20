"use client";

import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useState, useTransition } from "react";

const STATUS_OPTIONS = [
  "new",
  "reviewing",
  "response_prepared",
  "contacted",
  "closed",
] as const;

const FOLLOW_UP_OPTIONS = [
  "not_started",
  "drafted",
  "sent",
  "waiting",
  "completed",
] as const;

type AuditWorkItemActionsProps = {
  itemId: string;
  accessKey: string;
  initialStatus: string;
  initialFollowUpStatus: string;
  initialNextAction: string;
  initialInternalNotes: string;
};

const fieldStyle = {
  width: "100%",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  padding: "10px 12px",
  fontSize: 13,
  outline: "none",
} satisfies CSSProperties;

export function AuditWorkItemActions({
  itemId,
  accessKey,
  initialStatus,
  initialFollowUpStatus,
  initialNextAction,
  initialInternalNotes,
}: AuditWorkItemActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(initialStatus);
  const [followUpStatus, setFollowUpStatus] = useState(initialFollowUpStatus);
  const [nextAction, setNextAction] = useState(initialNextAction);
  const [internalNotes, setInternalNotes] = useState(initialInternalNotes);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setMessage("");
    setError("");

    const response = await fetch("/api/internal/audit-work-items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-flowops-internal-key": accessKey,
      },
      body: JSON.stringify({
        id: itemId,
        status,
        followUpStatus,
        nextAction,
        internalNotes,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      success?: boolean;
      message?: string;
    } | null;

    if (!response.ok || !data?.success) {
      setError(data?.message || "Unable to update this work item.");
      return;
    }

    setMessage("Updated");
    startTransition(() => router.refresh());
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
        <label style={{ display: "grid", gap: 6, color: "rgba(255,255,255,0.62)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0 }}>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)} style={fieldStyle}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6, color: "rgba(255,255,255,0.62)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0 }}>
          Follow-up
          <select value={followUpStatus} onChange={(event) => setFollowUpStatus(event.target.value)} style={fieldStyle}>
            {FOLLOW_UP_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label style={{ display: "grid", gap: 6, color: "rgba(255,255,255,0.62)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0 }}>
        Next action
        <input value={nextAction} onChange={(event) => setNextAction(event.target.value)} style={fieldStyle} />
      </label>

      <label style={{ display: "grid", gap: 6, color: "rgba(255,255,255,0.62)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0 }}>
        Internal notes
        <textarea
          value={internalNotes}
          onChange={(event) => setInternalNotes(event.target.value)}
          rows={3}
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            padding: "10px 16px",
            textTransform: "uppercase",
            letterSpacing: 0,
          }}
        >
          {isPending ? "Saving..." : "Save update"}
        </button>
        {message ? <span style={{ color: "#70e5a0", fontSize: 12 }}>{message}</span> : null}
        {error ? <span style={{ color: "#ff8f8f", fontSize: 12 }}>{error}</span> : null}
      </div>
    </div>
  );
}
