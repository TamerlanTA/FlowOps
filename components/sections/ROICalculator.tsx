"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./ROICalculator.module.css";

const AUDIT_DELIVERABLES = [
  "Workflow map",
  "Automation opportunities",
  "ROI estimate",
  "System recommendation",
  "Implementation roadmap",
] as const;

const AUDIT_STEPS = [
  {
    label: "Step 1",
    title: "Map current workflows",
    text: "Document how work actually moves across people, tools, approvals, and exceptions.",
  },
  {
    label: "Step 2",
    title: "Identify manual bottlenecks",
    text: "Find the places where follow-up, CRM updates, reports, routing, and handoffs depend on manual effort.",
  },
  {
    label: "Step 3",
    title: "Estimate automation ROI",
    text: "Convert repeated manual work into an operational estimate, then prioritize by effort and impact.",
  },
  {
    label: "Step 4",
    title: "Recommend FlowOps systems",
    text: "Match the operation to LeadOS, SalesOS, VoiceOS, InboxOS, OpsOS, ReportOS, or a staged combination.",
  },
  {
    label: "Step 5",
    title: "Deliver implementation roadmap",
    text: "Define the first system, required integrations, rollout order, owner model, and maintenance path.",
  },
] as const;

const DIAGNOSTIC_SIGNALS = [
  "No tool replacement required",
  "Built around your existing stack",
  "Start with diagnosis, not guesswork",
  "Designed for recurring operational improvement",
] as const;

function useAnimatedNumber(target: number, duration = 800) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = displayRef.current;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Quart easing
      const next = Math.round(from + (target - from) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export default function ROICalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const cockpitRef = useRef<HTMLDivElement>(null);
  
  const [team, setTeam] = useState(5);
  const [hours, setHours] = useState(15);
  const [salary, setSalary] = useState(3000);

  const monthly_loss = Math.round(team * hours * 4 * (salary / 160) * 0.35);
  const audit_priority = Math.min(Math.round((monthly_loss / 20000) * 100), 100);
  const recommended_systems = monthly_loss > 12000 ? 3 : monthly_loss > 6000 ? 2 : 1;
  const hours_recovered = team * hours * 4;

  const displayLoss = useAnimatedNumber(monthly_loss);
  const displayPriority = useAnimatedNumber(audit_priority);
  const displaySystems = useAnimatedNumber(recommended_systems);
  const displayHours = useAnimatedNumber(hours_recovered);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.cockpit}`,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: `.${styles.cockpit}`, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const recoveryProgress = audit_priority;

  return (
    <section id="audit" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>AI Operations Audit</span>
          <h2 className={styles.title}>Start with the audit before you buy another tool.</h2>
          <p className={styles.subtitle}>
            A frontend preview of the audit entry point. The request starts a human review;
            it does not generate an instant report on this page.
          </p>
        </div>

        <div className={styles.auditPipeline}>
          {AUDIT_STEPS.map((step) => (
            <div key={step.title} className={styles.pipelineCard}>
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.cockpit} ref={cockpitRef}>
          {/* Controls */}
          <div className={styles.controls}>
              {[
              { label: "People in the workflow", value: team, set: setTeam, min: 1, max: 100, step: 1, suffix: "px" },
              { label: "Manual hours / week", value: hours, set: setHours, min: 1, max: 80, step: 1, suffix: "hrs" },
              { label: "Avg monthly salary", value: salary, set: setSalary, min: 500, max: 20000, step: 500, suffix: "$" },
            ].map((f) => (
              <div key={f.label} className={styles.inputGroup}>
                <div className={styles.inputHeader}>
                  <label className={styles.inputLabel}>{f.label}</label>
                  <span className={styles.inputValue}>
                    {f.suffix === "$" && "$"}
                    {f.value.toLocaleString()}
                    {f.suffix === "hrs" && " hrs"}
                  </span>
                </div>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className={styles.slider}
                  data-cursor="pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${((f.value - f.min) / (f.max - f.min)) * 100}%, rgba(255,255,255,0.05) ${((f.value - f.min) / (f.max - f.min)) * 100}%)`
                  }}
                />
              </div>
            ))}
            
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <div className={styles.statusChip} style={{ background: 'rgba(59,130,246,0.05)', color: 'var(--color-text-faint)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                Audit planner // illustrative estimate
              </div>
              <div className={styles.deliverablesList}>
                {AUDIT_DELIVERABLES.map((item) => (
                  <div key={item} className={styles.deliverableItem}>
                    <span className={styles.deliverableDot} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={styles.results}>
            <div className={styles.gridOverlay} />
            
            <div className={styles.statusHeader}>
              <div className={`${styles.statusChip} ${styles.statusChipPrimary}`}>Audit deliverable: Workflow map</div>
              <div className={`${styles.statusChip} ${styles.statusChipAccent}`}>No commitment required</div>
            </div>

            <div className={styles.mainMetric}>
              <div className={styles.lossValue}>
                ${displayLoss.toLocaleString()}
              </div>
              <div className={styles.lossLabel}>Monthly Productivity Loss</div>
            </div>

            <div className={styles.secondaryMetrics}>
              <div className={styles.metricCard}>
                <div className={styles.metricCardValue}>{displaySystems}</div>
                <div className={styles.metricCardLabel}>Likely system recommendations</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricCardValue}>{displayHours}</div>
                <div className={styles.metricCardLabel}>Manual hours mapped / Mo</div>
              </div>
            </div>

            <div className={styles.meterContainer}>
              <div className={styles.inputHeader} style={{ marginBottom: '8px' }}>
                <div className={styles.metricCardLabel}>Audit priority</div>
                <div className={styles.metricCardLabel} style={{ color: monthly_loss > 10000 ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                  {displayPriority}%
                </div>
              </div>
              <div className={styles.meterTrack}>
                <div 
                  className={styles.meterBar} 
                  style={{ width: `${recoveryProgress}%` }}
                />
              </div>
            </div>

            <div className={styles.outputPanel}>
              <div className={styles.outputHeader}>
                <span>Example audit output</span>
                <strong>Preview</strong>
              </div>
              <div className={styles.outputGrid}>
                <div>
                  <span>Likely first module</span>
                  <strong>{monthly_loss > 12000 ? "OpsOS + ReportOS" : monthly_loss > 6000 ? "SalesOS" : "LeadOS"}</strong>
                </div>
                <div>
                  <span>Operating score</span>
                  <strong>{Math.max(24, 100 - displayPriority)} / 100</strong>
                </div>
              </div>
              <div className={styles.signalList}>
                {DIAGNOSTIC_SIGNALS.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>

            <button
              className={styles.cta}
              data-cursor="pointer"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Request Free Audit →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
