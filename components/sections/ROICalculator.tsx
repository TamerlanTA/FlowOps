"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function useAnimatedNumber(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    startRef.current = null;
    cancelAnimationFrame(rafRef.current);

    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

export default function ROICalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const [team, setTeam] = useState(5);
  const [hours, setHours] = useState(15);
  const [salary, setSalary] = useState(3000);

  const monthly_loss = Math.round(team * hours * 4 * (salary / 160) * 0.35);
  const annual_roi = monthly_loss > 0 ? Math.round((monthly_loss * 12 * 3) / 5000 * 10) / 10 : 0;
  const payback_weeks = monthly_loss > 0 ? Math.round(5000 / (monthly_loss / 4)) : 0;

  const displayLoss = useAnimatedNumber(monthly_loss);
  const displayROI = useAnimatedNumber(Math.round(annual_roi * 10));
  const displayWeeks = useAnimatedNumber(payback_weeks);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".roi-card",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".roi-card", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="roi" ref={sectionRef} style={{ background: "#0a0a0f", padding: "120px 0" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            Calculate Your Loss
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "#f0f2ff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
            }}
          >
            What is manual work actually costing you?
          </h2>
        </div>

        <div
          className="roi-card"
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "#0f1017",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "20px",
            boxShadow: "var(--shadow-blue)",
            overflow: "hidden",
            opacity: 0,
          }}
        >
          {/* Inputs */}
          <div style={{ padding: "32px" }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
              Fill in your numbers. We&apos;ll calculate the real cost — and what automation changes.
            </p>

            {[
              { label: "Team members doing manual work", value: team, set: setTeam, min: 1, max: 100, step: 1, suffix: "people" },
              { label: "Hours per week on manual tasks", value: hours, set: setHours, min: 1, max: 80, step: 1, suffix: "hrs/wk" },
              { label: "Average salary per person ($/month)", value: salary, set: setSalary, min: 500, max: 20000, step: 500, suffix: "$/mo" },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {field.label}
                  </label>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#f0f2ff",
                    }}
                  >
                    {field.value.toLocaleString()} {field.suffix}
                  </span>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={field.value}
                  onChange={(e) => field.set(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: "4px",
                    appearance: "none",
                    WebkitAppearance: "none",
                    background: `linear-gradient(to right, #3b82f6 ${((field.value - field.min) / (field.max - field.min)) * 100}%, rgba(255,255,255,0.1) ${((field.value - field.min) / (field.max - field.min)) * 100}%)`,
                    borderRadius: "2px",
                    outline: "none",
                    cursor: "none",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Results */}
          <div
            style={{
              background: "#000",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0",
                marginBottom: "24px",
              }}
            >
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.07)", padding: "0 16px 0 0" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-faint)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Monthly loss
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b", lineHeight: 1 }}>
                  ${displayLoss.toLocaleString()}
                </div>
              </div>
              <div style={{ borderRight: "1px solid rgba(255,255,255,0.07)", padding: "0 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-faint)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Year-1 ROI
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#3b82f6", lineHeight: 1 }}>
                  {(displayROI / 10).toFixed(1)}×
                </div>
              </div>
              <div style={{ padding: "0 0 0 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--color-text-faint)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Payback
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#f0f2ff", lineHeight: 1 }}>
                  {displayWeeks} <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-muted)" }}>wks</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "13px", color: "var(--color-text-faint)", marginBottom: "16px" }}>
              These numbers are conservative. Want the real estimate?
            </p>

            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                width: "100%",
                padding: "14px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "none",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.background = "#60a5fa";
                btn.style.boxShadow = "var(--shadow-blue)";
              }}
              onMouseLeave={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.background = "#3b82f6";
                btn.style.boxShadow = "none";
              }}
            >
              Get a precise estimate →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #fff;
          box-shadow: 0 0 6px rgba(59,130,246,0.5);
          cursor: none;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid #fff;
          cursor: none;
        }
      `}</style>
    </section>
  );
}
