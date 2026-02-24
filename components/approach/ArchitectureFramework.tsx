import { BarChart3, Database, Inbox, Zap } from "lucide-react";

import Reveal from "@/components/Reveal";

const layers = [
  {
    number: "01",
    label: "Capture",
    icon: Inbox,
    description: "Leads, forms, messaging channels",
    details:
      "Unified entry points that funnel all inbound data into a single structured stream regardless of source.",
    color: "rgba(68,120,255,0.15)",
  },
  {
    number: "02",
    label: "Processing",
    icon: Database,
    description: "CRM, routing logic, validation",
    details:
      "Intelligent middleware that cleanses, routes, and validates data before it touches any downstream system.",
    color: "rgba(92,168,230,0.15)",
  },
  {
    number: "03",
    label: "Automation",
    icon: Zap,
    description: "Workflows, AI, integrations",
    details:
      "Event-driven automation layer that executes business logic, triggers AI models, and orchestrates multi-step workflows.",
    color: "rgba(107,92,245,0.15)",
  },
  {
    number: "04",
    label: "Control",
    icon: BarChart3,
    description: "Dashboards, analytics, reporting",
    details:
      "Real-time visibility layer providing owner-level dashboards, KPI tracking, and system health monitoring.",
    color: "rgba(68,120,255,0.15)",
  },
] as const;

export default function ArchitectureFramework() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Architecture Framework
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Four layers of operational intelligence
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 text-slate-300">
              Every system we build follows a structured 4-layer architecture
              designed for reliability, visibility, and scale.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 lg:block">
            <Reveal variant="fade" delay={200}>
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(68,120,255,0.2) 10%, rgba(68,120,255,0.2) 90%, transparent)",
                }}
              />
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            {layers.map((layer, index) => (
              <Reveal
                key={layer.label}
                variant={index % 2 === 0 ? "left" : "right"}
                index={index}
                staggerBase={120}
              >
                <div
                  className={`relative flex flex-col gap-6 lg:flex-row lg:items-center ${
                    index % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:text-left"}`}>
                    <article className="group rounded-3xl p-8 transition-all duration-500 liquid-glass prismatic-edge md:hover:-translate-y-1 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                      <div className={`mb-4 flex items-center gap-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-blue-300 transition-transform duration-500 liquid-glass-subtle md:group-hover:scale-110">
                          <layer.icon className="size-5" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300/70">
                            Layer {layer.number}
                          </span>
                          <h3 className="text-xl font-bold text-white">{layer.label}</h3>
                        </div>
                      </div>
                      <p className="mb-2 text-sm font-medium text-blue-300/80">{layer.description}</p>
                      <p className="text-sm leading-relaxed text-slate-300">{layer.details}</p>
                    </article>
                  </div>

                  <div className="relative z-10 hidden shrink-0 lg:flex">
                    <div
                      className="flex size-14 items-center justify-center rounded-full border border-blue-400/20 liquid-glass-elevated"
                      style={{ boxShadow: `0 0 24px ${layer.color}` }}
                    >
                      <span className="text-sm font-bold text-blue-300">{layer.number}</span>
                    </div>
                  </div>

                  <div className="hidden flex-1 lg:block" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
