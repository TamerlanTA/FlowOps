import Link from "next/link";

const links = [
  { label: "Services", href: "/services" },
  { label: "Approach", href: "/approach" },
  { label: "Cases", href: "/cases" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Footer() {
  return (
    <footer className="relative px-5 py-10 sm:px-6 sm:py-12">
      <div
        className="mx-auto mb-8 h-px max-w-7xl sm:mb-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(68,120,255,0.15), rgba(92,168,230,0.15), rgba(68,120,255,0.15), transparent)",
        }}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:gap-6 md:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg liquid-glass-subtle sm:size-8 sm:rounded-xl">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="sm:h-4 sm:w-4"
            >
              <path d="M2 4L8 2L14 4L8 6L2 4Z" fill="#4478ff" />
              <path d="M2 4V10L8 12V6L2 4Z" fill="#4478ff" fillOpacity="0.7" />
              <path d="M14 4V10L8 12V6L14 4Z" fill="#4478ff" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">FlowOps</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-slate-400 transition-all duration-300 hover:bg-white/10 hover:text-white active:bg-white/15 sm:px-4"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-slate-400">© 2026 FlowOps. All rights reserved.</p>
      </div>
    </footer>
  );
}
