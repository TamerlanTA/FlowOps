import type { Metadata } from "next";
import type { CSSProperties } from "react";

import { AuditWorkItemActions } from "@/components/internal/AuditWorkItemActions";
import { listAuditWorkItems, type AuditWorkItem } from "@/lib/audit/admin";
import {
  getInternalAccessKeyStatus,
  validateInternalAccessKey,
} from "@/lib/internal/access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal Audit Operations | FlowOps",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

function getParam(params: SearchParams, key: string) {
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

function accessRequiredScreen() {
  const status = getInternalAccessKeyStatus();

  return (
    <main style={pageStyle}>
      <section style={accessPanelStyle}>
        <p style={eyebrowStyle}>FlowOps Internal</p>
        <h1 style={titleStyle}>Access required</h1>
        <p style={mutedStyle}>
          This workspace is for internal audit operations only. Open it with a valid
          internal access key in the URL.
        </p>
        <code style={codeStyle}>/internal/audits?key=YOUR_INTERNAL_KEY</code>
        {status.devFallbackAllowed ? (
          <p style={{ ...mutedStyle, marginTop: 18 }}>
            Local development fallback: <code style={inlineCodeStyle}>{status.devFallbackKey}</code>
          </p>
        ) : null}
      </section>
    </main>
  );
}

export default async function InternalAuditsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const accessKey = getParam(params, "key") ?? "";
  const status = getParam(params, "status");
  const priority = getParam(params, "priority");

  if (!validateInternalAccessKey(accessKey)) {
    return accessRequiredScreen();
  }

  let items: AuditWorkItem[] = [];
  let loadError = "";

  try {
    items = await listAuditWorkItems({ status, priority, limit: 50 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Internal audit workspace load failed:", message);
    loadError = "Unable to load audit work items. Check Supabase configuration and schema.";
  }

  const keyParam = encodeURIComponent(accessKey);

  return (
    <main style={pageStyle}>
      <section style={{ width: "min(1180px, calc(100vw - 32px))", margin: "0 auto" }}>
        <header style={{ display: "grid", gap: 18, marginBottom: 28 }}>
          <p style={eyebrowStyle}>FlowOps Internal</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <h1 style={titleStyle}>Internal Audit Operations</h1>
              <p style={{ ...mutedStyle, maxWidth: 720 }}>
                Incoming AI Operations Audit work items, deterministic triage, and
                follow-up status. This is not a client portal and is not linked from
                the public website.
              </p>
            </div>
            <div style={summaryCardStyle}>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, textTransform: "uppercase", letterSpacing: 0 }}>
                Loaded items
              </span>
              <strong style={{ color: "#fff", fontSize: 34 }}>{items.length}</strong>
            </div>
          </div>
          <div style={warningStyle}>
            Temporary key-based access is active for V1. Replace with proper
            authenticated admin access before broader production use.
          </div>
          <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={`/internal/audits?key=${keyParam}`} style={filterStyle}>All</a>
            <a href={`/internal/audits?key=${keyParam}&status=new`} style={filterStyle}>New</a>
            <a href={`/internal/audits?key=${keyParam}&status=reviewing`} style={filterStyle}>Reviewing</a>
            <a href={`/internal/audits?key=${keyParam}&priority=high`} style={filterStyle}>High priority</a>
          </nav>
        </header>

        {loadError ? <div style={errorPanelStyle}>{loadError}</div> : null}

        {!loadError && items.length === 0 ? (
          <div style={emptyPanelStyle}>No audit work items found for the current filter.</div>
        ) : null}

        <div style={{ display: "grid", gap: 16 }}>
          {items.map((item) => (
            <article key={item.id} style={itemCardStyle}>
              <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" }}>
                <div style={{ display: "grid", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <p style={{ ...eyebrowStyle, marginBottom: 8 }}>
                        {formatDate(item.createdAt)}
                      </p>
                      <h2 style={{ color: "#fff", fontSize: 22, margin: 0 }}>
                        {item.companyWebsite || item.workEmail}
                      </h2>
                      <p style={{ ...mutedStyle, marginTop: 8 }}>{item.workEmail}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
                      {pill(item.priority, item.priority === "high" ? "high" : "default")}
                      {pill(item.status)}
                      {pill(item.followUpStatus)}
                    </div>
                  </div>

                  <div style={metaGridStyle}>
                    <span><strong>Business</strong>{item.businessType || "Not provided"}</span>
                    <span><strong>Team</strong>{item.teamSize || "Not provided"}</span>
                    <span><strong>Next action</strong>{item.nextAction || "Not set"}</span>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <p style={sectionLabelStyle}>Detected pains</p>
                    <div style={pillWrapStyle}>
                      {item.detectedPains.length
                        ? item.detectedPains.map((painItem) => pill(painItem))
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
                </div>

                <div style={actionsPanelStyle}>
                  <a
                    href={`/internal/audits/${item.id}?key=${keyParam}`}
                    style={draftLinkStyle}
                  >
                    Open draft
                  </a>
                  <AuditWorkItemActions
                    itemId={item.id}
                    accessKey={accessKey}
                    initialStatus={item.status}
                    initialFollowUpStatus={item.followUpStatus}
                    initialNextAction={item.nextAction ?? ""}
                    initialInternalNotes={item.internalNotes ?? ""}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
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

const accessPanelStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  background: "rgba(255,255,255,0.045)",
  boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
  margin: "0 auto",
  padding: 36,
  width: "min(680px, calc(100vw - 32px))",
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

const summaryCardStyle = {
  alignSelf: "start",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  background: "rgba(255,255,255,0.05)",
  display: "grid",
  gap: 6,
  minWidth: 180,
  padding: 18,
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

const filterStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 999,
  color: "rgba(255,255,255,0.78)",
  fontSize: 12,
  padding: "9px 13px",
  textDecoration: "none",
  textTransform: "uppercase",
  letterSpacing: 0,
} satisfies CSSProperties;

const errorPanelStyle = {
  border: "1px solid rgba(255,120,120,0.24)",
  borderRadius: 16,
  background: "rgba(255,80,80,0.08)",
  color: "#ffd6d6",
  padding: 20,
} satisfies CSSProperties;

const emptyPanelStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 16,
  background: "rgba(255,255,255,0.04)",
  color: "rgba(255,255,255,0.66)",
  padding: 28,
} satisfies CSSProperties;

const itemCardStyle = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 20,
  background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.035))",
  boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
  padding: 22,
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

const actionsPanelStyle = {
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  background: "rgba(0,0,0,0.22)",
  display: "grid",
  gap: 14,
  padding: 16,
} satisfies CSSProperties;

const draftLinkStyle = {
  alignItems: "center",
  border: "1px solid rgba(151,190,255,0.28)",
  borderRadius: 999,
  color: "rgba(213,228,255,0.95)",
  display: "inline-flex",
  fontSize: 12,
  fontWeight: 700,
  justifyContent: "center",
  letterSpacing: 0,
  padding: "10px 14px",
  textDecoration: "none",
  textTransform: "uppercase",
} satisfies CSSProperties;
