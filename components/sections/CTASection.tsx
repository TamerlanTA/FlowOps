"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { BarChart3, FileText, Handshake, Inbox, LayoutGrid, Lock, MousePointer2, PhoneCall, Settings2, Zap } from "lucide-react";
import styles from "./CTASection.module.css";

const SERVICE_OPTIONS = [
  { id: "lead", label: "LeadOS", icon: <MousePointer2 size={18} /> },
  { id: "sales", label: "SalesOS", icon: <LayoutGrid size={18} /> },
  { id: "voice", label: "VoiceOS", icon: <PhoneCall size={18} /> },
  { id: "inbox", label: "InboxOS", icon: <Inbox size={18} /> },
  { id: "ops", label: "OpsOS", icon: <Settings2 size={18} /> },
  { id: "report", label: "ReportOS", icon: <BarChart3 size={18} /> },
];

const TRUST_CHIPS = [
  { icon: <Zap size={16} />, label: "Secure lead capture" },
  { icon: <Lock size={16} />, label: "No commitment required" },
  { icon: <FileText size={16} />, label: "Workflow map + roadmap" },
  { icon: <Handshake size={16} />, label: "Clear system recommendation" },
];

const INDUSTRY_OPTIONS = [
  "B2B services",
  "E-commerce",
  "SaaS",
  "Logistics / operations",
  "Healthcare operations",
  "Real estate",
  "Other",
];

const TEAM_SIZE_OPTIONS = ["1–10", "11–25", "26–75", "76–200", "200+"];

