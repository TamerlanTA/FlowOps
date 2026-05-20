"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { Plus } from "lucide-react";
import styles from "./FAQSection.module.css";

const FAQS = [
  {
    q: "What is the free AI Operations Audit?",
    a: "It is a structured review of your workflows, tools, handoffs, reporting gaps, and manual work. The output is a workflow map, automation opportunity list, ROI estimate, recommended FlowOps OS systems, and an implementation roadmap.",
  },
  {
    q: "Is FlowOps OS a software product or a service?",
    a: "This first version is a productized AI operations offer: packaged systems, a clear audit-to-deploy process, and recurring operations subscriptions. It is intentionally presented like an operations platform, without adding a backend or real client portal yet.",
  },
  {
    q: "Which systems can we start with?",
    a: "Most teams start with LeadOS, SalesOS, VoiceOS, InboxOS, OpsOS, or ReportOS. The audit determines which system has the clearest operational value and lowest implementation risk.",
  },
  {
    q: "Do you replace our existing tools?",
    a: "Usually no. FlowOps OS is designed as an operating layer around the tools already in place: CRM, inbox, forms, phones, spreadsheets, dashboards, project management, support tools, and internal chat.",
  },
  {
    q: "Why are subscriptions part of the offer?",
    a: "Operations change after launch. Fields are renamed, lead sources shift, teams change handoffs, and exceptions appear. The subscription keeps systems maintained, improved, and aligned with the business.",
  },
  {
    q: "Do we need a developer or technical team?",
    a: "No. The work is designed for operators and leadership teams. FlowOps handles the system design, implementation, documentation, and ongoing operating rhythm.",
  },
  {
    q: "How is this different from hiring a developer or buying another no-code platform?",
    a: "A developer builds what you specify. A platform gives you more tools. FlowOps starts from the operating problem, maps the workflow, recommends the right system, deploys it, and maintains it as part of a recurring AI operations model.",
  },
  {
    q: "Can you audit a process we already tried to automate?",
    a: "Yes — this is actually one of our most common starting points. Failed automations usually fail because of poor architecture, not bad tooling. We audit what was built, identify why it broke, and redesign from the right foundation.",
  },
  {
    q: "How do we start?",
    a: "Request the free audit. Share the workflow, tools, and manual bottlenecks. FlowOps reviews the snapshot and responds with the next step within one business day.",
  },
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.heading}`,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.heading}`, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Side */}
          <div className={styles.heading}>
              <span className={styles.eyebrow}>Knowledge Base</span>
              <h2 className={styles.title}>FlowOps OS FAQ</h2>
              <p className={styles.description}>
              Answers for teams evaluating FlowOps as an AI operations layer rather than a one-off automation vendor.
            </p>
          </div>

          {/* Right Side: Accordion */}
          <div className={styles.panel}>
            <div className={styles.accordion}>
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}
                >
                  <button
                    className={styles.trigger}
                    onClick={() => setOpen(open === i ? null : i)}
                    data-cursor="pointer"
                  >
                    <span className={`${styles.question} ${open === i ? styles.questionActive : ""}`}>
                      {faq.q}
                    </span>
                    <Plus className={`${styles.icon} ${open === i ? styles.iconActive : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        className={styles.answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={styles.answerInner}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
