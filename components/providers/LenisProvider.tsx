"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

type LenisContextValue = Lenis | null;

const LenisContext = createContext<LenisContextValue>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<LenisContextValue>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchLikeViewport =
      window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 767px)").matches;

    if (reduceMotion || touchLikeViewport) {
      return undefined;
    }

    const lenisInstance = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    lenisInstance.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const stateFrame = requestAnimationFrame(() => {
      setLenis(lenisInstance);
    });

    return () => {
      cancelAnimationFrame(stateFrame);
      lenisInstance.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