const STEP_LABELS = ["SYSTEM", "OPERATION", "REQUEST"];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    website: "",
    industry: INDUSTRY_OPTIONS[0],
    pain: "",
    teamSize: TEAM_SIZE_OPTIONS[1],
    bottleneck: "",
    tools: "",
    company: "",
    companyNameConfirm: "",
  });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.copy}`,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: `.${styles.copy}`, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workEmail: form.email,
          companyWebsite: form.website,
          businessType: form.industry,
          mainOperationalPain: form.pain,
          teamSize: form.teamSize,
          currentTools: form.tools,
          biggestBottleneck: form.bottleneck,
          selectedSystem: selected,
          company: form.company,
          companyNameConfirm: form.companyNameConfirm,
          pageUrl: window.location.href,
          source: "flowops_website",
        }),
      });
      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.message || "Unable to submit the audit request right now.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <div className={styles.bgGlow} />
      
      {/* Background Orbital Lines */}
      <div className={styles.orbitalLine} style={{ width: '1200px', height: '1200px', top: '-200px', right: '-400px' }} />
      <div className={styles.orbitalLine} style={{ width: '800px', height: '800px', bottom: '-100px', left: '-200px' }} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Side: Copy */}
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Start With The Audit</span>
            <h2 className={styles.title}>Request your free AI Operations Audit.</h2>
            <p className={styles.description}>
              Send a structured snapshot of the workflow that is slowing the company down. FlowOps will store the request securely, review the operation, and route the next steps internally.
            </p>
            
            <div className={styles.trustChips}>
              {TRUST_CHIPS.map((chip, i) => (
                <div key={i} className={styles.trustChip}>
                  <span>{chip.icon}</span>
                  {chip.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form Panel */}
          <div className={styles.panel}>
            {success ? (
              <div style={{ padding: "60px 40px", textAlign: "center" }}>
                <div style={{ 
                  width: 80, height: 80, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', 
                  border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px', color: 'var(--color-primary)',
                  boxShadow: 'var(--shadow-blue)'
                }}>✓</div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Audit Request Received</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                  We&apos;ll review your operation and contact you with next steps.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.panelHeader}>
                  <div className={styles.panelTitle}>CONFIGURATION // {STEP_LABELS[step]}</div>
                  <div className={styles.progressContainer}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`${styles.progressDot} ${i <= step ? styles.progressDotActive : ""}`} />
                    ))}
                  </div>
                </div>

                <div className={styles.panelBody}>
                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className={styles.stepLabel}>First system to explore</div>
                        <div className={styles.optionsGrid}>
                          {SERVICE_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              className={`${styles.optionCard} ${selected === opt.id ? styles.optionCardActive : ""}`}
                              onClick={() => setSelected(opt.id)}
                              data-cursor="pointer"
                            >
                              <span className={styles.optionIcon}>{opt.icon}</span>
                              <span className={`${styles.optionLabel} ${selected === opt.id ? styles.optionLabelActive : ""}`}>
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        <button
                          className={styles.btnPrimary}
                          style={{ width: '100%', marginTop: '32px' }}
                          disabled={!selected}
                          onClick={() => setStep(1)}
                          data-cursor="pointer"
                        >
                          Continue to Snapshot
                        </button>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className={styles.stepLabel}>Operational Snapshot</div>
                        <div className={styles.field}>
                          <label className={styles.label}>Main operational pain</label>
                          <textarea
                            className={styles.input}
                            rows={3}
                            placeholder="e.g. missed leads, slow follow-up, disconnected reporting..."
                            value={form.pain}
                            onChange={(e) => setForm({ ...form, pain: e.target.value })}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Biggest bottleneck</label>
                          <textarea
                            className={styles.input}
                            rows={3}
                            placeholder="Where does the workflow slow down or break?"
                            value={form.bottleneck}
                            onChange={(e) => setForm({ ...form, bottleneck: e.target.value })}
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Existing tools</label>
                          <input
                            className={styles.input}
                            placeholder="CRM, inbox, phone system, spreadsheets, dashboards..."
                            value={form.tools}
                            onChange={(e) => setForm({ ...form, tools: e.target.value })}
                          />
                        </div>
                        <div className={styles.buttonGroup}>
                          <button className={styles.btnSecondary} onClick={() => setStep(0)} data-cursor="pointer">Back</button>
                          <button 
                            className={styles.btnPrimary} 
                            disabled={!form.pain.trim() || !form.bottleneck.trim()}
                            onClick={() => setStep(2)}
                            data-cursor="pointer"
                          >
                            Proceed to Contact
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className={styles.stepLabel}>Audit request details</div>
                        <div className={styles.honeypot} aria-hidden="true">
                          <label className={styles.label}>Company name confirmation</label>
                          <input
                            className={styles.input}
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.companyNameConfirm}
                            onChange={(e) => setForm({ ...form, companyNameConfirm: e.target.value })}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div className={styles.field} style={{ marginBottom: 0 }}>
                            <label className={styles.label}>Work email</label>
                            <input className={styles.input} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                          </div>
                          <div className={styles.field} style={{ marginBottom: 0 }}>
                            <label className={styles.label}>Company</label>
                            <input className={styles.input} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                          </div>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.label}>Company website</label>
                          <input className={styles.input} placeholder="https://company.com" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div className={styles.field} style={{ marginBottom: 0 }}>
                            <label className={styles.label}>Business type / industry</label>
                            <select 
                              className={styles.input} 
                              style={{ background: '#1a1b2e' }}
                              value={form.industry}
                              onChange={(e) => setForm({ ...form, industry: e.target.value })}
                            >
                              {INDUSTRY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                          <div className={styles.field} style={{ marginBottom: 0 }}>
                            <label className={styles.label}>Team size</label>
                          <select 
                            className={styles.input} 
                            style={{ background: '#1a1b2e' }}
                              value={form.teamSize}
                              onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
                          >
                              {TEAM_SIZE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                          </div>
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        <p className={styles.formNote}>
                          Stored first, notifications second. If email or n8n forwarding fails after storage, the request is still captured.
                        </p>
                        <div className={styles.buttonGroup}>
                          <button className={styles.btnSecondary} onClick={() => setStep(1)} data-cursor="pointer">Back</button>
                          <button 
                            className={styles.btnPrimary}
                            disabled={submitting || !form.email || !form.pain.trim() || !form.bottleneck.trim()}
                            onClick={handleSubmit}
                            data-cursor="pointer"
                          >
                            {submitting ? "Submitting..." : "Request Free AI Operations Audit"}
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
    </section>
  );
}
