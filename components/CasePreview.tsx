"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/Reveal";

const cases = [
  {
    company: "E-commerce Brand",
    industry: "Retail",
    problem:
      "Manual order processing, no lead follow-up system, and 40+ hours/week spent on repetitive reporting tasks.",
    solution:
      "Automated order pipeline with n8n, integrated CRM follow-up sequences via Make, and built real-time dashboards with Google Cloud.",
    image: "/images/case-ecommerce.svg",
    imageAlt:
      "Workflow automation dashboard showing CRM pipeline, automated lead routing, and reporting widgets",
    results: [
      { value: 68, suffix: "%", label: "Time Saved", decimals: 0 },
      { value: 3.2, suffix: "x", label: "Lead Conversion", decimals: 1 },
      { value: 12, suffix: " days", label: "Implementation", decimals: 0 },
    ],
  },
  {
    company: "SaaS Startup",
    industry: "Technology",
    problem:
      "Customer onboarding was entirely manual, support tickets were lost, and internal handoffs between teams created delays.",
    solution:
      "AI-powered onboarding flows, automated ticket routing with priority scoring, and seamless team notifications via Telegram API.",
    image: "/images/case-saas.svg",
    imageAlt:
      "AI workflow systems map connecting onboarding, support routing, and operations handoff layers",
    results: [
      { value: 74, suffix: "%", label: "Workload Reduced", decimals: 0 },
      { value: 5, suffix: " min", label: "Avg Response Time", decimals: 0 },
      { value: 10, suffix: " days", label: "Implementation", decimals: 0 },
    ],
  },
] as const;

function AnimatedResult({
  value,
  suffix,
  label,
  decimals = 0,
  inView,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!inView) {
      return;
    }

    const target = decimals > 0 ? value * 10 : value;
    const start = performance.now();
    const duration = 1600;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [inView, value, decimals]);

  const display = decimals > 0 ? (count / 10).toFixed(decimals) : count;

  return (
    <div className="rounded-xl p-3 text-center liquid-glass-subtle sm:rounded-2xl sm:p-4">
      <div className="text-lg font-bold text-blue-300 sm:text-2xl md:text-3xl">
        {display}
        {suffix}
      </div>
      <div className="mt-0.5 text-[10px] font-medium text-slate-400 sm:mt-1 sm:text-xs">
        {label}
      </div>
    </div>
  );
}

function CaseResults({
  results,
}: {
  results: readonly { value: number; suffix: string; label: string; decimals: number }[];
}) {
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
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-2 sm:gap-3">
      {results.map((result) => (
        <AnimatedResult
          key={result.label}
          value={result.value}
          suffix={result.suffix}
          label={result.label}
          decimals={result.decimals}
          inView={inView}
        />
      ))}
    </div>
  );
}

export default function CasePreview() {
  return (
    <section id="cases" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Case Studies
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Real results. Real businesses.
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">
              Process optimization consulting delivered through structured
              automation systems architecture.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-3 text-sm text-slate-300">
              Learn how we execute in{" "}
              <Link href="/approach" className="text-blue-300 transition hover:text-blue-200">
                our framework
              </Link>{" "}
              and compare services on the{" "}
              <Link href="/services" className="text-blue-300 transition hover:text-blue-200">
                solutions page
              </Link>
              .
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {cases.map((caseItem, index) => (
            <Reveal
              key={caseItem.company}
              variant={index === 0 ? "left" : "right"}
              delay={index * 200}
            >
              <article className="group relative overflow-hidden rounded-2xl transition-all duration-500 active:scale-[0.99] liquid-glass-elevated prismatic-edge sm:rounded-3xl md:hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)]">
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="mb-6 overflow-hidden rounded-xl border border-white/10 sm:mb-8 sm:rounded-2xl">
                    <Image
                      src={caseItem.image}
                      alt={caseItem.imageAlt}
                      width={880}
                      height={500}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      loading="lazy"
                      className="h-auto w-full"
                    />
                  </div>

                  <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl text-base font-bold text-blue-300 transition-transform duration-500 liquid-glass-subtle sm:size-12 sm:rounded-2xl sm:text-lg md:group-hover:scale-110">
                      {caseItem.company[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white sm:text-lg">
                        {caseItem.company}
                      </h3>
                      <p className="text-xs text-slate-400 sm:text-sm">{caseItem.industry}</p>
                    </div>
                  </div>

                  <div className="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
                    <div className="rounded-xl border p-4 sm:rounded-2xl sm:p-5" style={{ background: "rgb(244 63 94 / 0.06)", borderColor: "rgb(244 63 94 / 0.16)" }}>
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-rose-200 sm:mb-2 sm:text-xs">
                        Problem
                      </span>
                      <p className="text-sm leading-relaxed text-slate-300">{caseItem.problem}</p>
                    </div>
                    <div className="rounded-xl border border-blue-400/15 bg-blue-500/5 p-4 sm:rounded-2xl sm:p-5">
                      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-blue-300 sm:mb-2 sm:text-xs">
                        Solution
                      </span>
                      <p className="text-sm leading-relaxed text-slate-300">{caseItem.solution}</p>
                    </div>
                  </div>

                  <CaseResults results={caseItem.results} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
