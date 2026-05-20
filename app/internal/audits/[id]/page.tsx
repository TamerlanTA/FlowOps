import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { AuditResponseDraftEditor } from "@/components/internal/AuditResponseDraftEditor";
import {
  getAuditWorkItemById,
  getOrCreateAuditResponseDraft,
  type AuditResponseDraft,
  type AuditWorkItem,
} from "@/lib/audit/admin";
import {
  getInternalAccessKeyStatus,
  validateInternalAccessKey,
} from "@/lib/internal/access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal Audit Response Draft | FlowOps",
  robots: {
    index: false,
    follow: false,
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function pill(label: string, tone: "default" | "high" | "system" = "default") {
  const colors = {
    default: "rgba(255,255,255,0.08)",
    high: "rgba(255,91,91,0.18)",
    system: "rgba(86,156,255,0.16)",
  };

  return (
    <span
      key={label}
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 999,
        background: colors[tone],
        color: "rgba(255,255,255,0.86)",
        display: "inline-flex",
        fontSize: 12,
        lineHeight: 1,
        padding: "7px 10px",
      }}
    >
      {label}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AccessRequiredScreen() {
  const status = getInternalAccessKeyStatus();

  return (
    <main style={pageStyle}>
      <section style={panelStyle}>
        <p style={eyebrowStyle}>FlowOps Internal</p>
        <h1 style={titleStyle}>Access required</h1>
        <p style={mutedStyle}>
          This audit response draft workspace is internal-only. Open it with a
          valid internal access key.
        </p>
        <code style={codeStyle}>/internal/audits/WORK_ITEM_ID?key=YOUR_INTERNAL_KEY</code>
        {status.devFallbackAllowed ? (
          <p style={{ ...mutedStyle, marginTop: 18 }}>
            Local development fallback: <code style={inlineCodeStyle}>{status.devFallbackKey}</code>
          </p>
        ) : null}
      </section>
    </main>
  );
}

function WorkItemSummary({ item }: { item: AuditWorkItem }) {
  return (
    <aside style={summaryStyle}>
      <p style={eyebrowStyle}>Work item</p>
      <h2 style={{ color: "#fff", fontSize: 24, margin: 0 }}>
        {item.companyWebsite || item.workEmail}
      </h2>
      <p style={mutedStyle}>{item.workEmail}</p>

      <div style={metaGridStyle}>
        <span><strong>Created</strong>{formatDate(item.createdAt)}</span>
        <span><strong>Business</strong>{item.businessType || "Not provided"}</span>
        <span><strong>Team</strong>{item.teamSize || "Not provided"}</span>
        <span><strong>Next action</strong>{item.nextAction || "Not set"}</span>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <p style={sectionLabelStyle}>Status</p>
        <div style={pillWrapStyle}>
          {pill(item.priority, item.priority === "high" ? "high" : "default")}
          {pill(item.status)}
          {pill(item.followUpStatus)}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <p style={sectionLabelStyle}>Detected pains</p>
        <div style={pillWrapStyle}>
          {item.detectedPains.length
            ? item.detectedPains.map((pain) => pill(pain))
            : pill("No matched signals")}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <p style={sectionLabelStyle}>Recommended systems</p>
        <div style={pillWrapStyle}>
          {item.recommendedSystems.length
            ? item.recommendedSystems.map((system) => pill(system, "system"))
            : pill("No recommendation yet")}
        </div>
      </div>
    </aside>
  );
}

function DraftPreview({ draft }: { draft: AuditResponseDraft }) {
  return (
    <div style={previewStyle}>
      <p style={eyebrowStyle}>Current draft preview</p>
      <h2 style={{ color: "#fff", fontSize: 22, margin: 0 }}>
        {draft.subject || "Untitled draft"}
      </h2>
      <p style={mutedStyle}>
        Status: {draft.status}. This is an internal template draft and is not
        sent automatically.
      </p>
      <div style={previewBlockStyle}>
        <strong>Opening summary</strong>
        <p>{draft.openingSummary || "Not set"}</p>
      </div>
      <div style={previewBlockStyle}>
        <strong>Pain summary</strong>
        <p>{draft.painSummary || "Not set"}</p>
      </div>
      <div style={previewBlockStyle}>
        <strong>Recommended systems summary</strong>
        <p>{draft.recommendedSystemsSummary || "Not set"}</p>
      </div>
      <div style={previewBlockStyle}>
        <strong>Proposed next steps</strong>
        <pre>{draft.proposedNextSteps || "Not set"}</pre>
      </div>
      <div style={previewBlockStyle}>
        <strong>Follow-up email body</strong>
        <pre>{draft.followUpEmailBody || "Not set"}</pre>
      </div>
      <div style={previewBlockStyle}>
        <strong>Internal review notes</strong>
        <pre>{draft.internalReviewNotes || "Not set"}</pre>
      </div>
    </div>
  );
}

export default async function InternalAuditDraftPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const accessKey = getParam(resolvedSearchParams, "key") ?? "";

  if (!validateInternalAccessKey(accessKey)) {
    return <AccessRequiredScreen />;
  }

  let item: AuditWorkItem | null = null;
  let draft: AuditResponseDraft | null = null;
  let loadError = "";

  try {
    item = await getAuditWorkItemById(resolvedParams.id);
    draft = await getOrCreateAuditResponseDraft(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Internal audit response draft load failed:", message);
    loadError =
      "Unable to load or create this audit response draft. Check the work item id, Supabase configuration, and updated schema.";
  }

  const keyParam = encodeURIComponent(accessKey);

  return (
    <main style={pageStyle}>
      <section style={{ width: "min(1180px, calc(100vw - 32px))", margin: "0 auto" }}>
        <header style={{ display: "grid", gap: 16, marginBottom: 28 }}>
          <a href={`/internal/audits?key=${keyParam}`} style={backLinkStyle}>
            Back to Internal Audit Operations
          </a>
          <p style={eyebrowStyle}>FlowOps Internal</p>
          <h1 style={titleStyle}>Internal Audit Response Draft</h1>
          <p style={{ ...mutedStyle, maxWidth: 820 }}>
            Template-based response preparation for an audit work item. No email
            is sent from this page, and this is not an AI-generated audit report.
          </p>
          <div style={warningStyle}>
            Review every field before sending anything manually. Do not add
            metrics, claims, or implementation promises that have not been
            confirmed with the client.
          </div>
        </header>

        {loadError ? <div style={errorPanelStyle}>{loadError}</div> : null}

        {item && draft ? (
          <div style={{ display: "grid", gap: 18 }}>
            <WorkItemSummary item={item} />
            <div style={editorGridStyle}>
              <section style={editorPanelStyle}>
                <AuditResponseDraftEditor accessKey={accessKey} draft={draft} />
              </section>
              <DraftPreview draft={draft} />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(55,112,255,0.16), transparent 38%), #03040a",
  color: "#fff",
  padding: "96px 0",
} satisfies CSSProperties;

const panelStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  background: "rgba(255,255,255,0.045)",
  boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
  margin: "0 auto",
  padding: 36,
  width: "min(720px, calc(100vw - 32px))",
} satisfies CSSProperties;

const titleStyle = {
  color: "#fff",
  fontSize: "clamp(34px, 6vw, 64px)",
  letterSpacing: 0,
  lineHeight: 0.96,
  margin: 0,
} satisfies CSSProperties;

const eyebrowStyle = {
  color: "rgba(151,190,255,0.92)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0,
  margin: 0,
  textTransform: "uppercase",
} satisfies CSSProperties;

const mutedStyle = {
  color: "rgba(255,255,255,0.64)",
  fontSize: 15,
  lineHeight: 1.65,
  margin: 0,
} satisfies CSSProperties;

const codeStyle = {
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "rgba(255,255,255,0.88)",
  display: "block",
  marginTop: 18,
  padding: 14,
} satisfies CSSProperties;

const inlineCodeStyle = {
  background: "rgba(255,255,255,0.08)",
  borderRadius: 6,
  color: "#fff",
  padding: "2px 6px",
} satisfies CSSProperties;

const backLinkStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 999,
  color: "rgba(255,255,255,0.78)",
  display: "inline-flex",
  fontSize: 12,
  justifySelf: "start",
  letterSpacing: 0,
  padding: "9px 13px",
  textDecoration: "none",
  textTransform: "uppercase",
} satisfies CSSProperties;

const warningStyle = {
  border: "1px solid rgba(255,200,110,0.22)",
  borderRadius: 14,
  background: "rgba(255,190,90,0.08)",
  color: "rgba(255,232,198,0.9)",
  fontSize: 13,
  lineHeight: 1.5,
  padding: "12px 14px",
} satisfies CSSProperties;

const errorPanelStyle = {
  border: "1px solid rgba(255,120,120,0.24)",
  borderRadius: 16,
  background: "rgba(255,80,80,0.08)",
  color: "#ffd6d6",
  padding: 20,
} satisfies CSSProperties;

const summaryStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
  background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.035))",
  display: "grid",
  gap: 16,
  padding: 22,
} satisfies CSSProperties;

const editorGridStyle = {
  alignItems: "start",
  display: "grid",
  gap: 18,
  gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.85fr)",
} satisfies CSSProperties;

const editorPanelStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
  background: "rgba(255,255,255,0.045)",
  padding: 22,
} satisfies CSSProperties;

const previewStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
  background: "rgba(0,0,0,0.22)",
  display: "grid",
  gap: 14,
  padding: 22,
} satisfies CSSProperties;

const previewBlockStyle = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.72)",
  display: "grid",
  gap: 8,
  paddingTop: 14,
  whiteSpace: "pre-wrap",
} satisfies CSSProperties;

const metaGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
} satisfies CSSProperties;

const sectionLabelStyle = {
  color: "rgba(255,255,255,0.48)",
  fontSize: 11,
  letterSpacing: 0,
  margin: 0,
  textTransform: "uppercase",
} satisfies CSSProperties;

const pillWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
} satisfies CSSProperties;
