"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./MethodSection.module.css";

const STEPS = [
  {
    n: 1,
    title: "Audit",
    days: "Map the current state",
    description:
      "We map workflows, tools, handoffs, exceptions, and reporting gaps so the opportunity is clear before a system is proposed.",
    chips: ["Workflow map", "Bottleneck analysis", "Automation priority stack"],
    visual: "audit"
  },
  {
    n: 2,
    title: "Design",
    days: "Architect the operating layer",
    description:
      "We design the AI operations layer: triggers, data movement, decision rules, human review points, alerts, and escalation logic.",
    chips: ["System blueprint", "Integration map", "Approval gates"],
    visual: "map"
  },
  {
    n: 3,
    title: "Deploy",
    days: "Launch packaged systems",
    description:
      "We configure and deploy packaged systems such as LeadOS, SalesOS, VoiceOS, InboxOS, OpsOS, and ReportOS around your real workflows.",
    chips: ["Live workflows", "Data validation", "Operational runbook"],
    visual: "build"
  },
  {
    n: 4,
    title: "Maintain",
    days: "Keep systems stable",
    description:
      "We monitor the systems, handle changes in tools and workflows, document adjustments, and keep the operating layer reliable.",
    chips: ["Health checks", "Issue handling", "Change management"],
    visual: "deploy"
  },
  {
    n: 5,
    title: "Improve",
    days: "Expand monthly",
    description:
      "We review performance, identify new opportunities, and expand automation coverage as the company grows and the operation changes.",
    chips: ["Monthly recommendations", "System expansion", "Performance review"],
    visual: "optimize"
  },
];

function StepVisual({ type }: { type: string }) {
  switch (type) {
    case "audit":
      return (
        <div className={styles.panelContent}>
          <div className={styles.scanner} />
          <div style={{ opacity: 0.2, fontSize: '10px', fontFamily: 'var(--font-mono)' }}>DIAGNOSTIC_SCAN_IN_PROGRESS</div>
        </div>
      );
    case "map":
      return (
        <div className={styles.panelContent}>
          <div className={styles.blueprint}>
            <div className={styles.node} style={{ top: '20%', left: '20%' }} />
            <div className={styles.node} style={{ top: '50%', left: '50%' }} />
            <div className={styles.node} style={{ top: '80%', left: '80%' }} />
          </div>
        </div>
      );
    case "build":
      return (
        <div className={styles.panelContent}>
          <svg width="120" height="120" viewBox="0 0 100 100">
            <motion.rect 
              x="20" y="20" width="60" height="60" 
              stroke="var(--color-primary)" strokeWidth="1" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path 
              d="M10 50 L90 50 M50 10 L50 90" 
              stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"
            />
          </svg>
        </div>
      );
    case "deploy":
      return (
        <div className={styles.panelContent}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                style={{ width: 12, height: 40, background: 'var(--color-primary)', borderRadius: 2 }}
                animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      );
    case "optimize":
      return (
        <div className={styles.panelContent}>
          <motion.div 
            style={{ width: 80, height: 80, border: '2px solid var(--color-primary)', borderRadius: '50%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div style={{ width: 10, height: 10, background: 'var(--color-primary)', borderRadius: '50%', margin: '-5px auto' }} />
          </motion.div>
        </div>
      );
    default:
      return null;
  }
}

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical progress line
      gsap.to(".active-path", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: `.${styles.timeline}`,
          start: "top 20%",
          end: "bottom 80%",
          scrub: true,
        },
      });

      // Data packets traveling
      STEPS.forEach((_, i) => {
        gsap.to(`.packet-${i}`, {
          top: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: `#method-step-${i}`,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        });
      });

      // Heading animation
      gsap.fromTo(
        `.${styles.heading}`,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.heading}`, start: "top 85%", once: true },
        }
      );
    }, sectionRef);

    // Active step tracking
    const observers: IntersectionObserver[] = [];
    STEPS.forEach((_, i) => {
      const el = document.getElementById(`method-step-${i}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.6 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      ctx.revert();
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return (
    <section id="os" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Side */}
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Deployment Architecture</span>
            <h2 className={styles.title}>
              FlowOps OS is the operating layer between your tools and your team.
            </h2>
            <p className={styles.description}>
              It is not another app for the team to remember. It is the system that audits
              manual work, designs the automation layer, deploys packaged workflows, and keeps
              them improving over time.
            </p>
            
            <div className={styles.visualPanel}>
              <div className={styles.panelGrid} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%' }}
                >
                  <StepVisual type={STEPS[activeStep].visual} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Timeline */}
          <div className={styles.timeline}>
            <div className={styles.connectorPath}>
              <div className={`${styles.activePath} active-path`} />
            </div>

            {STEPS.map((step, i) => (
              <div
                key={i}
                id={`method-step-${i}`}
                className={styles.step}
                style={{ opacity: activeStep === i ? 1 : 0.3 }}
                data-cursor="glow"
              >
                {/* Packet */}
                {activeStep === i && (
                  <div className={`${styles.packet} packet-${i}`} />
                )}

                {/* Number */}
                <div className={styles.numberWrap}>
                  <div className={`${styles.number} ${activeStep === i ? styles.activeNumber : ""}`}>
                    {step.n}
                  </div>
                </div>

                {/* Content */}
                <div className={`${styles.stepContent} ${activeStep === i ? styles.activeStepContent : ""}`}>
                  <div className={styles.stepHeader}>
                    <h3 className={`${styles.stepTitle} ${activeStep === i ? styles.activeStepTitle : ""}`}>
                      {step.title}
                    </h3>
                    <span className={styles.stepDays}>{step.days}</span>
                  </div>
                  <p className={styles.stepDescription}>{step.description}</p>
                  <div className={styles.chips}>
                    {step.chips.map((chip) => (
                      <span key={chip} className={styles.chip}>{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
