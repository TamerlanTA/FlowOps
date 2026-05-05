"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CASES = [
  {
    category: "Sales",
    badge: "E-commerce / Retail",
    title: "WhatsApp AI Sales Bot + CRM Sync",
    problem: "Sales managers spent 2–3 hours a day on data entry instead of selling. Leads were fast but qualification was entirely manual.",
    pipeline: ["WhatsApp", "AI Qualify", "CRM Entry", "Manager Alert", "Follow-up"],
    metrics: [
      { value: "-83%", label: "Less time on lead qualification" },
      { value: "+47%", label: "Leads followed up in 1hr" },
      { value: "+22%", label: "Conversion on qualified leads" },
    ],
    quote: "We went from chasing leads to receiving them already qualified.",
    author: "Head of Sales, fashion e-commerce brand",
  },
  {
    category: "Operations",
    badge: "E-commerce / Fulfillment",
    title: "Shopify Orders → Operations Pipeline",
    problem: "80–150 orders per day consumed two full-time employees on manual Slack messages, spreadsheet updates, and task assignments.",
    pipeline: ["Order In", "Classify", "ClickUp Task", "Supplier Alert", "Customer Update"],
    metrics: [
      { value: "2 FTE", label: "Manual coordination eliminated" },
      { value: "100%", label: "Orders processed in 90 seconds" },
      { value: "+34%", label: "On-time fulfillment rate" },
    ],
    quote: "We scaled from 80 to 300 orders a day without hiring anyone new.",
    author: "Operations Director, home goods brand",
  },
  {
    category: "AI",
    badge: "B2B SaaS / Professional Services",
    title: "AI Lead Research & Outreach Pipeline",
    problem: "Sales team spent 4–6 hours per day researching prospects. Only 2 hours of each day were actually spent selling.",
    pipeline: ["Lead List", "AI Research", "Score", "Draft Outreach", "CRM + Send"],
    metrics: [
      { value: "-74%", label: "Time on pre-outreach research" },
      { value: "3.2×", label: "Outreach volume per rep" },
      { value: "+41%", label: "Reply rate vs templates" },
    ],
    quote: "Our reps used to dread prospecting. Now they spend their mornings approving AI-drafted emails.",
    author: "VP Sales, B2B SaaS company",
  },
];

const FILTERS = ["All", "Sales", "Operations", "AI"];

function CaseCard({ c }: { c: typeof CASES[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#0f1017",
        border: `1px solid ${hovered ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "var(--shadow-blue)" : "none",
        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span
            style={{
              background: "rgba(59,130,246,0.1)",
              color: "#60a5fa",
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "100px",
              letterSpacing: "0.04em",
            }}
          >
            {c.badge}
          </span>
        </div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#f0f2ff",
            lineHeight: 1.3,
            marginBottom: "12px",
          }}
        >
          {c.title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            marginBottom: "16px",
          }}
        >
          {c.problem}
        </p>

        {/* Mini pipeline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {c.pipeline.map((node, i) => (
            <div key={node} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--color-text-faint)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  whiteSpace: "nowrap",
                }}
              >
                {node}
              </span>
              {i < c.pipeline.length - 1 && (
                <span style={{ color: "var(--color-text-faint)", fontSize: "10px" }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {c.metrics.map((m, i) => (
          <div
            key={i}
            style={{
              padding: "12px 8px",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#f59e0b",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: "10px", color: "var(--color-text-faint)", lineHeight: 1.4 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            fontStyle: "italic",
            lineHeight: 1.7,
            borderLeft: "2px solid rgba(59,130,246,0.4)",
            paddingLeft: "12px",
            marginBottom: "16px",
          }}
        >
          &ldquo;{c.quote}&rdquo;
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-faint)" }}>— {c.author}</span>
          <button
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--color-text-muted)",
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.borderColor = "#3b82f6";
              btn.style.color = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.borderColor = "rgba(255,255,255,0.1)";
              btn.style.color = "var(--color-text-muted)";
            }}
          >
            Read full case →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cases-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cases-heading", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const filtered =
    filter === "All" ? CASES : CASES.filter((c) => c.category === filter);

  return (
    <section id="cases" ref={sectionRef} style={{ background: "#000000", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="cases-heading" style={{ textAlign: "center", marginBottom: "48px" }}>
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
            Live Results
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "#f0f2ff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              maxWidth: "640px",
              margin: "0 auto 16px",
            }}
          >
            Not concepts. Not mockups. Systems running in production right now.
          </h2>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "40px", justifyContent: "center", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#3b82f6" : "#0f1017",
                color: filter === f ? "white" : "var(--color-text-muted)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "8px 20px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "none",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          <AnimatePresence>
            {filtered.map((c) => (
              <CaseCard key={c.title} c={c} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
