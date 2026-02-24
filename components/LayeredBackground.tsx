"use client";

import { useEffect, useRef, useState } from "react";

export default function LayeredBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");

    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    let ticking = false;

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        if (!containerRef.current) {
          ticking = false;
          return;
        }

        const y = window.scrollY;
        const layers = containerRef.current.querySelectorAll<HTMLElement>("[data-speed]");
        layers.forEach((layer) => {
          const speed = Number.parseFloat(layer.dataset.speed ?? "0");
          layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 35%, #141a2e 0%, #0c1020 70%, #070a14 100%)",
        }}
      />

      <div
        data-speed="-0.02"
        className="absolute hidden rounded-full sm:block"
        style={{
          top: "-10%",
          left: "-8%",
          height: "80vh",
          width: "80vh",
          background:
            "radial-gradient(circle, rgba(40, 70, 160, 0.16) 0%, transparent 65%)",
          filter: "blur(120px)",
        }}
      />

      <div
        data-speed="-0.025"
        className="absolute hidden rounded-full sm:block"
        style={{
          top: "15%",
          right: "-5%",
          height: "65vh",
          width: "65vh",
          background:
            "radial-gradient(circle, rgba(50, 50, 140, 0.12) 0%, transparent 60%)",
          filter: "blur(110px)",
        }}
      />

      <div
        data-speed="-0.015"
        className="absolute hidden rounded-full sm:block"
        style={{
          bottom: "-5%",
          left: "20%",
          height: "50vh",
          width: "70vh",
          background:
            "radial-gradient(ellipse, rgba(30, 50, 120, 0.09) 0%, transparent 60%)",
          filter: "blur(100px)",
        }}
      />

      <div
        className="absolute rounded-full sm:hidden"
        style={{
          top: "5%",
          left: "10%",
          height: "60vh",
          width: "80vw",
          background:
            "radial-gradient(circle, rgba(40, 70, 160, 0.1) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      <div
        data-speed="-0.04"
        className="absolute"
        style={{
          top: "8%",
          left: "52%",
          transform: "translateX(-50%)",
          height: "55vh",
          width: "60vw",
          maxWidth: "900px",
          background:
            "radial-gradient(ellipse 70% 60% at 55% 45%, rgba(60, 100, 220, 0.10) 0%, rgba(40, 70, 170, 0.03) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <svg
        data-speed="-0.03"
        className="absolute inset-0 hidden h-full w-full sm:block"
        style={{ opacity: 0.035 }}
        viewBox="0 0 1440 3000"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-50 400 Q 360 380, 720 420 T 1490 390"
          stroke="rgba(100,160,255,0.9)"
          strokeWidth="0.8"
          fill="none"
        />
        <path
          d="M200 100 Q 500 600, 800 800 T 1300 1400"
          stroke="rgba(90,140,240,0.8)"
          strokeWidth="0.6"
          fill="none"
        />
        <path
          d="M-100 1200 Q 400 1100, 720 1250 T 1500 1150"
          stroke="rgba(80,130,230,0.7)"
          strokeWidth="0.7"
          fill="none"
        />
        <path
          d="M1100 0 Q 1080 800, 1120 1600 T 1060 3000"
          stroke="rgba(70,110,210,0.6)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M50 2000 Q 500 1900, 900 2050 T 1450 1980"
          stroke="rgba(80,130,230,0.7)"
          strokeWidth="0.6"
          fill="none"
        />
        <circle cx="720" cy="420" r="2" fill="rgba(100,160,255,0.35)" />
        <circle cx="800" cy="800" r="1.5" fill="rgba(100,160,255,0.25)" />
        <circle cx="720" cy="1250" r="2" fill="rgba(90,140,240,0.25)" />
        <circle cx="900" cy="2050" r="1.5" fill="rgba(90,140,240,0.2)" />
      </svg>

      <div
        data-speed="-0.01"
        className="absolute inset-0 hidden sm:block"
        style={{
          maskImage:
            "radial-gradient(ellipse 55% 45% at 50% 35%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 45% at 50% 35%, black 0%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.04,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(6,9,18,0.6) 100%)",
        }}
      />

      <div
        className="absolute left-0 right-0 top-0 h-32"
        style={{ background: "linear-gradient(to bottom, rgba(8,12,24,0.5), transparent)" }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: "linear-gradient(to top, rgba(6,9,18,0.4), transparent)" }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}
