"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "How much does it cost?",
    a: "Projects start at $3,000 for a focused single-system automation and scale based on complexity, integrations, and team size. We quote every project after the discovery call — not before, because cookie-cutter pricing leads to cookie-cutter systems. The audit call is always free.",
  },
  {
    q: "How long does it take to go live?",
    a: "Most systems are deployed and live within 5–10 business days of the kickoff. Complex multi-system builds with custom integrations can take 2–3 weeks. We've never missed a committed deployment date.",
  },
  {
    q: "What tools do we need to have in place?",
    a: "None, specifically. We work with the tools you already use — CRM, messaging platforms, e-commerce systems, spreadsheets, ERPs. If you don't have the right tools yet, we'll tell you what to get and why.",
  },
  {
    q: "Do we need a technical team or developer on our side?",
    a: "No. We handle the full build and deployment. Your team needs zero technical knowledge to use or maintain the system after handoff. We build for operations teams, not developers.",
  },
  {
    q: "What if the automation breaks or something goes wrong?",
    a: "Every project includes 30 days of post-launch support. We monitor, fix, and adjust at no additional charge. After the 30 days, we offer ongoing maintenance retainers for teams who want continued support.",
  },
  {
    q: "Which industries do you work with?",
    a: "E-commerce, B2B SaaS, professional services, logistics, real estate, healthcare ops, fintech, and retail. If your business has repetitive processes and more than 5 people, we can almost certainly help.",
  },
  {
    q: "How is FlowOps different from hiring a developer or using a no-code platform?",
    a: "A developer builds what you spec. A no-code platform gives you tools. FlowOps gives you a finished, running system — architected, built, tested, and documented. We're responsible for the outcome, not just the code.",
  },
  {
    q: "Can you automate something we already tried to automate and failed?",
    a: "Yes — this is actually one of our most common starting points. Failed automations usually fail because of poor architecture, not bad tooling. We audit what was built, identify why it broke, and redesign from the right foundation.",
  },
  {
    q: "Do you offer ongoing work after the initial build?",
    a: "Yes. Many clients start with one system and come back for the next. We offer project-based builds and monthly retainers for teams who want continuous automation development.",
  },
  {
    q: "How do we get started?",
    a: "Fill out the audit request form below. Describe your process, your tools, and where you're losing time. We review every request personally and respond within one business day with a call slot.",
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-heading", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".faq-item", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#0a0a0f", padding: "120px 0" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="faq-heading" style={{ textAlign: "center", marginBottom: "56px" }}>
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
            Frequently Asked
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "#f0f2ff",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: "16px",
            }}
          >
            Everything you want to know before we talk.
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "16px", lineHeight: 1.7 }}>
            No sales pitch. Just honest answers.
          </p>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="faq-item"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                opacity: 0,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "none",
                  padding: "20px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: open === i ? "#3b82f6" : "var(--color-text)",
                    lineHeight: 1.4,
                    transition: "color 0.2s",
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: "var(--color-text-faint)",
                    fontSize: "18px",
                    display: "inline-block",
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  ⌄
                </span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        color: "var(--color-text-muted)",
                        lineHeight: 1.75,
                        paddingBottom: "20px",
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
