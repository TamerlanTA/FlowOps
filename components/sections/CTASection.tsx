"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_OPTIONS = [
  { id: "sales", label: "Sales Automation", icon: "→" },
  { id: "ops", label: "Ops Automation", icon: "⚙" },
  { id: "ai", label: "AI Integration", icon: "✦" },
  { id: "full", label: "Full System Build", icon: "◆" },
];

const TRUST_CHIPS = [
  { icon: "⚡", label: "Response within 1 business day" },
  { icon: "🔒", label: "No commitment required" },
  { icon: "📋", label: "You get a real plan, not a proposal" },
  { icon: "🤝", label: "Free audit call included" },
];

const REVENUE_OPTIONS = [
  "< $100k / month",
  "$100k – $500k / month",
  "$500k – $2M / month",
  "$2M+ / month",
];

const STEP_LABELS = ["What you need", "Tell us about it", "Your contact"];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({
    bottleneck: "",
    tools: "",
    name: "",
    company: "",
    email: "",
    whatsapp: "",
    revenueRange: REVENUE_OPTIONS[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cta-heading", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        company: form.company,
        businessType: selected || "Full system audit",
        revenueRange: form.revenueRange,
        problemDescription: `Bottleneck: ${form.bottleneck}\nTools: ${form.tools}`,
        email: form.email,
        whatsapp: form.whatsapp || "+0000000000",
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { success: boolean; message: string };
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#141520",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        background: "linear-gradient(180deg, #000000, #050510)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue glow background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "var(--container-width)",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="cta-grid"
        >
          {/* Left: Copy */}
          <div className="cta-heading">
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
              Start Here
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                color: "#f0f2ff",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                marginBottom: "20px",
              }}
            >
              Ready to cut 68% of manual work?
            </h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, fontSize: "15px", marginBottom: "36px" }}>
              Request a free automation audit. Include your tools, the process you want to fix, and where you&apos;re losing the most time. We&apos;ll review it personally and come back with a specific, actionable plan — not a sales pitch.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {TRUST_CHIPS.map((chip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{chip.icon}</span>
                  <span style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>{chip.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div
            style={{
              background: "#0f1017",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {success ? (
              <div style={{ padding: "48px 32px", textAlign: "center" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(59,130,246,0.15)",
                    border: "2px solid #3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: "28px",
                    color: "#3b82f6",
                    animation: "checkPop 0.4s ease-out",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f0f2ff", marginBottom: "12px" }}>
                  Request received
                </h3>
                <p style={{ color: "var(--color-text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
                  Got it. A real human (not a bot) will review your request and reach out within one business day with next steps. No pitch decks. Just a conversation.
                </p>
                <style>{`
                  @keyframes checkPop {
                    0% { transform: scale(0); opacity: 0; }
                    70% { transform: scale(1.15); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                `}</style>
              </div>
            ) : (
              <>
                {/* Progress dots */}
                <div
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: i === step ? "24px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background: i === step ? "#3b82f6" : i < step ? "#3b82f6" : "rgba(255,255,255,0.15)",
                          transition: "all 0.3s",
                        }}
                      />
                    ))}
                    <span style={{ fontSize: "12px", color: "var(--color-text-faint)", marginLeft: "8px" }}>
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "28px 24px" }}>
                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "20px" }}>
                          What type of system do you need?
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          {SERVICE_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setSelected(opt.id)}
                              style={{
                                padding: "16px 12px",
                                background: selected === opt.id ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${selected === opt.id ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
                                borderRadius: "10px",
                                cursor: "none",
                                textAlign: "left",
                                transition: "all 0.2s",
                                position: "relative",
                              }}
                            >
                              <div style={{ fontSize: "20px", marginBottom: "8px" }}>{opt.icon}</div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: selected === opt.id ? "#60a5fa" : "var(--color-text-muted)" }}>
                                {opt.label}
                              </div>
                              {selected === opt.id && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    color: "#3b82f6",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setStep(1)}
                          disabled={!selected}
                          style={{
                            marginTop: "20px",
                            width: "100%",
                            padding: "13px",
                            background: selected ? "#3b82f6" : "rgba(59,130,246,0.3)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: selected ? "none" : "not-allowed",
                            transition: "background 0.2s",
                          }}
                        >
                          Next →
                        </button>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ fontSize: "13px", color: "var(--color-text-muted)", display: "block", marginBottom: "8px" }}>
                            Describe your biggest bottleneck
                          </label>
                          <textarea
                            value={form.bottleneck}
                            onChange={(e) => setForm({ ...form, bottleneck: e.target.value })}
                            placeholder="e.g. Manual lead entry, report building, order processing..."
                            rows={3}
                            style={{ ...inputStyle, resize: "vertical" }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#3b82f6";
                              e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "rgba(255,255,255,0.1)";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                          <label style={{ fontSize: "13px", color: "var(--color-text-muted)", display: "block", marginBottom: "8px" }}>
                            What tools do you currently use?
                          </label>
                          <input
                            type="text"
                            value={form.tools}
                            onChange={(e) => setForm({ ...form, tools: e.target.value })}
                            placeholder="CRM, WhatsApp, Shopify, etc."
                            style={inputStyle}
                            onFocus={(e) => {
                              e.target.style.borderColor = "#3b82f6";
                              e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "rgba(255,255,255,0.1)";
                              e.target.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => setStep(0)}
                            style={{
                              flex: 1,
                              padding: "13px",
                              background: "none",
                              border: "1px solid rgba(255,255,255,0.14)",
                              color: "var(--color-text-muted)",
                              borderRadius: "10px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "none",
                            }}
                          >
                            ← Back
                          </button>
                          <button
                            onClick={() => setStep(2)}
                            disabled={!form.bottleneck.trim()}
                            style={{
                              flex: 2,
                              padding: "13px",
                              background: form.bottleneck.trim() ? "#3b82f6" : "rgba(59,130,246,0.3)",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: form.bottleneck.trim() ? "none" : "not-allowed",
                            }}
                          >
                            Next →
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                          {[
                            { key: "name", label: "First name *", placeholder: "Alex", type: "text" },
                            { key: "company", label: "Company *", placeholder: "Your company name", type: "text" },
                            { key: "email", label: "Email *", placeholder: "alex@company.com", type: "email" },
                            { key: "whatsapp", label: "WhatsApp (optional, but faster)", placeholder: "+1 234 567 8900", type: "tel" },
                          ].map((field) => (
                            <div key={field.key}>
                              <label style={{ fontSize: "12px", color: "var(--color-text-faint)", display: "block", marginBottom: "6px" }}>
                                {field.label}
                              </label>
                              <input
                                type={field.type}
                                value={form[field.key as keyof typeof form]}
                                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                placeholder={field.placeholder}
                                style={inputStyle}
                                onFocus={(e) => {
                                  e.target.style.borderColor = "#3b82f6";
                                  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.15)";
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                  e.target.style.boxShadow = "none";
                                }}
                              />
                            </div>
                          ))}

                          <div>
                            <label style={{ fontSize: "12px", color: "var(--color-text-faint)", display: "block", marginBottom: "6px" }}>
                              Monthly revenue range
                            </label>
                            <select
                              value={form.revenueRange}
                              onChange={(e) => setForm({ ...form, revenueRange: e.target.value })}
                              style={{
                                ...inputStyle,
                                background: "#141520",
                              }}
                            >
                              {REVENUE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} style={{ background: "#141520" }}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {error && (
                          <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px" }}>{error}</p>
                        )}

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => setStep(1)}
                            style={{
                              flex: 1,
                              padding: "13px",
                              background: "none",
                              border: "1px solid rgba(255,255,255,0.14)",
                              color: "var(--color-text-muted)",
                              borderRadius: "10px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: "none",
                            }}
                          >
                            ← Back
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={submitting || !form.name || !form.company || !form.email}
                            style={{
                              flex: 2,
                              padding: "13px",
                              background:
                                !submitting && form.name && form.company && form.email
                                  ? "#3b82f6"
                                  : "rgba(59,130,246,0.3)",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              fontSize: "14px",
                              fontWeight: 600,
                              cursor: !submitting && form.name && form.company && form.email ? "none" : "not-allowed",
                            }}
                          >
                            {submitting ? "Sending..." : "Request free audit →"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cta-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
