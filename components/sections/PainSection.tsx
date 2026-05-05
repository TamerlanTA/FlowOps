"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PAIN_ITEMS = [
  "Leads come in through WhatsApp, forms, email, and calls — and someone manually sorts and enters them into your CRM.",
  "Your weekly sales report takes 3 hours to build in a spreadsheet. Every. Single. Week.",
  "When a key person is out, the whole handoff breaks down. Tribal knowledge runs your operations.",
  "Your team talks about AI constantly. But nothing has actually been connected to daily execution yet.",
  "Customers follow up asking for status updates because nobody sent them one automatically.",
  "New orders, deals, or requests sit unassigned until someone notices them — sometimes too late.",
  "You've bought tools to fix the problem, but now you have more tools and more complexity.",
  "Your data lives in 6 different places and you can't get a clear picture of what's actually happening.",
];

const MONTHLY_LOSS_PER_ITEM = 2400;

export default function PainSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pain-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pain-heading", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".pain-card",
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".pain-card", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      const size = next.size;
      setCtaVisible(size >= 3);
      return next;
    });
  };

  const count = checked.size;
  const monthlyLoss = count * MONTHLY_LOSS_PER_ITEM;

  return (
    <section
      id="systems"
      ref={sectionRef}
      style={{ background: "#0a0a0f", padding: "120px 0" }}
    >
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px" }}>
        {/* Two-column header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
            marginBottom: "64px",
          }}
          className="pain-two-col"
        >
          <div className="pain-heading">
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
              The Problem
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
              Your team is smart. Your tools are expensive. And yet nothing works together.
            </h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.7, fontSize: "16px" }}>
              These aren&apos;t process problems. They&apos;re system problems. And they compound every week.
            </p>
          </div>

          {/* Live counter */}
          <div
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "32px",
              alignSelf: "start",
            }}
          >
            <p style={{ color: "var(--color-text-faint)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Problems recognized
            </p>
            <div style={{ fontSize: "48px", fontWeight: 800, color: "#f0f2ff", lineHeight: 1, marginBottom: "8px" }}>
              {count} <span style={{ fontSize: "20px", color: "var(--color-text-faint)", fontWeight: 500 }}>of 8</span>
            </div>
            {count > 0 && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ color: "var(--color-text-faint)", fontSize: "12px", marginBottom: "4px" }}>Est. monthly loss</p>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#f59e0b" }}>
                  ${monthlyLoss.toLocaleString()}
                </div>
              </div>
            )}
            {ctaVisible && (
              <button
                onClick={() => {
                  const el = document.getElementById("roi");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "12px 20px",
                  background: "#f59e0b",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "none",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.background = "#fbbf24")}
                onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.background = "#f59e0b")}
              >
                That&apos;s ${monthlyLoss.toLocaleString()}/month. Let&apos;s fix it →
              </button>
            )}
          </div>
        </div>

        {/* Pain cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {PAIN_ITEMS.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <button
                key={i}
                className="pain-card"
                onClick={() => toggle(i)}
                style={{
                  background: "var(--color-bg-card)",
                  border: isChecked ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  borderLeft: isChecked ? "3px solid #3b82f6" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "left",
                  cursor: "none",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  transition: "border 0.25s, box-shadow 0.25s",
                  boxShadow: isChecked ? "var(--shadow-blue)" : "none",
                  opacity: 0,
                }}
              >
                {/* Checkbox */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    minWidth: "20px",
                    borderRadius: "6px",
                    border: isChecked ? "2px solid #3b82f6" : "2px solid rgba(255,255,255,0.15)",
                    background: isChecked ? "#3b82f6" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2px",
                    transition: "all 0.2s",
                  }}
                >
                  {isChecked && (
                    <span
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: 1,
                        transform: "scale(1)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: isChecked ? "var(--color-text)" : "var(--color-text-muted)",
                    lineHeight: 1.6,
                    transition: "color 0.2s",
                  }}
                >
                  <span style={{ color: "var(--color-text-faint)", marginRight: "6px", fontWeight: 600 }}>
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {item}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom counter bar */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px 28px",
            background: "rgba(15,16,23,0.8)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px", margin: 0 }}>
            You&apos;ve recognized{" "}
            <span style={{ color: "#f0f2ff", fontWeight: 700 }}>{count}</span>{" "}
            of 8 problems — that&apos;s roughly{" "}
            <span style={{ color: "#f59e0b", fontWeight: 700 }}>
              ${monthlyLoss.toLocaleString()}
            </span>{" "}
            in lost productivity per month.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("roi");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "var(--color-text-muted)",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "none",
              fontWeight: 500,
              transition: "border-color 0.2s, color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.borderColor = "#3b82f6";
              btn.style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              const btn = e.target as HTMLButtonElement;
              btn.style.borderColor = "rgba(255,255,255,0.14)";
              btn.style.color = "var(--color-text-muted)";
            }}
          >
            Calculate your loss →
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pain-two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
