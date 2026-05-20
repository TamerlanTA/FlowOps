"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import styles from "./CasesSection.module.css";

const CASES = [
  {
    id: "SYSTEM PATTERN 01",
    category: "Sales",
    badge: "LeadOS + SalesOS",
    title: "Inbound lead qualification and CRM routing",
    problem: "Inbound demand arrives through multiple channels, but qualification, CRM entry, assignment, and first follow-up are still handled manually.",
    pipeline: ["Lead In", "Qualify", "CRM Sync", "Assign", "Follow-up"],
    metrics: [
      { value: "Example", label: "Impact range depends on lead volume" },
      { value: "Hours", label: "Manual research and entry reduced" },
      { value: "Cleaner", label: "Pipeline visibility for managers" },
    ],
    quote: "The system creates a sales-ready record, routes it to the right person, and leaves a clear follow-up trail.",
    author: "FlowOps OS pattern",
  },
  {
    id: "SYSTEM PATTERN 02",
    category: "Operations",
    badge: "OpsOS",
    title: "Order-to-operations execution layer",
    problem: "New orders, requests, or internal jobs require manual task creation, status updates, supplier messages, and exception handling.",
    pipeline: ["Work In", "Classify", "Create Task", "Notify", "Update"],
    metrics: [
      { value: "Mapped", label: "Handoffs and exceptions" },
      { value: "Routed", label: "Tasks, owners, and alerts" },
      { value: "Visible", label: "Operational status trail" },
    ],
    quote: "OpsOS turns recurring coordination into a structured workflow with human approval where it matters.",
    author: "FlowOps OS pattern",
  },
  {
    id: "SYSTEM PATTERN 03",
    category: "AI",
    badge: "ReportOS",
    title: "Operational intelligence and monthly recommendations",
    problem: "Leadership needs clear visibility into saved hours, lead flow, automation health, and bottlenecks without rebuilding reports manually.",
    pipeline: ["Sources", "Normalize", "Metrics", "Dashboard", "Review"],
    metrics: [
      { value: "Health", label: "System status and exception signals" },
      { value: "Flow", label: "Lead and workflow movement" },
      { value: "Roadmap", label: "Next automation opportunities" },
    ],
    quote: "ReportOS makes operations measurable enough to maintain, improve, and expand with discipline.",
    author: "FlowOps OS pattern",
  },
];

function WorkflowDiagram({ nodes }: { nodes: string[] }) {
  return (
    <div className={styles.diagramContainer}>
      <svg width="100%" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection Lines */}
        {nodes.map((_, i) => i < nodes.length - 1 && (
          <motion.path
            key={`line-${i}`}
            d={`M ${60 + i * 70} 100 L ${60 + (i + 1) * 70} 100`}
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
        
        {/* Shimmer on Lines */}
        {nodes.map((_, i) => i < nodes.length - 1 && (
          <motion.path
            key={`shimmer-${i}`}
            d={`M ${60 + i * 70} 100 L ${60 + (i + 1) * 70} 100`}
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1],
              pathOffset: [0, 0, 1],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`node-group-${i}`} transform={`translate(${60 + i * 70 - 30}, 85)`}>
            <motion.rect
              width="60"
              height="30"
              rx="6"
              fill="rgba(15, 16, 23, 0.9)"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="1"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
            />
            <foreignObject x="0" y="0" width="60" height="30">
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '7px',
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
                padding: '2px',
                textTransform: 'uppercase'
              }}>
                {node}
              </div>
            </foreignObject>
            {/* Pulsing Dot */}
            <motion.circle
              cx="30"
              cy="0"
              r="2"
              fill="var(--color-primary)"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function CaseCard({ c }: { c: typeof CASES[0] }) {
  return (
    <div className={`${styles.cardWrapper} case-card-wrapper`}>
      <div className={styles.card} data-cursor="glow">
        <div className={styles.cardOverlay} />
        <div className={styles.scanline} />
        
        {/* Left: Content */}
        <div className={styles.content}>
          <div className={styles.missionId}>{c.id}</div>
          <h3 className={styles.cardTitle}>{c.title}</h3>
          
          <div className={styles.label}>Operational Context</div>
          <p className={styles.problem}>{c.problem}</p>
          
          <div className={styles.label}>System Effect</div>
          <div className={styles.resultsGrid}>
            {c.metrics.map((m, i) => (
              <div key={i}>
                <div className={styles.metricValue}>{m.value}</div>
                <div className={styles.metricLabel}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visuals */}
        <div className={styles.visuals}>
          <div className={styles.systemLabel}>SYSTEM MODEL / READY</div>
          <div className={styles.label} style={{ marginBottom: 0 }}>Workflow Architecture</div>
          
          <WorkflowDiagram nodes={c.pipeline} />
          
          <div className={styles.quoteBox}>
            <p className={styles.quote}>&ldquo;{c.quote}&rdquo;</p>
            <div className={styles.author}>— {c.author}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".case-card-wrapper");
      
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Don't animate last card's exit
        
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.4,
          filter: "blur(10px)",
          scrollTrigger: {
            trigger: card,
            start: "top 100px",
            end: "bottom 100px",
            scrub: true,
          },
        });
      });

      // Heading animation
      gsap.fromTo(
        ".cases-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".cases-header", start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="cases" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.header} cases-header`}>
          <span className={styles.eyebrow}>Cases / System Patterns</span>
          <h2 className={styles.title}>
            Proof should look like operating improvements, not disconnected automations.
          </h2>
        </div>

        <div className={styles.stackContainer} ref={stackRef}>
          {CASES.map((c) => (
            <CaseCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
