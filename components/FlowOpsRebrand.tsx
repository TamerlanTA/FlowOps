"use client";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Cpu,
  Database,
  Gauge,
  Mail,
  Menu,
  Network,
  Play,
  Radar,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type RevenueRange =
  | "Under $250k"
  | "$250k - $1M"
  | "$1M - $5M"
  | "$5M - $20M"
  | "$20M+";

type ContactState = "idle" | "sending" | "success" | "error";

const navItems = [
  { label: "Offers", href: "#offers" },
  { label: "Cases", href: "#cases" },
  { label: "Method", href: "#method" },
  { label: "Contact", href: "#contact" },
] as const;

const stack = ["n8n", "Make", "OpenAI", "Shopify", "Telegram API", "Google Cloud"] as const;

const pains = [
  "Leads disappear between WhatsApp, forms, email, and CRM.",
  "Reports are rebuilt manually in spreadsheets every week.",
  "Operations depend on specific people remembering handoffs.",
  "AI is discussed often, but rarely wired into daily execution.",
] as const;

const niches = [
  { label: "Service businesses", icon: Gauge },
  { label: "Agencies", icon: Network },
  { label: "E-commerce", icon: Database },
  { label: "Clinics & Coaches", icon: ShieldCheck },
  { label: "Real estate", icon: Radar },
  { label: "Startups", icon: Sparkles },
] as const;

const offers = [
  {
    title: "Speed-to-Lead System",
    icon: Zap,
    price: "from $750+",
    summary:
      "Every new lead gets an instant AI-powered response, CRM update, and automatic follow-up sequence - before your team even opens their laptop.",
    points: ["AI lead qualification", "Automatic CRM updates", "Follow-up sequences"],
  },
  {
    title: "Ops Automation Sprint",
    icon: Network,
    price: "from $1,000+",
    summary:
      "In one week, we eliminate one repetitive workflow from your team's plate - data entry, handoffs, reports, approvals.",
    points: ["Process mapping & design", "n8n / Make implementation", "Delivered in 5-7 business days"],
  },
  {
    title: "AI Chatbot & Voice Agent",
    icon: Bot,
    price: "from $1,500+",
    summary:
      "Your business answers, qualifies, and routes leads 24/7 - without adding a single person to the team.",
    points: ["24/7 AI responses", "Booking & CRM integration", "WhatsApp, website, voice channels"],
  },
  {
    title: "Long-Term Partner Retainer",
    icon: ShieldCheck,
    price: "from $500+/month",
    summary:
      "After your first sprint, we stay as your dedicated automation partner - adding systems, monitoring performance, and scaling with your business.",
    points: ["Ongoing automation builds", "System monitoring & support", "Priority delivery"],
  },
] as const;

const cases = [
  {
    title: "WhatsApp AI Bot + CRM Sync",
    problem: "Inbound chats were fast, but qualification and CRM updates were manual.",
    flow: ["WhatsApp", "AI qualify", "Kommo CRM", "Manager alert"],
    result: "Faster response, cleaner pipeline, fewer missed opportunities.",
  },
  {
    title: "Shopify Orders to Operations",
    problem: "Order work moved through Slack, spreadsheets, and repeated manual checks.",
    flow: ["Shopify", "Rules engine", "ClickUp", "Slack report"],
    result: "Every order becomes an assigned operational workflow automatically.",
  },
  {
    title: "Lead Research Pipeline",
    problem: "Research, scoring, and outreach prep consumed hours before sales could act.",
    flow: ["Source list", "AI research", "Score", "Draft outreach"],
    result: "Sales receives ranked leads with context and ready-to-edit messages.",
  },
] as const;

const method = [
  "Process audit",
  "System architecture",
  "Automation deployment",
  "Team training",
  "Ongoing support",
] as const;

const revenueRanges: RevenueRange[] = [
  "Under $250k",
  "$250k - $1M",
  "$1M - $5M",
  "$5M - $20M",
  "$20M+",
];

function EngineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const particles = Array.from({ length: reduceMotion ? 18 : 72 }, (_, index) => ({
      lane: index % 6,
      phase: index * 0.41,
      speed: 0.003 + (index % 8) * 0.0005,
      size: 1 + (index % 3) * 0.7,
    }));

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 1;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#050507";
      context.fillRect(0, 0, width, height);

      const cx = width * 0.5 + pointer.x * 28;
      const cy = height * 0.5 + pointer.y * 18;
      const horizon = height * 0.62;

      context.strokeStyle = "rgba(255,255,255,0.055)";
      context.lineWidth = 1;
      for (let x = -width; x < width * 2; x += 56) {
        context.beginPath();
        context.moveTo(cx, horizon);
        context.lineTo(x + pointer.x * 32, height);
        context.stroke();
      }
      for (let y = 0; y < 12; y += 1) {
        const yy = horizon + y * y * 7;
        context.beginPath();
        context.moveTo(0, yy);
        context.lineTo(width, yy);
        context.stroke();
      }

      const bands = [
        { rx: width * 0.36, ry: height * 0.09, color: "rgba(78,255,178,0.34)" },
        { rx: width * 0.48, ry: height * 0.14, color: "rgba(255,201,87,0.24)" },
        { rx: width * 0.62, ry: height * 0.2, color: "rgba(117,210,255,0.2)" },
      ];

      bands.forEach((band, index) => {
        context.save();
        context.translate(cx, cy + index * 24);
        context.rotate((index - 1) * 0.09 + pointer.x * 0.025);
        context.beginPath();
        context.ellipse(0, 0, band.rx, band.ry, 0, Math.PI * 1.04, Math.PI * 1.96);
        context.strokeStyle = band.color;
        context.shadowColor = band.color;
        context.shadowBlur = 18;
        context.lineWidth = 1.4;
        context.stroke();
        context.restore();
      });

      particles.forEach((particle, index) => {
        const band = bands[particle.lane % bands.length];
        const angle = particle.phase + frame * particle.speed;
        const depth = (Math.sin(angle) + 1) / 2;
        const x = cx + Math.cos(angle) * band.rx + pointer.x * (index % 9);
        const y = cy + (particle.lane - 2.5) * 16 + Math.sin(angle) * band.ry + pointer.y * (index % 7);
        const alpha = 0.2 + depth * 0.62;

        context.beginPath();
        context.arc(x, y, particle.size + depth, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.shadowColor = band.color;
        context.shadowBlur = 16;
        context.fill();
        context.shadowBlur = 0;
      });

      const nodes = [
        { x: width * 0.22, y: height * 0.48, label: "inputs", color: "#4effb2" },
        { x: width * 0.5, y: height * 0.39, label: "ai layer", color: "#ffc957" },
        { x: width * 0.78, y: height * 0.48, label: "outputs", color: "#75d2ff" },
      ];

      nodes.forEach((node, index) => {
        if (index > 0) {
          const prev = nodes[index - 1];
          const gradient = context.createLinearGradient(prev.x, prev.y, node.x, node.y);
          gradient.addColorStop(0, "rgba(255,255,255,0.08)");
          gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
          gradient.addColorStop(1, "rgba(255,255,255,0.08)");
          context.beginPath();
          context.moveTo(prev.x, prev.y);
          context.bezierCurveTo(prev.x + 90, prev.y - 90, node.x - 90, node.y - 90, node.x, node.y);
          context.strokeStyle = gradient;
          context.lineWidth = 1.2;
          context.stroke();
        }

        context.beginPath();
        context.arc(node.x + pointer.x * 10, node.y + pointer.y * 6, 8 + Math.sin(frame * 0.025 + index) * 1.2, 0, Math.PI * 2);
        context.fillStyle = node.color;
        context.shadowColor = node.color;
        context.shadowBlur = 28;
        context.fill();
        context.shadowBlur = 0;
      });

      if (!reduceMotion) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove);
    draw();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="engine-canvas" aria-hidden="true" />;
}

