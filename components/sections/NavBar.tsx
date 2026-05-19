"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { label: "OS", href: "#os" },
  { label: "Systems", href: "#systems" },
  { label: "Audit", href: "#audit" },
  { label: "Subscriptions", href: "#subscriptions" },
  { label: "Portal", href: "#portal" },
  { label: "Cases", href: "#cases" },
  { label: "FAQ", href: "#faq" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = NAV_LINKS.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.container}>
          {/* Logo */}
          <button className={styles.logo} onClick={() => handleNavClick("#")} data-cursor="pointer">
            <span className={styles.logoText}>FLOW</span>
            <div className={styles.logoDot} />
            <span className={styles.logoText}>OPS</span>
          </button>

          {/* Links */}
          <div className={styles.linksGrid}>
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                  data-cursor="pointer"
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.cta} onClick={() => handleNavClick("#contact")} data-cursor="pointer">
              Get Free Audit
            </button>

            <button 
              className={styles.hamburger} 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              data-cursor="pointer"
            >
              <div className={styles.bar} style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
              <div className={styles.bar} style={{ opacity: menuOpen ? 0 : 1 }} />
              <div className={styles.bar} style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                className={styles.mobileLink}
                onClick={() => handleNavClick(link.href)}
                data-cursor="pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              className={styles.cta}
              style={{ display: 'block', marginTop: '20px', fontSize: '18px', padding: '16px 40px' }}
              onClick={() => handleNavClick("#contact")}
              data-cursor="pointer"
            >
              Get Free Audit
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
