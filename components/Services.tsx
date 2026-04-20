"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import Reveal from "@/components/Reveal";

function SalesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stages = ["New", "Contacted", "Demo", "Closed"];
    let t = 0;
    let rafId: number;
    function draw() {
      rafId = requestAnimationFrame(draw);
      const W = canvas!.offsetWidth;
      canvas!.width = W * devicePixelRatio;
      canvas!.height = 80 * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      ctx!.clearRect(0, 0, W, 80);
      const n = stages.length;
      const stageW = W / n;
      const active = Math.floor((t % 1) * n);
      stages.forEach((label, i) => {
        const x = i * stageW + stageW / 2;
        const isA = i === active;
        const isD = i < active;
        ctx!.beginPath();
        (ctx! as CanvasRenderingContext2D).roundRect(i * stageW + 4, 22, stageW - 8, 36, 5);
        ctx!.fillStyle = isA ? "rgba(0,212,192,0.14)" : isD ? "rgba(0,212,192,0.06)" : "rgba(255,255,255,0.04)";
        ctx!.fill();
        ctx!.strokeStyle = isA ? "rgba(0,212,192,0.5)" : isD ? "rgba(0,212,192,0.2)" : "rgba(255,255,255,0.08)";
        ctx!.lineWidth = 1;
        ctx!.stroke();
        ctx!.fillStyle = isA ? "#00d4c0" : isD ? "rgba(0,212,192,0.55)" : "rgba(255,255,255,0.28)";
        ctx!.font = `600 8.5px 'DM Mono', monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(label.toUpperCase(), x, 40);
      });
      const prog = (t % 1) * n;
      const bx = prog * stageW + stageW / 2;
      ctx!.beginPath();
      ctx!.arc(Math.min(bx, W - 8), 12, 5, 0, Math.PI * 2);
      ctx!.fillStyle = "#00d4c0";
      ctx!.shadowColor = "rgba(0,212,192,0.85)";
      ctx!.shadowBlur = 10;
      ctx!.fill();
      ctx!.shadowBlur = 0;
      t += 0.003;
    }
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "80px", display: "block" }} />;
}

function OpsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const tasks = ["Data Sync", "Report", "Notify", "Archive", "Approve"];
    let t = 0;
    let rafId: number;
    function draw() {
      rafId = requestAnimationFrame(draw);
      const W = canvas!.offsetWidth;
      canvas!.width = W * devicePixelRatio;
      canvas!.height = 80 * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      ctx!.clearRect(0, 0, W, 80);
      const barH = 8;
      const gap = 6;
      const labelW = 52;
      const totalH = tasks.length * (barH + gap) - gap;
      const startY = (80 - totalH) / 2;
      tasks.forEach((task, i) => {
        const y = startY + i * (barH + gap);
        const pct = Math.min(1, Math.max(0, (t * 0.65) - i * 0.11));
        const done = pct >= 1;
        ctx!.beginPath();
        (ctx! as CanvasRenderingContext2D).roundRect(labelW, y, W - labelW - 2, barH, 3);
        ctx!.fillStyle = "rgba(255,255,255,0.05)";
        ctx!.fill();
        if (pct > 0) {
          ctx!.beginPath();
          (ctx! as CanvasRenderingContext2D).roundRect(labelW, y, (W - labelW - 2) * pct, barH, 3);
          ctx!.fillStyle = done ? "rgba(0,212,192,0.65)" : "rgba(139,92,246,0.65)";
          ctx!.fill();
        }
        ctx!.fillStyle = done ? "rgba(0,212,192,0.9)" : "rgba(255,255,255,0.38)";
        ctx!.font = `500 8px 'DM Mono', monospace`;
        ctx!.textAlign = "left";
        ctx!.textBaseline = "middle";
        ctx!.fillText((done ? "✓ " : "") + task, 0, y + barH / 2);
      });
      t += 0.012;
      if (t > 2.5) t = 0;
    }
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "80px", display: "block" }} />;
}

function AiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const layers = [3, 4, 3];
    let t = 0;
    let rafId: number;
    function draw() {
      rafId = requestAnimationFrame(draw);
      const W = canvas!.offsetWidth;
      canvas!.width = W * devicePixelRatio;
      canvas!.height = 80 * devicePixelRatio;
      ctx!.scale(devicePixelRatio, devicePixelRatio);
      ctx!.clearRect(0, 0, W, 80);
      const layerX = layers.map((_, li) => 20 + li * ((W - 40) / (layers.length - 1)));
      const positions = layers.map((count, li) =>
        Array.from({ length: count }, (_, ni) => ({ x: layerX[li], y: (80 / (count + 1)) * (ni + 1) }))
      );
      for (let li = 0; li < layers.length - 1; li++) {
        for (let ni = 0; ni < layers[li]; ni++) {
          for (let nj = 0; nj < layers[li + 1]; nj++) {
            const a = positions[li][ni];
            const b = positions[li + 1][nj];
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = "rgba(139,92,246,0.1)";
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
            const phase = ((t + (li * layers[li] + ni * layers[li + 1] + nj) * 0.13) % 1);
            const px = a.x + (b.x - a.x) * phase;
            const py = a.y + (b.y - a.y) * phase;
            ctx!.beginPath();
            ctx!.arc(px, py, 2, 0, Math.PI * 2);
            ctx!.fillStyle = "rgba(139,92,246,0.85)";
            ctx!.shadowColor = "rgba(139,92,246,0.9)";
            ctx!.shadowBlur = 6;
            ctx!.fill();
            ctx!.shadowBlur = 0;
          }
        }
      }
      positions.forEach((layer, li) => {
        layer.forEach((node) => {
          const pulse = 0.7 + Math.sin(t * 3 + li * 1.2) * 0.3;
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, 5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(139,92,246,${0.14 * pulse})`;
          ctx!.fill();
          ctx!.strokeStyle = `rgba(139,92,246,${0.65 * pulse})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        });
      });
      t += 0.006;
    }
    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "80px", display: "block" }} />;
}

function useTilt(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(16px)`;
    };
    const onLeave = () => { el.style.transform = ""; };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
}

const CANVAS_COMPONENTS = [SalesCanvas, OpsCanvas, AiCanvas];

const services = [
  {
    title: "Sales Automation",
    description: "CRM automation and AI workflow systems for lead capture, follow-ups, and pipeline execution.",
    features: [
      "CRM integration and auto-sync",
      "Lead scoring with AI",
      "Automated follow-up sequences",
      "Pipeline analytics dashboard",
      "WhatsApp and email nurturing",
    ],
  },
  {
    title: "Operations Automation",
    description: "Business process automation and operational optimization for reporting, approvals, and team coordination.",
    features: [
      "Task and project automation",
      "Automated reporting",
      "Inventory management",
      "Team notification systems",
      "Document generation",
    ],
  },
  {
    title: "AI Upgrade",
    description: "Automation systems architecture and business system design for practical AI deployment.",
    features: [
      "Custom AI chatbots",
      "Intelligent data analysis",
      "Predictive forecasting",
      "Natural language processing",
      "AI-powered decision support",
    ],
  },
];

function ServiceCard({ service, index }: { service: (typeof services)[number]; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  useTilt(cardRef);
  const CanvasComponent = CANVAS_COMPONENTS[index];
  return (
    <article
      ref={cardRef}
      className="group relative flex h-full flex-col rounded-2xl liquid-glass prismatic-edge sm:rounded-3xl"
      style={{ willChange: "transform", transition: "transform 0.15s ease" }}
    >
      <div className="overflow-hidden rounded-t-2xl border-b border-white/[0.06] sm:rounded-t-3xl">
        <CanvasComponent />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl">{service.title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-slate-300 sm:mb-6">{service.description}</p>
        <ul className="mb-6 flex-1 space-y-2.5 sm:mb-8 sm:space-y-3">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-slate-200/90">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[rgba(0,212,192,0.1)]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#00d4c0]" aria-hidden="true">
                  <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href="/#contact"
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 liquid-btn sm:rounded-2xl active:scale-[0.98]"
        >
          Get Started
          <svg className="ml-2" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#00d4c0] sm:mb-3 sm:text-sm">
              Services
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Solutions built for growth
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-3 text-sm text-slate-300 sm:mt-4 sm:text-base">
              End-to-end automation consulting services designed around business
              outcomes and measurable process optimization.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-3 text-sm text-slate-300">
              Review our{" "}
              <Link href="/approach" className="text-[#00d4c0] transition hover:text-[rgba(0,212,192,0.8)]">
                architecture framework
              </Link>{" "}
              or inspect{" "}
              <Link href="/cases" className="text-[#00d4c0] transition hover:text-[rgba(0,212,192,0.8)]">
                case studies
              </Link>{" "}
              for implementation details.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} variant="up" index={index} staggerBase={150}>
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
