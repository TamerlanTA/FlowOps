"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEFORE_ITEMS = [
  "Leads logged manually into CRM (when someone remembers)",
  "Reports assembled from 4 different spreadsheets on Fridays",
  "Handoffs happen over Slack and are frequently dropped",
  "Customer updates sent manually, inconsistently, or not at all",
  "Operations depend on one person who “knows how it works”",
  "No visibility into what's happening until it's already a problem",
];

const AFTER_ITEMS = [
  "Every lead captured, qualified, and routed automatically — in seconds",
  "Reports generated and sent on schedule without anyone touching them",
  "Handoffs are structured workflows with confirmations and escalations",
  "Customers receive status updates at every stage, automatically",
  "The system runs the process — your team executes the decisions",
  "Live dashboards show what's happening in real time, always",
];

const METRICS = [
  { value: 68, suffix: "%", label: "Reduction in manual tasks", prefix: "-" },
  { value: 3, suffix: "×", label: "Output per team member", prefix: "+" },
  { value: 10, suffix: " days", label: "Average deployment", prefix: "" },
  { value: 30, suffix: " days", label: "Post-launch support", prefix: "" },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function MetricCard({ metric, counting }: { metric: typeof METRICS[0]; counting: boolean }) {
  const val = useCountUp(metric.value, 1500, counting);
  return (
    <div style={{ textAlign: "center", padding: "24px 16px" }}>
      <div
        style={{
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 800,
          color: "#f0f2ff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {metric.prefix}
        {val}
        {metric.suffix}
      </div>
      <div style={{ color: "var(--color-text-faint)", fontSize: "12px", marginTop: "8px" }}>
        {metric.label}
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgLineRef = useRef<SVGLineElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ba-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ba-heading", start: "top 82%", once: true },
        }
      );

      gsap.fromTo(
        ".ba-col",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".ba-col", start: "top 82%", once: true },
        }
      );

      // SVG line draw on scroll
      if (svgLineRef.current) {
        const len = svgLineRef.current.getTotalLength?.() ?? 300;
        gsap.set(svgLineRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(svgLineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: svgLineRef.current, start: "top 82%", once: true },
        });
      }
    }, sectionRef);

    // Metric counting trigger
    if (metricRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCounting(true); },
        { threshold: 0.3 }
      );
      obs.observe(metricRef.current);
      return () => {
        obs.disconnect();
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#000000", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="ba-heading" style={{ textAlign: "center", marginBottom: "64px" }}>
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
            Before vs After FlowOps
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
            Same team. Same tools. A completely different operating reality.
          </h2>
        </div>

        {/* Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 40px 1fr",
            gap: "0",
            alignItems: "start",
          }}
          className="ba-grid"
        >
          {/* BEFORE */}
          <div
            className="ba-col"
            style={{
              background: "#0f1017",
              borderRadius: "16px",
              overflow: "hidden",
              opacity: 0,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(239,68,68,0.05)",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-muted)" }}>
                Without FlowOps
              </span>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {BEFORE_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "rgba(239,68,68,0.7)", fontWeight: 700, minWidth: "16px", marginTop: "2px" }}>
                    ✗
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Divider */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: "300px",
              position: "relative",
            }}
          >
            <svg width="40" height="100%" viewBox="0 0 40 400" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
              <line
                ref={svgLineRef}
                x1="20"
                y1="0"
                x2="20"
                y2="400"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
            </svg>
            <div
              style={{
                zIndex: 1,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#0f1017",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "var(--color-text-faint)",
              }}
            >
              →
            </div>
          </div>

          {/* AFTER */}
          <div
            className="ba-col"
            style={{
              background: "#0f1017",
              borderRadius: "16px",
              overflow: "hidden",
              opacity: 0,
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(59,130,246,0.05)",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-primary)" }}>
                With FlowOps
              </span>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {AFTER_ITEMS.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: "#3b82f6", fontWeight: 700, minWidth: "16px", marginTop: "2px" }}>
                    ✓
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Bar */}
        <div
          ref={metricRef}
          style={{
            marginTop: "48px",
            background: "#0f1017",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            overflow: "hidden",
          }}
          className="ba-metrics"
        >
          {METRICS.map((m, i) => (
            <div
              key={i}
              style={{
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}
            >
              <MetricCard metric={m} counting={counting} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ba-grid { grid-template-columns: 1fr !important; }
          .ba-metrics { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
