"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Handshake, LineChart, ShieldCheck } from "lucide-react";
import styles from "./AboutSection.module.css";

const VALUES = [
  {
    icon: <ShieldCheck size={20} />,
    title: "Maintain",
    description: "Keep deployed systems stable as tools, teams, fields, and workflows change.",
  },
  {
    icon: <LineChart size={20} />,
    title: "Scale",
    description: "Improve existing systems, add new automations, and expand coverage across departments.",
  },
  {
    icon: <Handshake size={20} />,
    title: "Operator",
    description: "FlowOps acts as the AI operations partner that reviews, recommends, and executes monthly.",
  },
];

const STATS = [
  { value: 1, suffix: "", label: "Monthly health review" },
  { value: 3, suffix: "", label: "Subscription modes" },
  { value: 5, suffix: "", label: "Roadmap checkpoints" },
  { value: 0, suffix: "", label: "Backend required today" },
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
    <div className={styles.statCard}>
      <div className={styles.bgGrid} />
      <div className={styles.statValue}>
        {val}
        <span className={styles.statSuffix}>{stat.suffix}</span>
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
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
        `.${styles.heading}`,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.heading}`, start: "top 85%", once: true },
        }
      );
      
      gsap.fromTo(
        `.${styles.valueCard}`,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.valuesList}`, start: "top 85%", once: true },
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
    <section id="subscriptions" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Story */}
          <div>
            <div className={styles.heading}>
              <span className={styles.eyebrow}>AI Operations Subscriptions</span>
              <h2 className={styles.title}>
                Deployment is the beginning. Operations need a recurring owner.
              </h2>
              <p className={styles.text}>
                AI systems are only useful when they stay aligned with the business. Lead sources change,
                CRM fields drift, teams adjust handoffs, and reporting expectations move.
              </p>
              <p className={styles.text}>
                FlowOps productizes the ongoing work into monthly operating modes: maintain the systems,
                scale the roadmap, or let FlowOps operate as your AI operations partner.
              </p>
            </div>

            <div className={styles.valuesList}>
              {VALUES.map((v, i) => (
                <div key={i} className={styles.valueCard} data-cursor="glow">
                  <div className={styles.iconWrap}>{v.icon}</div>
                  <div>
                    <h4 className={styles.valueTitle}>{v.title}</h4>
                    <p className={styles.valueDesc}>{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <div ref={statsRef} className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <StatCard key={i} stat={stat} counting={counting} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
