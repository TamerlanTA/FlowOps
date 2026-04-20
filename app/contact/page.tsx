import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/ContactForm";
import LayeredBackground from "@/components/LayeredBackground";
import Reveal from "@/components/Reveal";
import SectionGlow from "@/components/SectionGlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request a Business Automation Audit | FlowOps",
  description:
    "Request a business automation audit to identify workflow automation, CRM automation, and operational optimization opportunities for your company.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <LayeredBackground />

      <section className="relative px-5 pb-10 pt-28 sm:px-6 sm:pt-24 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal variant="fade">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:text-sm">
              Contact FlowOps
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Get a structured audit of your current workflows
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Share how your team operates today. We will identify priority
              bottlenecks, estimate automation impact, and outline a practical
              implementation plan.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-300">
              Review our{" "}
              <Link href="/services" className="text-blue-300 transition hover:text-blue-200">
                service scope
              </Link>{" "}
              and{" "}
              <Link href="/approach" className="text-blue-300 transition hover:text-blue-200">
                architecture methodology
              </Link>{" "}
              before submitting your request.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionGlow intensity="strong" />
      <ContactForm />
      <SectionGlow intensity="soft" />
    </>
  );
}
