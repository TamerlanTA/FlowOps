"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/Reveal";

const stats = [
  { value: 70, suffix: "%", label: "Workload Reduction" },
  { value: 14, suffix: " days", label: "Time to Launch" },
  { value: 120, suffix: "+", label: "Automations Built" },
  { value: 24, suffix: "/7", label: "System Uptime" },
] as const;

function AnimatedStat({
  value,
  suffix,
  label,
  inView,
}: {
  value: number;
  suffix: string;
  label: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1600;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, value]);

  return (
    <div className="stat-card flex-1 min-w-[130px] max-w-[180px] px-5 py-5">
      <div
        className="text-2xl font-bold tracking-tight text-white"
        style={{ fontFamily: "var(--font-dm-mono), monospace" }}
      >
        {count}{suffix}
      </div>
      <div className="mt-1 text-[11px] font-medium text-[#525270]">{label}</div>
    </div>
  );
}

function StatsRow() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.unobserve(element); }
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-wrap gap-3 justify-center">
      {stats.map((stat) => (
        <AnimatedStat key={stat.label} {...stat} inView={inView} />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 pb-20 pt-24 text-center sm:px-6"
    >
      <div className="relative mx-auto w-full max-w-5xl">
        <Reveal variant="scale" delay={0}>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(0,212,192,0.22)] bg-[rgba(0,212,192,0.08)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#00d4c0]">
            <span className="bdot size-[6px] rounded-full bg-[#00d4c0]" />
            AI-POWERED BUSINESS AUTOMATION
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-balance text-[clamp(3rem,7.5vw,6.2rem)] font-black leading-[1.03] tracking-[-0.04em] text-white">
            Automate your business.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #00d4c0 20%, #8b5cf6)" }}
            >
              Eliminate manual chaos.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-[540px] text-[clamp(1rem,1.6vw,1.18rem)] leading-[1.75] text-[#525270]">
            AI automation consulting that reduces operational workload up to 70% in 14 days. Real systems, real results — no fluff.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="btn-primary inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold text-white"
            >
              Request Free Audit →
            </Link>
            <Link
              href="/#cases"
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-8 py-3.5 text-sm font-semibold text-[rgba(232,234,242,0.8)] transition-all duration-200 hover:border-[rgba(0,212,192,0.35)] hover:bg-[rgba(0,212,192,0.05)] hover:text-white"
            >
              View Case Studies
            </Link>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-16">
            <StatsRow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
