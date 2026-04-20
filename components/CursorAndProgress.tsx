"use client";

import { useEffect, useRef } from "react";

export default function CursorAndProgress() {
  const cdRef = useRef<HTMLDivElement>(null);
  const crRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const rxRef = useRef(0);
  const ryRef = useRef(0);
  const mxRef = useRef(0);
  const myRef = useRef(0);

  useEffect(() => {
    const cd = cdRef.current;
    const cr = crRef.current;
    const prog = progRef.current;
    if (!cd || !cr || !prog) return;

    const onMouseMove = (e: MouseEvent) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
      cd.style.left = e.clientX + "px";
      cd.style.top = e.clientY + "px";
    };

    const onScroll = () => {
      const docH = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (window.scrollY / docH * 100) + "%";
    };

    let rafId: number;
    const animCursor = () => {
      rxRef.current += (mxRef.current - rxRef.current) * 0.12;
      ryRef.current += (myRef.current - ryRef.current) * 0.12;
      cr.style.left = rxRef.current + "px";
      cr.style.top = ryRef.current + "px";
      rafId = requestAnimationFrame(animCursor);
    };
    rafId = requestAnimationFrame(animCursor);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="scroll-prog" ref={progRef} />
      <div id="cd" ref={cdRef} />
      <div id="cr" ref={crRef} />
    </>
  );
}
