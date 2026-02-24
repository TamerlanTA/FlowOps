import { Headphones, PenTool, Rocket, Search, TestTubeDiagonal } from "lucide-react";

import Reveal from "@/components/Reveal";

const phases = [
  {
    icon: Search,
    number: "01",
    title: "Audit",
    description:
      "We conduct a comprehensive operational audit to map every process, bottleneck, and data flow across your business.",
  },
  {
    icon: PenTool,
    number: "02",
    title: "Architecture Design",
    description:
      "Based on the audit, we design a structured automation architecture with clear layers, ownership, and data governance.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Deployment",
    description:
      "Systems are built and deployed in structured phases with zero disruption to existing operations.",
  },
  {
    icon: TestTubeDiagonal,
    number: "04",
    title: "Testing and Optimization",
    description:
      "Every automation is stress-tested, monitored, and optimized for performance before full handover.",
  },
  {
    icon: Headphones,
    number: "05",
    title: "Ongoing Support",
    description:
      "Continuous monitoring, iteration, and dedicated support to ensure systems evolve with your business.",
  },
] as const;

export default function ImplementationPhases() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Implementation
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Five phases to operational clarity
            </h2>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-6 top-0 w-px md:left-1/2 md:-translate-x-1/2">
            <Reveal variant="fade" delay={100}>
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(68,120,255,0.2) 5%, rgba(68,120,255,0.2) 95%, transparent)",
                }}
              />
            </Reveal>
          </div>

          <div className="flex flex-col gap-12">
            {phases.map((phase, index) => (
              <Reveal key={phase.title} variant="up" index={index} staggerBase={120}>
                <div className="relative flex gap-8 md:items-center">
                  <div className={`hidden flex-1 md:block ${index % 2 === 0 ? "pr-12 text-right" : ""}`}>
                    {index % 2 === 0 ? (
                      <article className="inline-block rounded-3xl p-6 text-left transition-all duration-500 liquid-glass md:hover:-translate-y-1 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70">
                          Phase {phase.number}
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-white">{phase.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{phase.description}</p>
                      </article>
                    ) : null}
                  </div>

                  <div className="relative z-10 flex shrink-0 items-center justify-center">
                    <div className="flex size-12 items-center justify-center rounded-full border border-blue-400/20 text-blue-300 shadow-[0_0_20px_rgba(68,120,255,0.12)] liquid-glass-elevated">
                      <phase.icon className="size-5" />
                    </div>
                  </div>

                  <div className={`flex-1 ${index % 2 === 0 ? "md:pointer-events-none md:opacity-0" : "md:pl-12"}`}>
                    <article className="rounded-3xl p-6 transition-all duration-500 liquid-glass md:hover:-translate-y-1 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                      <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70">
                        Phase {phase.number}
                      </span>
                      <h3 className="mt-1 text-lg font-bold text-white">{phase.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{phase.description}</p>
                    </article>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
