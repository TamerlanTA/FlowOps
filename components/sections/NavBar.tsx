"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";

const NAV_LINKS = [
  { label: "Systems", href: "#systems" },
  { label: "Cases", href: "#cases" },
  { label: "Method", href: "#method" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLElement>(null);

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
      gsap.fromTo(
        ".mobile-nav-link",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.45, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.7)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.07)"}`,
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-width)",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "none",
              border: "none",
              cursor: "none",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#f0f2ff",
                letterSpacing: "-0.02em",
              }}
            >
              Flow
            </span>
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
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: "#f0f2ff",
                letterSpacing: "-0.02em",
              }}
            >
              Ops
            </span>
          </button>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "none",
                    padding: "4px 0",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                    position: "relative",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "#3b82f6",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => handleNavClick("#contact")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "none",
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                transition: "background 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "#60a5fa";
                (e.target as HTMLButtonElement).style.boxShadow = "var(--shadow-blue)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "#3b82f6";
                (e.target as HTMLButtonElement).style.boxShadow = "none";
              }}
              className="cta-btn"
            >
              Get free audit →
            </button>

            {/* Hamburger - mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "none",
                padding: "4px",
                display: "none",
                flexDirection: "column",
                gap: "5px",
              }}
              className="hamburger-btn"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: "22px",
                    height: "2px",
                    background: "#f0f2ff",
                    borderRadius: "1px",
                    transition: "transform 0.3s, opacity 0.3s",
                    transformOrigin: "center",
                    transform:
                      menuOpen
                        ? i === 0
                          ? "rotate(45deg) translate(5px, 5px)"
                          : i === 2
                          ? "rotate(-45deg) translate(5px, -5px)"
                          : "opacity(0) scaleX(0)"
                        : "none",
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99,
              background: "#000000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                className="mobile-nav-link"
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "none",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                  opacity: 0,
                }}
              >
                {link.label}
              </button>
            ))}
            <button
              className="mobile-nav-link"
              onClick={() => handleNavClick("#contact")}
              style={{
                marginTop: "16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "none",
                padding: "14px 32px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 600,
                opacity: 0,
              }}
            >
              Get free audit →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .cta-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
