import Link from "next/link";

import Reveal from "@/components/Reveal";

export default function ApproachCTA() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl p-12 text-center liquid-glass-elevated prismatic-edge md:p-16">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(0,212,192,0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.06), transparent 50%)",
              }}
            />

            <div className="relative">
              <Reveal variant="fade" delay={150}>
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#00d4c0]">
                  Let&apos;s Build Together
                </p>
              </Reveal>

              <Reveal delay={250}>
                <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  Structured Systems.
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #00d4c0, #8b5cf6)" }}
                  >
                    Predictable Growth.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={350}>
                <p className="mx-auto mt-4 max-w-xl text-slate-300">
                  We partner with businesses that value long-term infrastructure
                  over quick fixes. Start with a process audit and discover what
                  structured automation can unlock.
                </p>
              </Reveal>

              <Reveal delay={450}>
                <div className="mt-8">
                  <Link
                    href="/#contact"
                    className="inline-flex items-center rounded-2xl btn-primary px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Start With an Audit
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
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
