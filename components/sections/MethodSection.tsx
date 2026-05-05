"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: 1,
    title: "Discovery & Audit",
    days: "Days 1–2",
    description:
      "We map your current workflows, tools, handoffs, and bottlenecks in a structured 90-minute session. You get a written audit of everything we found and a clear prioritization of what to automate first.",
    chips: ["Workflow map", "Bottleneck analysis", "Priority list"],
  },
  {
    n: 2,
    title: "System Architecture",
    days: "Days 2–3",
    description:
      "We design the full system: triggers, data flows, integrations, AI layers, error handling, and escalation logic. You review and approve the architecture before we write a single line of code.",
    chips: ["Architecture diagram", "Integration list", "Approval sign-off"],
  },
  {
    n: 3,
    title: "Build & Deploy",
    days: "Days 3–10",
    description:
      "We build, test, and deploy the automation in your actual environment — not a sandbox. Every node is tested with real data before we hand anything over.",
    chips: ["Live system", "Test documentation", "Edge case handling"],
  },
  {
    n: 4,
    title: "Training & Handoff",
    days: "Day 10",
    description:
      "We run a live walkthrough with your team, record it, and deliver written documentation. Your team knows how to monitor, adjust, and extend the system without depending on us.",
    chips: ["Team training", "Video recording", "Written runbook"],
  },
  {
    n: 5,
    title: "30-Day Support",
    days: "Days 10–40",
    description:
      "We stay on for 30 days post-launch. Any issues, adjustments, or unexpected edge cases — we handle them. You don't go live and hope for the best.",
    chips: ["Bug fixes", "Adjustments", "Performance monitoring"],
  },
];

export default function MethodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".method-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".method-heading", start: "top 82%", once: true },
        }
      );

      gsap.fromTo(
        ".method-step",
        { opacity: 0, x: 32 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".method-step", start: "top 82%", once: true },
        }
      );
    }, sectionRef);

    // Active step tracking on scroll
    const observers: IntersectionObserver[] = [];
    STEPS.forEach((_, i) => {
      const el = document.getElementById(`method-step-${i}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(i);
        },
        { threshold: 0.5 }
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
    <section id="method" ref={sectionRef} style={{ background: "#000000", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="method-grid"
        >
          {/* Left */}
          <div className="method-heading" style={{ position: "sticky", top: "100px" }}>
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
              How It Works
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
              From messy operation to deployed system in 5 steps.
            </h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, fontSize: "15px", marginBottom: "28px" }}>
              We&apos;ve done this 40+ times. Here&apos;s exactly what happens when you work with FlowOps.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "100px",
                fontSize: "12px",
                color: "#60a5fa",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: "16px" }}>⚡</span>
              5-step process
            </div>
          </div>

          {/* Right: Timeline */}
          <div style={{ position: "relative" }}>
            {/* SVG connector */}
            <svg
              style={{
                position: "absolute",
                left: "17px",
                top: "18px",
                height: "calc(100% - 36px)",
                width: "2px",
              }}
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />
            </svg>

            {STEPS.map((step, i) => (
              <div
                key={i}
                id={`method-step-${i}`}
                className="method-step"
                style={{
                  display: "flex",
                  gap: "24px",
                  marginBottom: i < STEPS.length - 1 ? "40px" : "0",
                  opacity: 0,
                  position: "relative",
                }}
              >
                {/* Number circle */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    minWidth: "36px",
                    borderRadius: "50%",
                    background: activeStep === i ? "#3b82f6" : "#0f1017",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: activeStep === i ? "white" : "var(--color-text-faint)",
                    boxShadow: activeStep === i ? "0 0 16px rgba(59,130,246,0.5)" : "none",
                    transition: "all 0.3s",
                    zIndex: 1,
                  }}
                >
                  {step.n}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        color: activeStep === i ? "#f0f2ff" : "var(--color-text-muted)",
                        transition: "color 0.3s",
                      }}
                    >
                      {step.title}
                    </h3>
                    <span style={{ fontSize: "12px", color: "var(--color-text-faint)" }}>
                      {step.days}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.7,
                      marginBottom: "14px",
                    }}
                  >
                    {step.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {step.chips.map((chip) => (
                      <span
                        key={chip}
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#60a5fa",
                          background: "rgba(59,130,246,0.1)",
                          padding: "4px 10px",
                          borderRadius: "100px",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .method-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .method-heading { position: static !important; }
        }
      `}</style>
    </section>
  );
}
