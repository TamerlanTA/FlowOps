"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/Reveal";

const stats = [
  { value: 70, suffix: "%", label: "Workload Reduction" },
  { value: 14, suffix: "", label: "Days to Launch" },
  { value: 50, suffix: "+", label: "Automations Built" },
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
    if (!inView) {
      return;
    }

    const start = performance.now();
    const duration = 2000;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf.current);
  }, [inView, value]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 md:px-6">
      <div className="text-2xl font-bold text-blue-300 md:text-3xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-xs font-medium text-slate-400">{label}</div>
    </div>
  );
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <Reveal variant="scale" delay={600}>
        <div className="mt-12 rounded-2xl p-1 liquid-glass-elevated prismatic-edge sm:mt-16 sm:rounded-3xl md:mt-20">
          <div className="grid grid-cols-2 gap-px rounded-[calc(1rem-4px)] sm:rounded-[calc(1.5rem-4px)] md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`
                  ${index < 2 ? "border-b border-white/10 md:border-b-0" : ""}
                  ${index % 2 === 0 ? "border-r border-white/10 md:border-r-0" : ""}
                  ${index < 3 ? "md:border-r md:border-white/10" : ""}
                `}
              >
                <AnimatedStat {...stat} inView={inView} />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-12 pt-28 sm:px-6 sm:pb-0 sm:pt-20">
      <div className="relative mx-auto w-full max-w-5xl text-center">
        <Reveal variant="scale" delay={200}>
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-medium text-slate-300 liquid-glass-subtle">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/60" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-400" />
            </span>
            AI-Powered Business Automation
          </div>
        </Reveal>

        <Reveal delay={350}>
          <h1 className="text-balance text-[2.25rem] font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Automate your business.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #4478ff, #5ca8e6, #6b5cf5)",
              }}
            >
              Eliminate manual chaos.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={480}>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300 sm:mt-6 md:text-xl">
            AI automation consulting for business process automation, workflow
            automation, and CRM automation that reduce operational workload up to
            70% in 14 days.
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/#contact"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-8 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-blue-400 active:scale-[0.98] sm:w-auto"
            >
              Request Audit
              <svg
                className="ml-2"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7H12M12 7L8 3M12 7L8 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/#cases"
              className="inline-flex w-full items-center justify-center rounded-2xl px-8 py-3 text-sm font-medium text-white liquid-btn transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
            >
              View Cases
              <svg
                className="ml-2"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 3L10 7L4 11V3Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </Reveal>

        <Reveal variant="up" delay={680}>
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl p-2 liquid-glass-elevated prismatic-edge sm:mt-12 sm:rounded-3xl">
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src="/images/hero-automation-dashboard.svg"
                alt="Dashboard preview of AI workflow systems, CRM automation pipelines, and operational optimization metrics"
                width={1280}
                height={820}
                priority
                sizes="(max-width: 768px) 100vw, 1100px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </Reveal>

        <StatsBar />
      </div>
    </section>
  );
}
