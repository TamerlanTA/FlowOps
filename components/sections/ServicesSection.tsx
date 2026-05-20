"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { CheckCircle2 } from "lucide-react";

import styles from "./ServicesSection.module.css";

const TABS = [
  {
    id: "lead",
    label: "LeadOS",
    summary: "AI lead research and qualification.",
    headline: "Qualify the right leads before they reach a human queue.",
    description:
      "LeadOS researches prospects, enriches records, scores fit, and routes high-priority opportunities into the right sales workflow.",
    problem: "Lead quality is inconsistent and sales time is spent researching instead of prioritizing.",
    workflows: ["Inbound enrichment", "Prospect scoring", "Review queue routing"],
    recommendedFor: "Sales teams with many leads, mixed channels, or uneven qualification standards.",
    deploymentStyle: "Connected to CRM, lead sources, enrichment tools, and human review gates.",
    bullets: [
      "Prospect research and enrichment",
      "Fit and intent scoring",
      "CRM-ready lead records",
      "Duplicate and low-fit filtering",
      "Sales-ready lead summaries",
      "Manager review queues",
    ],
    result: "Best for companies with lead volume, inconsistent qualification, or sales teams spending too much time researching.",
    nodes: [
      { label: "Lead Source", status: "Input" },
      { label: "Research", status: "AI" },
      { label: "Score", status: "Logic" },
      { label: "CRM Record", status: "Sync" },
      { label: "Review Queue", status: "Ops" }
    ],
  },
  {
    id: "sales",
    label: "SalesOS",
    summary: "CRM follow-up and pipeline automation.",
    headline: "Turn follow-up from a memory problem into infrastructure.",
    description:
      "SalesOS keeps pipeline data clean, triggers follow-ups, alerts managers, and moves opportunities through the CRM with fewer manual gaps.",
    problem: "Follow-up depends on memory, CRM hygiene drifts, and managers lose pipeline visibility.",
    workflows: ["Follow-up recovery", "Stage hygiene", "Manager alerts"],
    recommendedFor: "Teams with long sales cycles, slow response times, or unreliable CRM discipline.",
    deploymentStyle: "Configured around CRM stages, owner rules, reminders, and escalation logic.",
    bullets: [
      "CRM stage hygiene",
      "Follow-up sequence logic",
      "Lead handoff and routing",
      "Pipeline alerts",
      "No-response recovery paths",
      "Sales manager visibility",
    ],
    result: "Best for teams with slow response times, missed follow-ups, and unreliable CRM discipline.",
    nodes: [
      { label: "New Deal", status: "CRM" },
      { label: "Rules", status: "Logic" },
      { label: "Follow-up", status: "Auto" },
      { label: "Manager Alert", status: "Ops" },
      { label: "Pipeline View", status: "Live" }
    ],
  },
  {
    id: "voice",
    label: "VoiceOS",
    summary: "AI phone receptionist and caller.",
    headline: "Answer, qualify, and route calls without losing the human handoff.",
    description:
      "VoiceOS handles inbound calls, captures context, qualifies the request, updates systems, and escalates to people when judgment is needed.",
    problem: "Calls are missed, logged manually, or routed without enough context for the next step.",
    workflows: ["Inbound qualification", "Call summaries", "Missed-call recovery"],
    recommendedFor: "Companies where phone demand creates scheduling, routing, or logging overhead.",
    deploymentStyle: "Layered around phone workflows, CRM records, scripts, and human handoff rules.",
    bullets: [
      "Inbound call capture",
      "Qualification scripts",
      "CRM and ticket updates",
      "Call summaries",
      "Escalation rules",
      "Missed-call recovery",
    ],
    result: "Best for companies losing calls, manually logging conversations, or relying on overloaded reception workflows.",
    nodes: [
      { label: "Call", status: "Input" },
      { label: "Voice Agent", status: "AI" },
      { label: "Qualify", status: "Logic" },
      { label: "CRM Update", status: "Sync" },
      { label: "Escalate", status: "Human" }
    ],
  },
  {
    id: "inbox",
    label: "InboxOS",
    summary: "Email and support automation.",
    headline: "Make inbox work visible, routed, and consistently answered.",
    description:
      "InboxOS triages inbound email and support requests, classifies intent, drafts responses, creates tasks, and escalates sensitive items.",
    problem: "Important requests disappear inside shared inboxes and support queues.",
    workflows: ["Intent classification", "Draft response", "SLA escalation"],
    recommendedFor: "Support, operations, or admin teams managing high-volume inbound email.",
    deploymentStyle: "Connected to inboxes, ticketing tools, approval steps, and response templates.",
    bullets: [
      "Email classification",
      "Support request routing",
      "Drafted replies",
      "SLA and priority alerts",
      "Task creation",
      "Human approval flows",
    ],
    result: "Best for teams where important requests disappear inside shared inboxes or support queues.",
    nodes: [
      { label: "Inbox", status: "Input" },
      { label: "Classify", status: "AI" },
      { label: "Draft", status: "Assist" },
      { label: "Route", status: "Ops" },
      { label: "Escalate", status: "Human" }
    ],
  },
  {
    id: "ops",
    label: "OpsOS",
    summary: "Internal workflow automation.",
    headline: "Give recurring operations a reliable execution layer.",
    description:
      "OpsOS connects internal tools, creates tasks, coordinates handoffs, enforces approvals, and keeps work moving across teams.",
    problem: "Recurring operations are coordinated through chat, spreadsheets, and manual checklists.",
    workflows: ["Task creation", "Approval routing", "Exception handling"],
    recommendedFor: "Operations teams with repeatable handoffs across departments and tools.",
    deploymentStyle: "Configured as workflow infrastructure across project, chat, and source systems.",
    bullets: [
      "Cross-tool workflow triggers",
      "Task and approval routing",
      "Internal alerts",
      "Exception handling",
      "Status updates",
      "Operational runbooks",
    ],
    result: "Best for operations teams coordinating work through chat, spreadsheets, and manual checklists.",
    nodes: [
      { label: "Trigger", status: "Event" },
      { label: "Rules", status: "Logic" },
      { label: "Task", status: "Auto" },
      { label: "Approval", status: "Human" },
      { label: "Update", status: "Live" }
    ],
  },
  {
    id: "report",
    label: "ReportOS",
    summary: "Dashboards and operational intelligence.",
    headline: "Turn scattered activity into operating intelligence.",
    description:
      "ReportOS consolidates workflow data into dashboards, recurring reports, operational alerts, and monthly recommendations.",
    problem: "Leadership cannot see what is happening without manual exports and spreadsheet assembly.",
    workflows: ["Health dashboard", "Ops report", "Recommendation queue"],
    recommendedFor: "Teams that need visibility into saved hours, lead flow, automation health, and next improvements.",
    deploymentStyle: "Connected to data sources and maintained as a monthly operating intelligence layer.",
    bullets: [
      "Data source consolidation",
      "Saved hours reporting",
      "Lead flow visibility",
      "Automation health signals",
      "Monthly recommendations",
      "Executive-ready summaries",
    ],
    result: "Best for leadership teams that need reliable operational visibility without manual spreadsheet assembly.",
    nodes: [
      { label: "Sources", status: "Data" },
      { label: "Normalize", status: "Logic" },
      { label: "Metrics", status: "Live" },
      { label: "Dashboard", status: "UI" },
      { label: "Review", status: "Monthly" }
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const tab = TABS[activeTab];

  return (
    <section id="systems" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Control Center</span>
          <h2 className={styles.title}>
            Packaged AI operations systems, configured around your workflows.
          </h2>
        </div>

        <div className={styles.controlCenter}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(i)}
                data-cursor="pointer"
              >
                <span className={styles.tabLabel}>{t.label}</span>
                <span className={styles.tabSummary}>{t.summary}</span>
              </button>
            ))}
          </div>

          {/* Main Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className={styles.panel}
            >
              <div className={styles.panelHeader}>
                <h3 className={styles.headline}>{tab.headline}</h3>
                <p className={styles.description}>{tab.description}</p>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Problem solved</span>
                  <p>{tab.problem}</p>
                </div>
                <div className={styles.detailCard}>
                  <span className={styles.detailLabel}>Recommended for</span>
                  <p>{tab.recommendedFor}</p>
                </div>
              </div>

              {/* Diagram Area */}
              <div className={styles.diagramArea}>
                <div className={styles.diagramGrid} />
                <div className={styles.nodesRow}>
                  {tab.nodes.map((node, idx) => (
                    <div key={idx} className={styles.nodeWrap}>
                      <div className={styles.nodeWrapInner} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className={`${styles.node} ${styles.nodeActive}`}>
                          <span className={styles.nodeStatus}>{node.status}</span>
                          {node.label}
                        </div>
                        {idx < tab.nodes.length - 1 && (
                          <div className={`${styles.connector} ${styles.connectorActive}`} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullets */}
              <div className={styles.workflowStrip}>
                {tab.workflows.map((workflow) => (
                  <span key={workflow}>{workflow}</span>
                ))}
              </div>

              <div className={styles.bulletsGrid}>
                {tab.bullets.slice(0, 4).map((b, i) => (
                  <div key={i} className={styles.bullet}>
                    <span><CheckCircle2 size={16} /></span>
                    {b}
                  </div>
                ))}
              </div>

              <div className={styles.resultLine}>
                <strong>Deployment style:</strong> {tab.deploymentStyle}
                <br />
                {tab.result}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
