"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: "🔧",
    title: "Systems over band-aids",
    description: "We don't patch problems. We redesign the workflow so the problem can't happen again.",
  },
  {
    icon: "📏",
    title: "Measurable or it doesn't count",
    description: "Every project starts with baseline metrics and ends with proof that something changed.",
  },
  {
    icon: "🤝",
    title: "We stay until it works",
    description: "30-day support isn't a policy. It's our standard. We're done when it works.",
  },
];

const STATS = [
  { value: 40, suffix: "+", label: "Systems deployed", unit: "" },
  { value: 12, suffix: "", label: "Industries served", unit: "" },
  { value: 10, suffix: " days", label: "Average deployment", unit: "" },
  { value: 30, suffix: " days", label: "Post-launch support", unit: "" },
];

function useCountUp(target: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

function StatCard({ stat, counting }: { stat: typeof STATS[0]; counting: boolean }) {
  const val = useCountUp(stat.value, 1500, counting);
  return (
    <div
      style={{
        background: "#0f1017",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          fontWeight: 800,
          color: "#f0f2ff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {val}
        <span style={{ color: "#f59e0b" }}>{stat.suffix}</span>
      </div>
      <div style={{ color: "var(--color-text-faint)", fontSize: "12px", marginTop: "8px" }}>
        {stat.label}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-heading", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".about-value",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".about-value", start: "top 82%", once: true },
        }
      );
    }, sectionRef);

    if (statsRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setCounting(true); },
        { threshold: 0.3 }
      );
      obs.observe(statsRef.current);
      return () => {
        obs.disconnect();
        ctx.revert();
      };
    }
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{ background: "#0a0a0f", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
          className="about-grid"
        >
          {/* Left: Story */}
          <div>
            <div className="about-heading">
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
                About FlowOps
              </span>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  fontWeight: 800,
                  color: "#f0f2ff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  marginBottom: "20px",
                }}
              >
                We got tired of watching great businesses run on broken processes.
              </h2>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, fontSize: "15px", marginBottom: "16px" }}>
                FlowOps was built because we kept seeing the same problem: smart, well-funded businesses with talented teams — held back not by ambition, but by the manual work nobody had time to fix.
              </p>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, fontSize: "15px", marginBottom: "36px" }}>
                We&apos;re a small, specialized team of automation architects, AI engineers, and systems thinkers. We don&apos;t take on every client. We take on the clients where we know we can make a measurable difference — and we stay until the system is actually running.
              </p>
            </div>

            {/* Value cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {VALUES.map((v, i) => (
                <div
                  key={i}
                  className="about-value"
                  style={{
                    background: "#0f1017",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    opacity: 0,
                  }}
                >
                  <span style={{ fontSize: "22px", color: "#3b82f6", minWidth: "28px" }}>{v.icon}</span>
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f0f2ff", marginBottom: "6px" }}>
                      {v.title}
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.6, margin: 0 }}>
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <div ref={statsRef}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {STATS.map((stat, i) => (
                <StatCard key={i} stat={stat} counting={counting} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
