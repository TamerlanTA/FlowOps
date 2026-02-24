import { Brain, Database, Inbox, LayoutDashboard, Zap } from "lucide-react";

import Reveal from "@/components/Reveal";

const nodes = [
  { icon: Inbox, label: "Inbound", sub: "Leads and Requests" },
  { icon: Database, label: "CRM", sub: "Data and Routing" },
  { icon: Zap, label: "Automation", sub: "Workflows" },
  { icon: Brain, label: "AI", sub: "Intelligence" },
  { icon: LayoutDashboard, label: "Dashboard", sub: "Owner View" },
] as const;

export default function SystemMap() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              System Blueprint
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Example system architecture
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 text-slate-300">
              A typical FlowOps implementation connecting inbound data to
              owner-level visibility through structured layers.
            </p>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={250}>
          <div className="rounded-3xl p-8 liquid-glass-elevated prismatic-edge md:p-12">
            <div className="hidden md:block">
              <div className="flex items-center justify-between gap-2">
                {nodes.map((node, index) => (
                  <div key={node.label} className="flex flex-1 items-center gap-2 last:flex-initial">
                    <div className="group flex flex-1 flex-col items-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-2xl border border-blue-400/10 transition-all duration-500 liquid-glass-subtle md:group-hover:scale-110 md:group-hover:shadow-[0_0_24px_rgba(68,120,255,0.15)]">
                        <node.icon className="size-6 text-blue-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">{node.label}</p>
                        <p className="text-xs text-slate-400">{node.sub}</p>
                      </div>
                    </div>

                    {index < nodes.length - 1 ? (
                      <div className="-mt-6 flex items-center px-1">
                        <div
                          className="h-px w-8 lg:w-12"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(68,120,255,0.3), rgba(68,120,255,0.1))",
                          }}
                        />
                        <svg
                          width="8"
                          height="10"
                          viewBox="0 0 8 10"
                          fill="none"
                          className="shrink-0 text-blue-300/40"
                        >
                          <path
                            d="M1 1L6 5L1 9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 md:hidden">
              {nodes.map((node, index) => (
                <div key={node.label}>
                  <div className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-500 liquid-glass-subtle md:hover:shadow-[0_0_20px_rgba(68,120,255,0.1)]">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl text-blue-300 transition-transform duration-500 liquid-glass-subtle md:group-hover:scale-110">
                      <node.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{node.label}</p>
                      <p className="text-xs text-slate-400">{node.sub}</p>
                    </div>
                  </div>

                  {index < nodes.length - 1 ? (
                    <div className="ml-10 flex justify-center py-1">
                      <div
                        className="h-4 w-px"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(68,120,255,0.3), rgba(68,120,255,0.1))",
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
