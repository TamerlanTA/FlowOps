"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Check } from "lucide-react";

import styles from "./PainSection.module.css";

const PAIN_ITEMS = [
  "Leads arrive through forms, email, calls, WhatsApp, and ads, but qualification still depends on whoever notices first.",
  "Follow-ups happen late because reminders live in inboxes, calendars, chat threads, and individual memory.",
  "CRM fields are incomplete, deal stages are inconsistent, and managers cannot trust pipeline visibility.",
  "Reports are assembled manually from spreadsheets and exports, so decisions lag behind the business.",
  "Support and operations requests move across disconnected tools with no reliable ownership trail.",
  "New work sits unassigned until someone manually routes it, checks context, and creates the next task.",
  "The company has added more software, but the work between those tools is still held together by people.",
  "AI is being discussed, tested, and subscribed to, but it is not yet embedded into daily operating workflows.",
];

const MONTHLY_LEAKAGE_PER_ITEM = 1800;

const floatingLabels = [
  { text: "workflow_gap_scan", top: "15%", left: "5%" },
  { text: "crm_signal_incomplete", top: "45%", right: "8%" },
  { text: "manual_handoff_active", bottom: "12%", left: "10%" },
  { text: "ops_layer_missing", bottom: "25%", right: "15%" },
];

export default function PainSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.fromTo(
        `.${styles.heading}`,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.heading}`, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: `.${styles.cardsGrid}`, start: "top 80%", once: true },
        }
      );

      // Background parallax
      gsap.to(`.${styles.background}`, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });

      floatingLabels.forEach((_, idx) => {
        gsap.to(`.${styles.floatingLabel}:nth-child(${idx + 5})`, {
          y: (idx + 1) * -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });

      // Scanning animation
      if (scannerRef.current) {
        gsap.to(scannerRef.current, {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
            onEnter: () => {
              gsap.fromTo(scannerRef.current, 
                { y: "-100%" }, 
                { y: "1000%", duration: 2.5, ease: "none", onComplete: () => {
                  if (scannerRef.current) scannerRef.current.style.opacity = "0";
                }}
              );
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      const size = next.size;
      setCtaVisible(size >= 3);
      return next;
    });
  };

  const count = checked.size;
  const monthlyLeakage = count * MONTHLY_LEAKAGE_PER_ITEM;

  return (
    <section id="problem" ref={sectionRef} className={styles.painSection}>
      {/* Background elements */}
      <div className={styles.background}>
        <div className={styles.grid} />
        <div className={styles.scanline} />
        <div className={styles.glowBlue} />
        <div className={styles.glowAmber} />
        {floatingLabels.map((label, idx) => (
          <span 
            key={idx} 
            className={styles.floatingLabel} 
            style={{ 
              top: label.top, 
              left: label.left, 
              right: label.right, 
              bottom: label.bottom 
            }}
          >
            {label.text}
          </span>
        ))}
      </div>

      <div ref={scannerRef} className={styles.scannerLine} />

      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              Operational Infrastructure Gap
            </span>
            <h2 className={styles.title}>
              Most companies do not need more tools. They need an operating layer.
            </h2>
            <p className={styles.subtitle}>
              Manual work is rarely one broken process. It is the space between tools, teams,
              handoffs, and reporting. FlowOps starts by mapping that space before recommending
              any system.
            </p>
          </div>

          {/* Diagnostic Meter */}
          <div className={styles.meter}>
            <div className={styles.meterLabel}>
              <span>Signals selected</span>
              <span>Status: Map ready</span>
            </div>
            <div className={styles.meterValue}>
              {count} <span className={styles.meterTotal}>of 8</span>
            </div>
            
            <div className={styles.lossWrapper}>
              <p className={styles.lossLabel}>Est. monthly leakage</p>
              <div className={styles.lossValue}>
                ${monthlyLeakage.toLocaleString()}
              </div>
            </div>

            {ctaVisible && (
              <button
                className={styles.ctaButton}
                data-cursor="pointer"
                onClick={() => {
                  const audit = document.getElementById("audit");
                  if (audit) audit.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Map this in an audit →
              </button>
            )}
          </div>
        </div>

        {/* Diagnostic cards grid */}
        <div className={styles.cardsGrid}>
          {PAIN_ITEMS.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <button
                key={i}
                className={`${styles.card} ${isChecked ? styles.cardActive : ""}`}
                onClick={() => toggle(i)}
                data-cursor="scanner"
              >
                <div className={`${styles.checkbox} ${isChecked ? styles.checkboxActive : ""}`}>
                  {isChecked && <Check className={styles.checkIcon} />}
                </div>
                <div className={styles.cardContent}>
                  <span className={`${styles.cardNumber} ${isChecked ? styles.cardNumberActive : ""}`}>
                    0{i + 1}
                  </span>
                  <span className={`${styles.cardText} ${isChecked ? styles.cardTextActive : ""}`}>
                    {item}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live diagnostic bar */}
        <div className={styles.bottomBar}>
          <p className={styles.bottomText}>
            Diagnostic: <span className={styles.bottomHighlight}>{count} issues</span> detected. 
            Planning estimate: <span className={styles.bottomLoss}>${monthlyLeakage.toLocaleString()}/mo</span> in recoverable leakage.
          </p>
          <button
            className={styles.secondaryCta}
            data-cursor="pointer"
            onClick={() => {
              const audit = document.getElementById("audit");
              if (audit) audit.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Request audit map →
          </button>
        </div>
      </div>
    </section>
  );
}
