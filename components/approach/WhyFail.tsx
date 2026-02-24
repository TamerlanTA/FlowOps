import { EyeOff, MapPinOff, Puzzle, Unplug } from "lucide-react";

import Reveal from "@/components/Reveal";

const failures = [
  {
    icon: Puzzle,
    title: "Tools Without Architecture",
    description:
      "Adopting automation tools without a structural blueprint creates fragile, disconnected systems that break under scale.",
  },
  {
    icon: Unplug,
    title: "Isolated Integrations",
    description:
      "Point-to-point connections between platforms create spaghetti workflows impossible to maintain or debug.",
  },
  {
    icon: MapPinOff,
    title: "Lack of Process Mapping",
    description:
      "Without mapping the full operational flow, automations solve surface symptoms while root inefficiencies persist.",
  },
  {
    icon: EyeOff,
    title: "No Owner-Level Visibility",
    description:
      "When leadership cannot see system-wide performance in real time, decisions are made on assumptions, not data.",
  },
];

export default function WhyFail() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              The Problem
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Why most automations fail
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 text-slate-300">
              Most businesses automate tasks. We architect systems. Here is what
              goes wrong without structure.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {failures.map((item, index) => (
            <Reveal key={item.title} variant="up" index={index} staggerBase={100}>
              <article className="group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-500 liquid-glass prismatic-edge sm:rounded-3xl sm:p-8 md:hover:-translate-y-1 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl text-blue-300 transition-transform duration-500 liquid-glass-subtle md:group-hover:scale-110">
                  <item.icon className="size-5" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
