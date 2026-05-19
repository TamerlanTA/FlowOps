"use client";

import { useEffect, useRef } from "react";
import { Activity, ArrowUpRight, FileText, Gauge, Lightbulb, Route, Timer, Wrench } from "lucide-react";
import { gsap } from "@/lib/gsap";
import styles from "./PortalPreviewSection.module.css";

const HEALTH_ROWS = [
  { label: "LeadOS qualification", status: "Stable", value: "98%" },
  { label: "SalesOS follow-up", status: "Review", value: "7 open" },
  { label: "InboxOS routing", status: "Stable", value: "24h" },
] as const;

const RECOMMENDATIONS = [
  "Add no-response recovery for demo requests.",
  "Split enterprise leads into a separate approval queue.",
  "Move monthly pipeline reporting into ReportOS.",
] as const;

const REPORT_ITEMS = [
  { label: "Monthly ops report", value: "Prepared" },
  { label: "System status", value: "3 stable / 1 review" },
  { label: "Next improvements", value: "Queued" },
] as const;

export default function PortalPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.copy}`,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.copy}`, start: "top 85%", once: true },
        },
      );

      gsap.fromTo(
        `.${styles.dashboard}`,
        { opacity: 0, y: 44, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: `.${styles.dashboard}`, start: "top 82%", once: true },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="portal" ref={sectionRef} className={styles.section}>
      <div className={styles.bgGrid} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Client Workspace Preview</span>
          <h2 className={styles.title}>
            Designed for ongoing operational visibility.
          </h2>
          <p className={styles.description}>
            A future workspace concept for your systems, performance, monthly ops report,
            and recommendations in one place. This is a platform preview, not a login surface.
          </p>
        </div>

        <div className={styles.dashboard} data-cursor="glow">
          <div className={styles.dashboardHeader}>
            <div>
              <div className={styles.panelLabel}>FLOWOPS OS // WORKSPACE CONCEPT</div>
              <h3 className={styles.dashboardTitle}>Operations Overview</h3>
            </div>
            <div className={styles.windowControls} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <Activity className={styles.metricIcon} aria-hidden="true" />
              <span className={styles.metricLabel}>Active systems</span>
              <strong>6</strong>
            </div>
            <div className={styles.metricCard}>
              <Gauge className={styles.metricIcon} aria-hidden="true" />
              <span className={styles.metricLabel}>Automation health</span>
              <strong>94%</strong>
            </div>
            <div className={styles.metricCard}>
              <Timer className={styles.metricIcon} aria-hidden="true" />
              <span className={styles.metricLabel}>Saved hours</span>
              <strong>Mapped</strong>
            </div>
            <div className={styles.metricCard}>
              <Route className={styles.metricIcon} aria-hidden="true" />
              <span className={styles.metricLabel}>Lead flow</span>
              <strong>Live</strong>
            </div>
          </div>

          <div className={styles.lowerGrid}>
            <div className={styles.tablePanel}>
              <div className={styles.panelLabel}>System Health</div>
              {HEALTH_ROWS.map((row) => (
                <div key={row.label} className={styles.healthRow}>
                  <span>{row.label}</span>
                  <span className={row.status === "Stable" ? styles.stable : styles.review}>
                    {row.status}
                  </span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>

            <div className={styles.recommendationPanel}>
              <div className={styles.panelLabel}>
                <Lightbulb size={13} aria-hidden="true" />
                Monthly Recommendations
              </div>
              {RECOMMENDATIONS.map((item) => (
                <div key={item} className={styles.recommendation}>
                  <ArrowUpRight size={14} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reportPanel}>
            {REPORT_ITEMS.map((item, index) => {
              const Icon = index === 0 ? FileText : index === 1 ? Gauge : Wrench;

              return (
                <div key={item.label} className={styles.reportItem}>
                  <Icon size={15} aria-hidden="true" />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
