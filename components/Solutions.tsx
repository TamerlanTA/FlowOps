"use client";

import { useEffect, useRef, useState } from "react";

import Reveal from "@/components/Reveal";

const STEPS = [
  {
    n: "01",
    t: "Audit",
    d: "Deep dive into your operations, processes, and pain points. We map every manual touchpoint, identify bottlenecks, and calculate the true cost of inefficiency.",
    tags: ["Process mapping", "Pain point analysis", "Cost calculation"],
  },
  {
    n: "02",
    t: "Architecture",
    d: "Blueprint the optimal automation stack for your workflow. System design, tool selection, and a detailed implementation roadmap.",
    tags: ["System design", "Tool selection", "Roadmap creation"],
  },
  {
    n: "03",
    t: "Automation",
    d: "Build and deploy AI-powered automations that run 24/7. Every workflow is tested, documented, and deployed with full monitoring.",
    tags: ["n8n / Make", "AI integration", "24/7 monitoring"],
  },
  {
    n: "04",
    t: "Training",
    d: "Onboard your team to manage and scale the new systems. Hands-on sessions and detailed documentation so your team owns the stack.",
    tags: ["Team onboarding", "Documentation", "Hands-on sessions"],
  },
  {
    n: "05",
    t: "Support",
    d: "Ongoing monitoring, optimization, and dedicated support. We continuously improve your automations as your business evolves.",
    tags: ["Continuous optimization", "Dedicated support", "Performance reviews"],
  },
];

function PipelineCanvas({ activeStep }: { activeStep: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(activeStep);
  activeRef.current = activeStep;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const N = 5;
    const CY = 45;

    interface Pkt { f: number; prog: number; sp: number }
    const pkts: Pkt[] = [];
    for (let i = 0; i < N - 1; i++) {
      setTimeout(() => pkts.push({ f: i, prog: 0, sp: 0.006 + Math.random() * 0.004 }), i * 300);
    }
    const pktTimer = setInterval(() => {
      pkts.push({ f: Math.floor(Math.random() * (N - 1)), prog: 0, sp: 0.005 + Math.random() * 0.006 });
    }, 1000);

    function gx(i: number) {
      return 60 + (i / (N - 1)) * ((canvas?.offsetWidth ?? 600) - 120);
    }
    function bez(t: number, x1: number, x2: number) {
      const cx = (x1 + x2) / 2;
      const mt = 1 - t;
      return { x: mt * mt * x1 + 2 * mt * t * cx + t * t * x2, y: CY + Math.sin(t * Math.PI) * -10 };
    }

    let rafId: number;
    function draw() {
      rafId = requestAnimationFrame(draw);
      if (!canvas || !ctx) return;
      const W = canvas.offsetWidth;
      canvas.width = W * devicePixelRatio;
      canvas.height = 90 * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.clearRect(0, 0, W, 90);
      const active = activeRef.current;

      // Connecting curves
      for (let i = 0; i < N - 1; i++) {
        const x1 = gx(i), x2 = gx(i + 1);
        ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.05) {
          const p = bez(t, x1, x2);
          if (t === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = i < active ? "rgba(0,212,192,0.45)" : "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Packets
      for (let i = pkts.length - 1; i >= 0; i--) {
        const p = pkts[i];
        p.prog += p.sp;
        if (p.prog > 1.05) { pkts.splice(i, 1); continue; }
        const x1 = gx(p.f), x2 = gx(p.f + 1);
        const pos = bez(Math.min(p.prog, 1), x1, x2);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,192,0.95)";
        ctx.shadowColor = "rgba(0,212,192,.8)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Nodes
      for (let i = 0; i < N; i++) {
        const x = gx(i);
        const isA = i === active;
        const isD = i < active;
        const pr = isA ? 20 : 15;

        if (isA) {
          const gr = ctx.createRadialGradient(x, CY, 0, x, CY, 32);
          gr.addColorStop(0, "rgba(0,212,192,0.18)");
          gr.addColorStop(1, "rgba(0,212,192,0)");
          ctx.beginPath();
          ctx.arc(x, CY, 32, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, CY, pr, 0, Math.PI * 2);
        if (isA) {
          const gr = ctx.createLinearGradient(x - pr, CY - pr, x + pr, CY + pr);
          gr.addColorStop(0, "#00d4c0");
          gr.addColorStop(1, "#8b5cf6");
          ctx.fillStyle = gr;
        } else if (isD) {
          ctx.fillStyle = "rgba(0,212,192,0.2)";
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.05)";
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, CY, pr, 0, Math.PI * 2);
        ctx.strokeStyle = isA || isD ? "rgba(0,212,192,0.6)" : "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = isA ? "#fff" : isD ? "rgba(0,212,192,0.85)" : "rgba(255,255,255,0.3)";
        ctx.font = `600 11px 'DM Mono', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`0${i + 1}`, x, CY);
      }
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(pktTimer);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "90px", display: "block" }} />;
}

export default function Solutions() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];

  return (
    <section id="approach" className="relative px-5 py-16 sm:px-6 md:py-24 lg:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
          <Reveal variant="fade">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#8b5cf6] sm:mb-3 sm:text-sm">
              Our Process
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              From chaos to clarity in 5 steps
            </h2>
          </Reveal>
        </div>

        <Reveal variant="fade" delay={200}>
          <div className="mb-2">
            <PipelineCanvas activeStep={activeStep} />
          </div>

          {/* Step labels */}
          <div className="flex justify-around mb-8">
            {STEPS.map((s, i) => (
              <button
                key={s.t}
                onClick={() => setActiveStep(i)}
                className={`flex-1 py-1 text-center rounded-lg transition-all duration-200 hover:bg-white/5 ${i === activeStep ? "text-[#00d4c0]" : "text-[#525270]"}`}
                style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {s.t}
              </button>
            ))}
          </div>

          {/* Detail card */}
          <div
            className="mx-auto max-w-2xl rounded-2xl p-8 transition-all duration-500"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="mb-1 leading-none"
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "clamp(2.5rem,4vw,3.5rem)",
                fontWeight: 800,
                color: "rgba(0,212,192,0.1)",
              }}
            >
              {step.n}
            </div>
            <div className="mb-3 text-[1.4rem] font-extrabold tracking-tight text-white">
              {step.t}
            </div>
            <p className="mb-5 text-[14.5px] leading-[1.75] text-[#525270]">{step.d}</p>
            <div className="flex flex-wrap gap-1.5">
              {step.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-3 py-1 text-[11.5px] font-semibold text-[#00d4c0]"
                  style={{
                    background: "rgba(0,212,192,0.09)",
                    border: "1px solid rgba(0,212,192,0.22)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
