"use client";

import { useEffect, useRef } from "react";

const TEAL: [number, number, number] = [0, 212, 192];
const VIOLET: [number, number, number] = [139, 92, 246];

interface NodeObj {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  col: [number, number, number];
  ph: number;
  lit: number;
  update(mx: number, my: number, W: number, H: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

function makeNode(W: number, H: number): NodeObj {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() > 0.82 ? 4.5 : Math.random() > 0.55 ? 3 : 1.8,
    col: Math.random() > 0.62 ? TEAL : VIOLET,
    ph: Math.random() * Math.PI * 2,
    lit: 0,
    update(mx, my, W, H) {
      this.ph += 0.018;
      this.lit = Math.max(0, this.lit - 0.025);
      const dx = mx - this.x;
      const dy = my - this.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 240 && d > 0) {
        this.x += (dx / d) * ((240 - d) / 240) * 0.5;
        this.y += (dy / d) * ((240 - d) / 240) * 0.5;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -60) this.x = W + 60;
      if (this.x > W + 60) this.x = -60;
      if (this.y < -60) this.y = H + 60;
      if (this.y > H + 60) this.y = -60;
    },
    draw(ctx) {
      const [r, g, b] = this.col;
      const pr = this.r + Math.sin(this.ph) * 0.5;
      const gl = 0.65 + this.lit * 0.35;
      const gr = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, pr * 5);
      gr.addColorStop(0, `rgba(${r},${g},${b},${0.17 * gl})`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, pr * 5, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, pr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${gl})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x, this.y, pr * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.5 * gl})`;
      ctx.fill();
    },
  };
}

interface PacketObj {
  f: number;
  to: number;
  t: number;
  sp: number;
  col: [number, number, number];
  tr: { x: number; y: number }[];
}

function makePkt(nodes: NodeObj[], edges: [number, number][]): PacketObj {
  const e = edges[Math.floor(Math.random() * edges.length)];
  return { f: e[0], to: e[1], t: 0, sp: 0.003 + Math.random() * 0.005, col: Math.random() > 0.5 ? TEAL : VIOLET, tr: [] };
}

function buildEdges(nodes: NodeObj[], th = 195): [number, number][] {
  const e: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < th) {
        e.push([i, j]);
        if (e.length >= 90) return e;
      }
    }
  return e;
}

export default function LayeredBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const nodes: NodeObj[] = Array.from({ length: 42 }, () => makeNode(W, H));
    let edges = buildEdges(nodes);
    const edgeTimer = setInterval(() => { edges = buildEdges(nodes); }, 3500);

    let pkts: PacketObj[] = [];
    if (edges.length) pkts = Array.from({ length: 26 }, () => makePkt(nodes, edges));

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    let rafId: number;
    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const heroFade = Math.max(0.18, 1 - scrollY / (H * 0.65));
      canvas.style.opacity = String(heroFade);

      ctx.fillStyle = "rgba(6,6,14,.17)";
      ctx.fillRect(0, 0, W, H);

      nodes.forEach((n) => n.update(mouse.x, mouse.y, W, H));

      // Renew dead packets
      pkts = pkts.filter((p) => p.t <= 1.05);
      while (pkts.length < 26 && edges.length) pkts.push(makePkt(nodes, edges));

      // Draw edges
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const al = (1 - d / 195) * 0.12;
        const cx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18;
        const cy = (a.y + b.y) / 2 - (b.x - a.x) * 0.18;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.strokeStyle = `rgba(100,175,210,${al})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // Draw packets
      pkts.forEach((p) => {
        p.t += p.sp;
        const e = edges.find(([f, t]) => f === p.f && t === p.to) ?? [p.f, p.to];
        const a = nodes[e[0]];
        const b = nodes[e[1]];
        const t = Math.min(p.t, 1);
        const cx = (a.x + b.x) / 2 + (b.y - a.y) * 0.18;
        const cy = (a.y + b.y) / 2 - (b.x - a.x) * 0.18;
        const mt = 1 - t;
        const px = mt * mt * a.x + 2 * mt * t * cx + t * t * b.x;
        const py = mt * mt * a.y + 2 * mt * t * cy + t * t * b.y;
        p.tr.unshift({ x: px, y: py });
        if (p.tr.length > 14) p.tr.pop();

        if (p.tr.length >= 2) {
          const [r, g, bb] = p.col;
          for (let i = 1; i < p.tr.length; i++) {
            const alpha = (1 - i / p.tr.length) * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.tr[i - 1].x, p.tr[i - 1].y);
            ctx.lineTo(p.tr[i].x, p.tr[i].y);
            ctx.strokeStyle = `rgba(${r},${g},${bb},${alpha})`;
            ctx.lineWidth = 1.5 * (1 - i / p.tr.length);
            ctx.stroke();
          }
          const head = p.tr[0];
          ctx.beginPath();
          ctx.arc(head.x, head.y, 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${bb},1)`;
          ctx.shadowColor = `rgba(${r},${g},${bb},.9)`;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (p.t >= 1) {
          nodes[p.to].lit = 1;
          if (edges.length) {
            const ne = edges[Math.floor(Math.random() * edges.length)];
            p.f = ne[0]; p.to = ne[1]; p.t = 0; p.sp = 0.003 + Math.random() * 0.005; p.tr = [];
          }
        }
      });

      nodes.forEach((n) => n.draw(ctx));

      // Vignette
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.9);
      vg.addColorStop(0, "rgba(6,6,14,0)");
      vg.addColorStop(1, "rgba(6,6,14,.72)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(edgeTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
