import { GraduationCap, Headphones, Layout, Search, Zap } from "lucide-react";

import Reveal from "@/components/Reveal";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Audit",
    description: "Deep dive into your operations, processes, and pain points.",
  },
  {
    icon: Layout,
    number: "02",
    title: "Architecture",
    description: "Blueprint the optimal automation stack for your workflow.",
  },
  {
    icon: Zap,
    number: "03",
    title: "Automation",
    description: "Build and deploy AI-powered automations that run 24/7.",
  },
  {
    icon: GraduationCap,
    number: "04",
    title: "Training",
    description: "Onboard your team to manage and scale the new systems.",
  },
  {
    icon: Headphones,
    number: "05",
    title: "Support",
    description: "Ongoing monitoring, optimization, and dedicated support.",
  },
];

export default function Solutions() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Our Process
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              From chaos to clarity in 5 steps
            </h2>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[52px] hidden h-[2px] lg:block">
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(68,120,255,0.2), rgba(92,168,230,0.2), rgba(68,120,255,0.2), transparent)",
              }}
            />
          </div>

          <div className="absolute bottom-0 left-[35px] top-0 w-[2px] lg:hidden sm:left-[43px]">
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(68,120,255,0.15), rgba(92,168,230,0.15), rgba(68,120,255,0.15), transparent)",
              }}
            />
          </div>

          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-6">
            {steps.map((step, index) => (
              <Reveal key={step.title} variant="up" index={index} staggerBase={120}>
                <div className="group relative flex gap-5 lg:flex-col lg:gap-0 lg:text-center">
                  <div className="relative flex size-[72px] shrink-0 items-center justify-center sm:size-[88px] lg:mx-auto lg:mb-6 lg:size-[104px]">
                    <div className="absolute inset-0 rounded-full liquid-glass prismatic-edge transition-all duration-500 md:group-hover:-translate-y-1 md:group-hover:shadow-[0_8px_30px_rgba(68,120,255,0.12)]" />
                    <div className="relative flex size-10 items-center justify-center rounded-full text-blue-300 transition-transform duration-500 liquid-glass-subtle sm:size-12 lg:size-14 md:group-hover:scale-110">
                      <step.icon className="size-4 sm:size-5" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center lg:items-center">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-blue-300/70 sm:text-xs lg:mb-2">
                      Step {step.number}
                    </span>
                    <h3 className="mb-1 text-base font-semibold text-white sm:text-lg lg:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-300">{step.description}</p>
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
