import Link from "next/link";
import { Brain, Settings, TrendingUp } from "lucide-react";

import Reveal from "@/components/Reveal";

const services = [
  {
    icon: TrendingUp,
    title: "Sales Automation",
    description:
      "CRM automation and AI workflow systems for lead capture, follow-ups, and pipeline execution.",
    features: [
      "CRM integration and auto-sync",
      "Lead scoring with AI",
      "Automated follow-up sequences",
      "Pipeline analytics dashboard",
      "WhatsApp and email nurturing",
    ],
  },
  {
    icon: Settings,
    title: "Operations Automation",
    description:
      "Business process automation and operational optimization for reporting, approvals, and team coordination.",
    features: [
      "Task and project automation",
      "Automated reporting",
      "Inventory management",
      "Team notification systems",
      "Document generation",
    ],
  },
  {
    icon: Brain,
    title: "AI Upgrade",
    description:
      "Automation systems architecture and business system design for practical AI deployment.",
    features: [
      "Custom AI chatbots",
      "Intelligent data analysis",
      "Predictive forecasting",
      "Natural language processing",
      "AI-powered decision support",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Services
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Solutions built for growth
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 text-sm text-slate-300 sm:mt-4 sm:text-base">
              End-to-end automation consulting services designed around business
              outcomes and measurable process optimization.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-3 text-sm text-slate-300">
              Review our{" "}
              <Link href="/approach" className="text-blue-300 transition hover:text-blue-200">
                architecture framework
              </Link>{" "}
              or inspect{" "}
              <Link href="/cases" className="text-blue-300 transition hover:text-blue-200">
                case studies
              </Link>{" "}
              for implementation details.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} variant="up" index={index} staggerBase={150}>
              <article className="group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-500 active:scale-[0.98] liquid-glass prismatic-edge sm:rounded-3xl sm:p-8 md:hover:-translate-y-2 md:hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)]">
                <div className="relative flex flex-1 flex-col">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl text-blue-300 transition-transform duration-500 liquid-glass-subtle sm:mb-6 sm:size-14 sm:rounded-2xl md:group-hover:scale-110">
                    <service.icon className="size-5 sm:size-6" />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl">
                    {service.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-300 sm:mb-6">
                    {service.description}
                  </p>

                  <ul className="mb-6 flex-1 space-y-2.5 sm:mb-8 sm:space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-200/90">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            className="text-blue-300"
                            aria-hidden="true"
                          >
                            <path
                              d="M2 5L4 7L8 3"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/#contact"
                    className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 liquid-btn sm:rounded-2xl md:hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Started
                    <svg
                      className="ml-2"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 7H12M12 7L8 3M12 7L8 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
