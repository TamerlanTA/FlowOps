"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  {
    id: "sales",
    label: "Sales System",
    headline: "Never lose a lead to a slow process again.",
    description:
      "We automate the full sales motion — from first touch to closed deal. Lead capture, qualification, routing, follow-up sequences, CRM updates, and pipeline visibility. Your team focuses on selling. The system handles everything else.",
    bullets: [
      "Omnichannel lead capture (WhatsApp, forms, calls, ads)",
      "AI-powered lead qualification and scoring",
      "Automatic CRM routing and task creation",
      "Multi-step follow-up sequences (email + messenger)",
      "Real-time pipeline and conversion dashboards",
      "Manager alerts for high-value or stalled deals",
    ],
    result: "Teams using our sales systems respond 5× faster and close 30% more of their pipeline.",
    nodes: ["Lead In", "AI Qualify", "CRM Route", "Follow-up", "Close"],
  },
  {
    id: "ops",
    label: "Ops System",
    headline: "Run operations that don't depend on people remembering things.",
    description:
      "We replace manual coordination with structured, automated workflows. Internal handoffs, approvals, task creation, alerts, and cross-tool execution — all triggered by events, not by humans chasing each other.",
    bullets: [
      "Order-to-operation workflows (Shopify, WooCommerce, custom)",
      "Automated task creation in ClickUp, Notion, Linear, Jira",
      "Internal approval chains with escalation logic",
      "Cross-system data sync (ERP, CRM, support, logistics)",
      "Scheduled and trigger-based reporting",
      "Slack / Telegram / email alert routing",
    ],
    result: "Our ops systems eliminate an average of 12 hours of manual coordination per week per team.",
    nodes: ["Trigger", "Rules", "Tasks", "Alerts", "Report"],
  },
  {
    id: "ai",
    label: "AI Layer",
    headline: "Add intelligence to the systems your business already runs on.",
    description:
      "We build practical AI layers on top of your existing tools and workflows. Not experiments — production-grade assistants, processors, and classifiers that handle real volume and deliver measurable results from week one.",
    bullets: [
      "AI sales and support assistants (WhatsApp, Telegram, website chat)",
      "Document and data processing pipelines (PDFs, forms, contracts)",
      "Lead research and outreach personalization at scale",
      "Internal knowledge assistants for teams and onboarding",
      "AI-powered classification, routing, and summarization",
      "Prompt design, testing, and rollout standards",
    ],
    result: "Our AI layers handle 60–80% of repetitive queries without human involvement.",
    nodes: ["Input", "AI Process", "Classify", "Route", "Output"],
  },
];

const NODE_COLORS = ["#3b82f6", "#f59e0b", "#3b82f6", "#f59e0b", "#3b82f6"];

function FlowDiagram({ nodes, active }: { nodes: string[]; active: boolean }) {
  const linesRef = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (!active) return;
    linesRef.current.forEach((line, i) => {
      if (!line) return;
      const len = line.getTotalLength?.() ?? 60;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: "power2.out",
      });
    });
  }, [active, nodes]);

  return (
    <div
      style={{
        background: "#0a0a0f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "32px 24px",
        position: "relative",
        minHeight: "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          position: "relative",
        }}
      >
        {nodes.map((node, i) => (
          <div key={node} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div
              style={{
                padding: "10px 20px",
                background: "#0f1017",
                border: `1px solid ${NODE_COLORS[i % NODE_COLORS.length]}`,
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#f0f2ff",
                boxShadow: `0 0 12px ${NODE_COLORS[i % NODE_COLORS.length]}30`,
                animation: "nodeGlow 2s ease-in-out infinite alternate",
                animationDelay: `${i * 0.3}s`,
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {node}
            </div>
            {i < nodes.length - 1 && (
              <svg width="2" height="24" style={{ overflow: "visible" }}>
                <path
                  ref={(el) => { if (el) linesRef.current[i] = el; }}
                  d="M 1 0 L 1 24"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes nodeGlow {
          from { box-shadow: 0 0 8px rgba(59,130,246,0.2); }
          to { box-shadow: 0 0 16px rgba(59,130,246,0.4); }
        }
      `}</style>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".svc-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".svc-heading", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tab = TABS[activeTab];

  return (
    <section id="services" ref={sectionRef} style={{ background: "#0a0a0f", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="svc-heading" style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-text-faint)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            What We Build
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "#f0f2ff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: "640px",
              margin: "0 auto",
            }}
          >
            We don&apos;t sell tools. We build the layer that makes your tools work together.
          </h2>
        </div>

        {/* Tab Bar */}
        <div
          style={{
            background: "#0f1017",
            borderRadius: "12px",
            padding: "4px",
            display: "inline-flex",
            gap: "4px",
            marginBottom: "40px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "10px 24px",
                borderRadius: "8px",
                border: "none",
                cursor: "none",
                fontSize: "14px",
                fontWeight: 600,
                background: activeTab === i ? "rgba(59,130,246,0.12)" : "transparent",
                color: activeTab === i ? "#3b82f6" : "var(--color-text-faint)",
                borderBottom: activeTab === i ? "2px solid #3b82f6" : "2px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== i) (e.target as HTMLButtonElement).style.color = "var(--color-text-muted)";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== i) (e.target as HTMLButtonElement).style.color = "var(--color-text-faint)";
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "48px",
              alignItems: "start",
            }}
            className="svc-panel"
          >
            {/* Left: Content */}
            <div>
              <h3
                style={{
                  fontSize: "clamp(20px, 3vw, 28px)",
                  fontWeight: 700,
                  color: "#f0f2ff",
                  lineHeight: 1.2,
                  marginBottom: "16px",
                }}
              >
                {tab.headline}
              </h3>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, marginBottom: "24px", fontSize: "15px" }}>
                {tab.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {tab.bullets.map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#3b82f6",
                        minWidth: "6px",
                        marginTop: "8px",
                      }}
                    />
                    <span style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(59,130,246,0.06)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: "10px",
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                }}
              >
                {tab.result}
              </div>
            </div>

            {/* Right: Flow diagram */}
            <FlowDiagram nodes={tab.nodes} active={true} />
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .svc-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
