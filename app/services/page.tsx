import type { Metadata } from "next";
import Link from "next/link";

import CTA from "@/components/CTA";
import LayeredBackground from "@/components/LayeredBackground";
import Reveal from "@/components/Reveal";
import SectionGlow from "@/components/SectionGlow";
import Services from "@/components/Services";
import { ServiceStructuredData } from "@/components/StructuredData";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Business Automation Services | AI Workflow & CRM Systems | FlowOps",
  description:
    "Explore automation consulting services for business process automation, CRM automation, AI workflow systems, and operational optimization.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <ServiceStructuredData />
      <LayeredBackground />

      <section className="relative px-5 pb-10 pt-28 sm:px-6 sm:pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal variant="fade">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:text-sm">
              Service Lines
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Automation programs designed around business outcomes
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Each engagement is structured to reduce operational load, improve
              process reliability, and provide leadership with measurable
              execution visibility.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-300">
              Review our{" "}
              <Link href="/approach" className="text-blue-300 transition hover:text-blue-200">
                automation systems architecture
              </Link>{" "}
              and see{" "}
              <Link href="/cases" className="text-blue-300 transition hover:text-blue-200">
                implementation results
              </Link>{" "}
              before requesting a custom audit.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionGlow intensity="strong" />
      <Services />
      <SectionGlow />

      <section className="relative px-5 pb-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            "Architecture-first implementation",
            "Deployment without operational downtime",
            "Training and support after launch",
          ].map((item, index) => (
            <Reveal key={item} variant="scale" index={index} staggerBase={90}>
              <div className="rounded-xl p-4 text-sm text-slate-200 liquid-glass-subtle sm:rounded-2xl sm:p-5">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionGlow intensity="strong" />
      <CTA />
      <SectionGlow intensity="soft" />
    </>
  );
}
