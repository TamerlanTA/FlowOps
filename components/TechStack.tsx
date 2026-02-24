import Reveal from "@/components/Reveal";

const technologies = [
  {
    name: "Make",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "n8n",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <rect x="6" y="14" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="22" y="14" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 20H22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <path d="M20 6L34 28H6L20 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Shopify",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <path d="M14 8L26 8L30 32H10L14 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 8C16 8 17 4 20 4C23 4 24 8 24 8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Telegram API",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <path d="M6 20L34 8L28 34L20 24L6 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 24L34 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: "Google Cloud",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="size-6 sm:size-7" aria-hidden="true">
        <path d="M20 10L30 16V28L20 34L10 28V16L20 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 10V34" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M10 16L30 28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M30 16L10 28" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    ),
  },
] as const;

export default function TechStack() {
  return (
    <section className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300 sm:mb-3 sm:text-sm">
              Technology
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Powered by industry leaders
            </h2>
          </Reveal>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
          {technologies.map((tech, index) => (
            <Reveal key={tech.name} variant="scale" index={index} staggerBase={70}>
              <div className="group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all duration-500 active:scale-[0.96] liquid-glass sm:gap-3 sm:rounded-3xl sm:p-6 md:hover:-translate-y-1.5 md:hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                <div className="text-slate-400 transition-all duration-300 md:group-hover:scale-110 md:group-hover:text-blue-300">
                  {tech.icon}
                </div>
                <span className="text-[10px] font-medium text-slate-400 transition-colors duration-300 sm:text-xs md:group-hover:text-white">
                  {tech.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
