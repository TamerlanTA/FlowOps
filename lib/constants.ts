export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Cases", href: "/cases" },
  { label: "Contact", href: "/contact" },
] as const;

export const PAIN_POINTS = [
  "Leads are lost",
  "Manual repetitive tasks",
  "No real-time analytics",
  "Reports built in Excel manually",
  "Processes depend on specific employees",
] as const;

export const SOLUTION_STEPS = [
  "Process Audit",
  "System Architecture",
  "Automation Deployment",
  "Team Training",
  "Ongoing Support",
] as const;

export const SERVICES = [
  {
    title: "Sales Automation",
    description:
      "Design and implementation of lead capture, qualification, and follow-up systems that reduce response times and increase conversion consistency.",
    features: [
      "Automated lead routing and enrichment",
      "CRM pipeline workflow automation",
      "Follow-up sequences across email and messengers",
      "Conversion dashboards with live KPIs",
    ],
    ctaLabel: "Request Sales Audit",
  },
  {
    title: "Operations Automation",
    description:
      "Workflow architecture for internal operations, approvals, reporting, and handoffs to reduce manual load across teams.",
    features: [
      "Task and approval workflow orchestration",
      "Automated reporting and notifications",
      "Internal process documentation in AI copilots",
      "Integration between ERP, CRM, and support tools",
    ],
    ctaLabel: "Optimize Operations",
  },
  {
    title: "AI Upgrade",
    description:
      "Practical AI implementation for existing systems with controlled rollout, staff onboarding, and measurable business outcomes.",
    features: [
      "AI assistants for support and sales",
      "Document processing and knowledge retrieval",
      "Predictive insights for management",
      "Model governance and prompt standards",
    ],
    ctaLabel: "Plan AI Upgrade",
  },
] as const;

export const CASES = [
  {
    company: "B2B Electronics Distributor",
    problem:
      "Leads were captured across multiple channels with no centralized qualification process, causing slow response and lost opportunities.",
    implementation:
      "Built a unified lead intake pipeline in CRM, automated qualification scoring, and launched instant sales team routing with escalation alerts.",
    results: [
      "37% faster lead response",
      "24% increase in qualified meetings",
      "11 hours saved weekly per sales manager",
    ],
  },
  {
    company: "Regional Retail Network",
    problem:
      "Store-level operational reports were assembled manually in spreadsheets, delaying decisions and creating data inconsistencies.",
    implementation:
      "Integrated POS and inventory systems with automated data sync, scheduled KPI dashboards, and anomaly notifications for regional teams.",
    results: [
      "68% reduction in reporting effort",
      "95% reporting accuracy across locations",
      "2-day faster management decision cycle",
    ],
  },
] as const;

export const TECHNOLOGIES = [
  "Make",
  "n8n",
  "OpenAI",
  "Shopify",
  "Telegram API",
  "Google Cloud",
] as const;

export const REVENUE_RANGES = [
  "Under $250k",
  "$250k - $1M",
  "$1M - $5M",
  "$5M - $20M",
  "$20M+",
] as const;
