import Link from "next/link";

import Reveal from "@/components/Reveal";

export default function CTA() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="relative mx-auto max-w-4xl">
        <Reveal variant="scale">
          <div className="rounded-2xl p-8 text-center liquid-glass-elevated prismatic-edge sm:rounded-[2rem] sm:p-12 md:p-16">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 sm:rounded-[2rem]"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(0,212,192,0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.06), transparent 50%)",
              }}
            />

            <div className="relative">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Find out how much time and money your business is losing.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:mt-6 sm:text-lg">
                Get a free, no-obligation audit of your operations. We will identify
                the highest-impact automations for your business.
              </p>

              <div className="mt-8 sm:mt-10">
                <Link
                  href="/#contact"
                  className="btn-primary inline-flex w-full items-center justify-center rounded-xl px-8 py-3 text-base font-bold text-white active:scale-[0.98] sm:w-auto sm:rounded-2xl sm:px-10 sm:py-4"
                >
                  Request Free Audit
                  <svg
                    className="ml-2"
                    width="16"
                    height="16"
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
