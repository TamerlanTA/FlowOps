"use client";

import styles from "./Footer.module.css";

const NAV_LINKS = [
  { label: "FlowOps OS", href: "#os" },
  { label: "Systems", href: "#systems" },
  { label: "Audit", href: "#audit" },
  { label: "Subscriptions", href: "#subscriptions" },
  { label: "Portal", href: "#portal" },
  { label: "Cases", href: "#cases" },
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
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          {/* Brand */}
          <div>
            <div className={styles.logo}>
              FLOW<div className={styles.logoDot} />OPS
            </div>
            <p className={styles.tagline}>
              FlowOps OS turns manual operations into audited, deployed, and maintained AI systems.
            </p>
            <div className={styles.status}>
              <div className={styles.pulse} />
              FLOWOPS_OS // V1
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className={styles.colTitle}>Navigation</h4>
            <div className={styles.linksList}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={styles.link}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className={styles.colTitle}>Connect</h4>
            <div className={styles.socialRow} style={{ marginBottom: '24px' }}>
              {SOCIAL_LINKS.map((s) => (
                <button key={s.label} className={styles.socialBtn} aria-label={s.label}>
                  {s.icon}
                </button>
              ))}
            </div>
            <button
              className={styles.link}
              style={{ color: 'var(--color-primary)', fontWeight: 700 }}
              onClick={() => handleNavClick("#contact")}
            >
              Request Free Audit →
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} FlowOps OS. All rights reserved.
          </div>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
