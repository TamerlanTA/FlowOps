import Link from "next/link";

import Reveal from "@/components/Reveal";

export default function ApproachHero() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden px-5 pt-28 sm:px-6 sm:pt-20">
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal variant="scale" delay={200}>
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-medium text-slate-300 liquid-glass-subtle">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/60" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-400" />
            </span>
            Our Approach
          </div>
        </Reveal>

        <Reveal delay={350}>
          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            We Build Systems,
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #4478ff, #5ca8e6, #6b5cf5)" }}
            >
              Not Just Automations.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={480}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Our approach focuses on long-term automation systems architecture,
            not isolated tools, so business process automation stays stable as
            your company grows.
          </p>
        </Reveal>

        <Reveal delay={540}>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
            See the related{" "}
            <Link href="/services" className="text-blue-300 transition hover:text-blue-200">
              automation consulting services
            </Link>{" "}
            and validate outcomes in{" "}
            <Link href="/cases" className="text-blue-300 transition hover:text-blue-200">
              case studies
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-10">
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-2xl bg-blue-500 px-8 py-3 text-sm font-medium text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.03] hover:bg-blue-400 active:scale-[0.98]"
            >
              Request Process Audit
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
    </section>
  );
}
