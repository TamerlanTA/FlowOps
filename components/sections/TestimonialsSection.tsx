"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./TestimonialsSection.module.css";

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

function TestimonialCard({ t, signalIndex }: { t: typeof TESTIMONIALS[0], signalIndex: number }) {
  const signalId = `SIG-${(signalIndex + 1).toString().padStart(3, '0')}`;
  
  return (
    <div className={styles.card} data-cursor="glow">
      <div className={styles.cardHeader}>
        <div className={styles.signalBadge}>SIGNAL: {signalId}</div>
        <div className={styles.impactBadge}>DELIVERY VERIFIED</div>
      </div>

      <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>

      <div className={styles.authorBox}>
        <div className={styles.authorInfo}>
          <span className={styles.name}>{t.author}</span>
          <span className={styles.company}>{t.company}</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--color-text-faint)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {t.tag.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
  const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4)];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.header}`,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.header}`, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Client Signal Feed</span>
          <h2 className={styles.title}>Validation from the deployment front.</h2>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        {/* Row 1 */}
        <div className={`${styles.marqueeRow} ${styles.scrollLeft}`}>
          {row1.map((t, i) => (
            <TestimonialCard key={i} t={t} signalIndex={i % TESTIMONIALS.length} />
          ))}
        </div>

        {/* Row 2 */}
        <div className={`${styles.marqueeRow} ${styles.scrollRight}`}>
          {row2.map((t, i) => (
            <TestimonialCard key={i} t={t} signalIndex={(i + 4) % TESTIMONIALS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
