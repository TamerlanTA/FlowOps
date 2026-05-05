"use client";

const NAV_LINKS = [
  { label: "Systems", href: "#systems" },
  { label: "Cases", href: "#cases" },
  { label: "Method", href: "#method" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.805 2.995L2.2 10.593c-1.274.492-1.267 1.178-.233 1.484l4.88 1.521 1.885 5.78c.235.649.12.902.787.902.516 0 .743-.236 1.035-.52l2.483-2.41 5.163 3.808c.95.524 1.638.254 1.876-.881l3.395-15.994c.35-1.398-.534-2.032-1.666-1.288z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      style={{
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "64px 0 32px",
        position: "relative",
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: "absolute",
          top: "-1px",
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
          opacity: 0.6,
        }}
      />

      <div
        style={{
          maxWidth: "var(--container-width)",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr",
            gap: "64px",
            marginBottom: "48px",
          }}
          className="footer-grid"
        >
          {/* Col 1: Logo + tagline */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "12px" }}>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#f0f2ff" }}>Flow</span>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#3b82f6",
                  boxShadow: "0 0 8px rgba(59,130,246,0.8)",
                  display: "inline-block",
                  marginTop: "1px",
                }}
              />
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#f0f2ff" }}>Ops</span>
            </div>
            <p style={{ color: "var(--color-text-faint)", fontSize: "14px", lineHeight: 1.6, maxWidth: "260px" }}>
              AI automation systems for ambitious teams.
            </p>
          </div>

          {/* Col 2: Nav links */}
          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-faint)",
                marginBottom: "20px",
              }}
            >
              Navigation
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "none",
                    padding: 0,
                    textAlign: "left",
                    fontSize: "14px",
                    color: "var(--color-text-faint)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = "var(--color-text-muted)")}
                  onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = "var(--color-text-faint)")}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Social + legal */}
          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-faint)",
                marginBottom: "20px",
              }}
            >
              Connect
            </h4>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
              {SOCIAL_LINKS.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-faint)",
                    cursor: "none",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    btn.style.borderColor = "#3b82f6";
                    btn.style.color = "#60a5fa";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    btn.style.borderColor = "rgba(255,255,255,0.1)";
                    btn.style.color = "var(--color-text-faint)";
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#60a5fa")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#3b82f6")}
            >
              Get free audit →
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--color-text-faint)", margin: 0 }}>
            © 2025 FlowOps. All rights reserved.
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-faint)", margin: 0 }}>
            AI automation systems for real operations.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </footer>
  );
}
