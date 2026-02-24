import { BarChart3, FileSpreadsheet, Repeat, UserX, Users } from "lucide-react";

import Reveal from "@/components/Reveal";

const problems = [
  {
    icon: UserX,
    title: "Lost Leads",
    description:
      "Potential customers slip through the cracks because follow-ups are manual and inconsistent.",
  },
  {
    icon: Repeat,
    title: "Manual Repetitive Tasks",
    description:
      "Your team wastes hours every day on tasks that should run on autopilot.",
  },
  {
    icon: BarChart3,
    title: "No Analytics",
    description:
      "You make decisions based on gut feeling instead of real-time operational data.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel Reporting Chaos",
    description:
      "Spreadsheets everywhere with no single source of truth. Data is scattered and outdated.",
  },
  {
    icon: Users,
    title: "Process Dependency on Employees",
    description:
      "Critical workflows break when key people are unavailable. Nothing is documented or automated.",
  },
];

export default function Problems() {
  return (
    <section id="about" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              The Problem
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Your business is losing time every day
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <Reveal key={problem.title} variant="scale" index={index} staggerBase={100}>
              <article className="group relative rounded-2xl p-6 transition-all duration-500 active:scale-[0.98] liquid-glass prismatic-edge sm:rounded-3xl sm:p-7 md:hover:-translate-y-1.5 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                <div className="relative">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl text-blue-300 transition-transform duration-500 liquid-glass-subtle sm:mb-5 sm:size-12 sm:rounded-2xl md:group-hover:scale-110">
                    <problem.icon className="size-5" />
                  </div>
                  <h3 className="mb-1.5 text-base font-semibold text-white sm:mb-2 sm:text-lg">
                    {problem.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300">{problem.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
