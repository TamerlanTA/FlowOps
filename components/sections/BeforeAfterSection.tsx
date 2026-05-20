"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Check, X } from "lucide-react";

import styles from "./BeforeAfterSection.module.css";

const BEFORE_ITEMS = [
  "Manual follow-up",
  "Spreadsheet reports",
  "Lost handoffs",
  "Tool chaos",
  "Tribal knowledge",
  "No visibility",
];

const AFTER_ITEMS = [
  "AI routing",
  "CRM sync",
  "Auto follow-up",
  "Live dashboard",
  "Structured workflows",
  "Data-driven scale",
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

function MetricCard({ metric, counting, index }: { metric: typeof METRICS[0]; counting: boolean; index: number }) {
  const val = useCountUp(metric.value, 1500, counting);
  // Consistent signal logic: Amber for reduction/loss (-), Blue for growth/system (+)
  const color = metric.prefix === "-" ? "var(--color-accent)" : index === 1 ? "var(--color-primary)" : "#f0f2ff";
  
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricValue} style={{ color }}>
        {metric.prefix}{val}{metric.suffix}
      </div>
      <div className={styles.metricLabel}>{metric.label}</div>
    </div>
  );
}

export default function BeforeAfterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGPolylineElement[]>([]);
  const [counting, setCounting] = useState(false);
  const [activeFlow, setActiveFlow] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        `.${styles.heading}`,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.heading}`, start: "top 85%", once: true },
        }
      );

      // Chaos Cards Scattering
      const chaosCards = gsap.utils.toArray<HTMLElement>(`.${styles.chaosCard}`);
      chaosCards.forEach((card, i) => {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 300;
        const rotate = (Math.random() - 0.5) * 30;
        
        gsap.set(card, { x, y, rotate, opacity: 0 });
        
        gsap.to(card, {
          opacity: 1,
          duration: 0.8,
          delay: i * 0.1,
          scrollTrigger: { trigger: chaosRef.current, start: "top 70%", once: true }
        });
      });

      // Flow Animation
      ScrollTrigger.create({
        trigger: `.${styles.scene}`,
        start: "top 50%",
        onEnter: () => {
          setActiveFlow(true);
          
          // Draw lines
          linesRef.current.forEach((line) => {
            if (!line) return;
            const len = line.getTotalLength?.() ?? 200;
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(line, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: "power2.inOut"
            });
          });
        }
      });

    }, sectionRef);

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
    <section ref={sectionRef} className={styles.section} id="before-after">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Before vs After</span>
          <h2 className={styles.title}>
            Same team. Same tools. A completely different operating reality.
          </h2>
        </div>

        <div className={styles.scene}>
          {/* Chaos Side */}
          <div ref={chaosRef} className={styles.chaosColumn}>
            <div className={styles.warningGlow} />
            {BEFORE_ITEMS.map((item, i) => (
              <div key={i} className={styles.chaosCard}>
                <span><X size={14} /></span>
                {item}
              </div>
            ))}
          </div>

          {/* Bridge */}
          <div className={styles.bridge}>
            <svg width="120" height="500" style={{ position: "absolute", overflow: "visible" }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <polyline
                  key={i}
                  ref={(el) => { if (el) linesRef.current[i] = el; }}
                  points={`0,${150 + i * 40} 60,250 120,${150 + i * 40}`}
                  fill="none"
                  stroke={activeFlow ? "#3b82f6" : "rgba(239, 68, 68, 0.2)"}
                  strokeWidth="1.5"
                  className={styles.flowLine}
                />
              ))}
            </svg>
            <div className={styles.flowOpsLayer} data-cursor="pointer">
              F
            </div>
          </div>

          {/* Flow Side */}
          <div ref={flowRef} className={styles.flowColumn}>
            <div className={styles.systemGlow} />
            {AFTER_ITEMS.map((item, i) => (
              <div 
                key={i} 
                className={`${styles.flowCard} ${activeFlow ? styles.flowCardActive : ""}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span><Check size={16} /></span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Metric Bar */}
        <div ref={metricRef} className={styles.metricsBar}>
          {METRICS.map((m, i) => (
            <MetricCard key={i} metric={m} counting={counting} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
