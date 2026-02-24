import type { Metadata } from "next";
import Link from "next/link";

import LayeredBackground from "@/components/LayeredBackground";
import Reveal from "@/components/Reveal";
import SectionGlow from "@/components/SectionGlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About FlowOps | AI Automation Consulting Team",
  description:
    "Learn how FlowOps delivers AI automation consulting, business process automation, and workflow systems architecture for operations-focused teams.",
  path: "/about",
});

const principles = [
  {
    title: "Architecture before tools",
    description:
      "We map business logic first, then select integrations and AI components that support long-term reliability.",
  },
  {
    title: "Operational transparency",
    description:
      "Every implementation includes clear ownership, measurable KPIs, and dashboard-level visibility for leadership.",
  },
  {
    title: "Incremental delivery",
    description:
      "We deploy in phases to protect ongoing operations while validating impact at each stage.",
  },
] as const;

const focusAreas = [
  "Lead management and response workflows",
  "Reporting pipelines and KPI monitoring",
  "Cross-team process handoffs and approvals",
  "Knowledge retrieval and AI-assisted execution",
] as const;

export default function AboutPage() {
  return (
    <>
      <LayeredBackground />

      <section className="relative px-5 pb-10 pt-28 sm:px-6 sm:pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal variant="fade">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:text-sm">
              About FlowOps
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Infrastructure-first automation for modern teams
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              FlowOps is an AI business automation agency focused on operational
              clarity. We design systems that reduce repetitive work, improve
              execution speed, and provide leadership with real-time visibility.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionGlow intensity="strong" />

      <section className="relative px-5 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-3">
          {principles.map((item, index) => (
            <Reveal key={item.title} variant="up" index={index} staggerBase={100}>
              <article className="rounded-2xl p-6 liquid-glass prismatic-edge sm:rounded-3xl sm:p-8">
                <h2 className="text-lg font-semibold text-white sm:text-xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionGlow />

      <section className="relative px-5 pb-20 pt-10 sm:px-6 md:pt-14">
        <div className="mx-auto max-w-5xl rounded-2xl p-6 liquid-glass-elevated prismatic-edge sm:rounded-3xl sm:p-8 md:p-10">
          <Reveal variant="fade">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">What we optimize</h2>
          </Reveal>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {focusAreas.map((item, index) => (
              <Reveal key={item} variant="scale" index={index} staggerBase={90}>
                <div className="flex items-center gap-3 rounded-xl p-3 liquid-glass-subtle sm:p-4">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/approach"
                className="inline-flex items-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-blue-400 active:scale-[0.98]"
              >
                Explore Our Approach
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center rounded-2xl px-6 py-3 text-sm font-medium text-white liquid-btn transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                View Case Studies
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
