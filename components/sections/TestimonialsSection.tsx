"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote: "I was skeptical that automation could actually replace what our team was doing manually. Three weeks in, we had saved 40 hours a week across the sales team. I wish we'd done this two years ago.",
    author: "CEO",
    company: "Logistics company",
    tag: "Sales Automation",
  },
  {
    quote: "FlowOps didn't just build us a bot. They redesigned how our leads move through the business. The bot is one piece — the system around it is what changed everything.",
    author: "Head of Growth",
    company: "E-commerce brand",
    tag: "Sales + AI System",
  },
  {
    quote: "Our operations team was skeptical. They thought automation would be rigid and break constantly. Six months in — it's handled over 15,000 orders without a single failure.",
    author: "COO",
    company: "Fulfillment company",
    tag: "Operations",
  },
  {
    quote: "The ROI was clear within 30 days. We eliminated two full-time manual coordination roles and reinvested that capacity into growth. The system paid for itself in the first month.",
    author: "Founder",
    company: "B2B services company",
    tag: "Full Stack",
  },
  {
    quote: "What impressed me most wasn't the technology. It was that they understood our business before they touched any tools. The architecture was exactly right because the audit was thorough.",
    author: "VP Operations",
    company: "SaaS company",
    tag: "Ops + AI",
  },
  {
    quote: "We went from chasing leads to receiving them already qualified. The system knows more about a lead by the time our manager opens the deal than we used to learn in the first call.",
    author: "Head of Sales",
    company: "Fashion e-commerce brand",
    tag: "Sales Automation",
  },
  {
    quote: "It used to take 15 minutes to process each order correctly. Now it takes 90 seconds and nobody touches it. We scaled from 80 to 300 orders a day without hiring anyone new.",
    author: "Operations Director",
    company: "Home goods brand",
    tag: "Operations",
  },
  {
    quote: "Our reps used to dread prospecting. Now they spend their mornings reviewing AI-drafted emails and approving the best ones. The quality is better than what they wrote themselves.",
    author: "VP Sales",
    company: "B2B SaaS company",
    tag: "AI + Sales",
  },
];

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div
      style={{
        background: "#0f1017",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px 24px",
        minWidth: "320px",
        maxWidth: "360px",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Company badge */}
      <span
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          fontSize: "10px",
          fontWeight: 600,
          color: "#60a5fa",
          background: "rgba(59,130,246,0.1)",
          padding: "3px 8px",
          borderRadius: "100px",
        }}
      >
        {t.tag}
      </span>

      {/* Stars */}
      <div style={{ marginBottom: "12px", marginTop: "4px" }}>
        {"★★★★★".split("").map((s, i) => (
          <span key={i} style={{ color: "#f59e0b", fontSize: "14px" }}>
            {s}
          </span>
        ))}
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)",
          lineHeight: 1.7,
          fontStyle: "italic",
          marginBottom: "16px",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#f0f2ff" }}>
          {t.author}
        </span>
        <span style={{ color: "var(--color-text-faint)", fontSize: "12px", marginLeft: "6px" }}>
          · {t.company}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4)];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonials-heading",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-heading", start: "top 82%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "#000000", padding: "120px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "0 24px", marginBottom: "56px" }}>
        <div className="testimonials-heading" style={{ textAlign: "center" }}>
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
            What Clients Say
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
            Real words. Real results.
          </h2>
        </div>
      </div>

      {/* Row 1: moves left */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          animation: "scrollLeft 30s linear infinite",
          width: "max-content",
          marginBottom: "16px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {row1.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>

      {/* Row 2: moves right */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          animation: "scrollRight 38s linear infinite",
          width: "max-content",
          paddingLeft: "180px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {row2.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>

      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes scrollLeft { 0%, 100% { transform: none; } }
          @keyframes scrollRight { 0%, 100% { transform: none; } }
        }
      `}</style>
    </section>
  );
}