function ContactForm() {
  const [state, setState] = useState<ContactState>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      businessType: String(formData.get("businessType") ?? ""),
      revenueRange: String(formData.get("revenueRange") ?? ""),
      problemDescription: String(formData.get("problemDescription") ?? ""),
      email: String(formData.get("email") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      setState("success");
      event.currentTarget.reset();
    } catch {
      setState("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input name="name" required minLength={2} placeholder="Tamerlan" />
        </label>
        <label>
          <span>Company</span>
          <input name="company" required minLength={2} placeholder="FlowOps" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@company.com" />
        </label>
        <label>
          <span>WhatsApp</span>
          <input name="whatsapp" required placeholder="+7 777 000 00 00" />
        </label>
      </div>
      <div className="form-grid">
        <label>
          <span>Business type</span>
          <input name="businessType" required minLength={2} placeholder="E-commerce, SaaS, services..." />
        </label>
        <label>
          <span>Revenue range</span>
          <select name="revenueRange" required defaultValue="$250k - $1M">
            {revenueRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>What should the system automate?</span>
        <textarea
          name="problemDescription"
          required
          minLength={20}
          placeholder="Describe the workflow, tools, handoffs, bottlenecks, and desired output."
        />
      </label>
      <button className="primary-button full" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending request..." : "Request automation audit"}
        <Send aria-hidden="true" />
      </button>
      {state === "success" ? (
        <p className="form-status success">Request received. FlowOps will contact you within one business day.</p>
      ) : null}
      {state === "error" ? (
        <p className="form-status error">The form could not send right now. Check env variables or try again.</p>
      ) : null}
    </form>
  );
}

export default function FlowOpsRebrand() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site-shell">
      <EngineCanvas />

      <header className="site-nav">
        <Link href="/" className="brand" aria-label="FlowOps home">
          <span className="brand-mark">F</span>
          <span>FlowOps</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="#contact">
          Request free audit
        </Link>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu aria-hidden="true" />
        </button>
      </header>

      {menuOpen ? (
        <div className="mobile-menu">
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X aria-hidden="true" />
          </button>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            AI Automation Agency
          </p>
          <h1>Stop losing leads. Stop burning hours on manual work.</h1>
          <p className="hero-lead">
            FlowOps builds AI-powered automation systems for service businesses, agencies, and
            e-commerce teams. We start with a free audit, deliver a working system in 5-7 days,
            and stay as your long-term automation partner.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#contact">
              Request free audit
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="secondary-button" href="#cases">
              <Play aria-hidden="true" />
              View real systems
            </Link>
          </div>
        </div>
      </section>

      <section className="strip">
        {stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="section two-column" id="systems">
        <div>
          <p className="eyebrow">
            <span />
            Systems, not tasks
          </p>
          <h2>We replace manual chains with operating systems.</h2>
        </div>
        <div className="problem-grid">
          {pains.map((pain, index) => (
            <article className="sharp-card" key={pain}>
              <span className="card-index">0{index + 1}</span>
              <p>{pain}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section niches-section">
        <div className="section-head">
          <p className="eyebrow">
            <span />
            Who we help
          </p>
          <h2>Built for teams where speed and follow-up matter.</h2>
        </div>
        <div className="niche-grid">
          {niches.map((niche) => {
            const Icon = niche.icon;
            return (
              <div className="niche-chip" key={niche.label}>
                <Icon aria-hidden="true" />
                {niche.label}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section" id="offers">
        <div className="section-head">
          <p className="eyebrow">
            <span />
            Offers
          </p>
          <h2>Four offers. One operating model.</h2>
        </div>
        <div className="service-grid offers-grid">
          {offers.map((offer) => {
            const Icon = offer.icon;
            return (
              <article className="service-card" key={offer.title}>
                <Icon aria-hidden="true" />
                <div className="offer-header">
                  <h3>{offer.title}</h3>
                  <span className="offer-price">{offer.price}</span>
                </div>
                <p>{offer.summary}</p>
                <ul>
                  {offer.points.map((point) => (
                    <li key={point}>
                      <Check aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" id="cases">
        <div className="section-head">
          <p className="eyebrow">
            <span />
            Real systems
          </p>
          <h2>Concrete automation architectures for real operations.</h2>
        </div>
        <div className="case-grid">
          {cases.map((item) => (
            <article className="case-card" key={item.title}>
              <div>
                <Radar aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.problem}</p>
              </div>
              <div className="case-flow">
                {item.flow.map((step, index) => (
                  <span key={step}>
                    {step}
                    {index < item.flow.length - 1 ? <ChevronRight aria-hidden="true" /> : null}
                  </span>
                ))}
              </div>
              <strong>{item.result}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section method-section" id="method">
        <div>
          <p className="eyebrow">
            <span />
            Method
          </p>
          <h2>From messy process to deployed system.</h2>
          <p>
            FlowOps audits the workflow, maps the architecture, builds the automation,
            trains the team, and keeps the system stable after launch.
          </p>
        </div>
        <div className="timeline">
          {method.map((step, index) => (
            <div className="timeline-step" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section proof-section">
        <div className="proof-item">
          <Cpu aria-hidden="true" />
          <strong>AI assistants</strong>
          <span>support, sales, document processing</span>
        </div>
        <div className="proof-item">
          <Database aria-hidden="true" />
          <strong>Data pipelines</strong>
          <span>CRM, sheets, stores, dashboards</span>
        </div>
        <div className="proof-item">
          <Gauge aria-hidden="true" />
          <strong>Operational KPIs</strong>
          <span>response time, accuracy, saved hours</span>
        </div>
        <div className="proof-item">
          <ShieldCheck aria-hidden="true" />
          <strong>Rollout support</strong>
          <span>training, docs, monitoring</span>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">
            <span />
            Start
          </p>
          <h2>Send the workflow. Get the system plan.</h2>
          <p>
            Request a practical automation audit for your business. Include the tools,
            channels, reports, handoffs, and repetitive work you want removed.
          </p>
          <div className="contact-chips">
            <span>
              <Zap aria-hidden="true" />
              We&apos;ll reach out within 1 hour
            </span>
            <span>
              <Mail aria-hidden="true" />
              Audit request pipeline preserved
            </span>
            <span>
              <Sparkles aria-hidden="true" />
              AI-ready architecture
            </span>
          </div>
        </div>
        <ContactForm />
      </section>

      <footer className="site-footer">
        <span>FlowOps</span>
        <p>AI automation systems for real operations.</p>
        <Link href="#top">Back to top</Link>
      </footer>
    </main>
  );
}
