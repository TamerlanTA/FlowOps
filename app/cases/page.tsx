import type { Metadata } from "next";
import Link from "next/link";

import CTA from "@/components/CTA";
import LayeredBackground from "@/components/LayeredBackground";
import Reveal from "@/components/Reveal";
import SectionGlow from "@/components/SectionGlow";
import { CASES } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Automation Case Studies | Business Process Optimization Results | FlowOps",
  description:
    "See measurable workflow automation and CRM automation outcomes from FlowOps projects focused on business process automation and operational optimization.",
  path: "/cases",
});

export default function CasesPage() {
  return (
    <>
      <LayeredBackground />

      <section className="relative px-5 pb-10 pt-28 sm:px-6 sm:pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal variant="fade">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:text-sm">
              Case Studies
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Measurable outcomes from production automation systems
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Selected projects where architecture, integrations, and process
              redesign produced clear operational improvements.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-300">
              Explore our{" "}
              <Link href="/services" className="text-blue-300 transition hover:text-blue-200">
                automation consulting services
              </Link>{" "}
              and the{" "}
              <Link href="/approach" className="text-blue-300 transition hover:text-blue-200">
                implementation framework
              </Link>{" "}
              behind these results.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionGlow intensity="strong" />

      <section className="relative px-5 pb-16 sm:px-6 md:pb-24 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-2">
          {CASES.map((caseItem, index) => (
            <Reveal
              key={caseItem.company}
              variant={index % 2 === 0 ? "left" : "right"}
              index={index}
              staggerBase={120}
            >
              <article className="h-full rounded-2xl p-6 liquid-glass-elevated prismatic-edge sm:rounded-3xl sm:p-8">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">{caseItem.company}</h2>

                <div className="mt-6 space-y-4 sm:space-y-5">
                  <div className="rounded-xl border p-4 sm:rounded-2xl" style={{ background: "rgb(244 63 94 / 0.06)", borderColor: "rgb(244 63 94 / 0.16)" }}>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-rose-200 sm:mb-2 sm:text-xs">
                      Problem
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">{caseItem.problem}</p>
                  </div>

                  <div className="rounded-xl border border-blue-400/15 bg-blue-500/5 p-4 sm:rounded-2xl">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-blue-300 sm:mb-2 sm:text-xs">
                      Implemented
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {caseItem.implementation}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl p-4 liquid-glass-subtle sm:mt-7 sm:rounded-2xl sm:p-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-200 sm:text-xs">
                    Results
                  </p>
                  <ul className="space-y-2">
                    {caseItem.results.map((result) => (
                      <li key={result} className="flex items-start gap-2 text-sm text-slate-200">
                        <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-emerald-300" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionGlow />
      <CTA />
      <SectionGlow intensity="soft" />
    </>
  );
}
