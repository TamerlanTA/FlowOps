"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "pointer" | "text" | "glow" | "link" | "scanner";

const getVariant = (target: EventTarget | null): CursorVariant => {
  if (!(target instanceof Element)) {
    return "default";
  }

  const cursorTarget = target.closest<HTMLElement>("[data-cursor]");
  const cursorType = cursorTarget?.dataset.cursor as CursorVariant;

  if (cursorType === "pointer" || cursorType === "text" || cursorType === "glow" || cursorType === "scanner") {
    return cursorType;
  }

  if (target.closest("button, a")) {
    return "link";
  }

  return "default";
};

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const variantRef = useRef<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canUseCustomCursor = window.matchMedia("(pointer: fine)").matches && !reduceMotion;

    if (!canUseCustomCursor) {
      return undefined;
    }

    const dotElement = dotRef.current;
    const ringElement = ringRef.current;

    if (!dotElement || !ringElement) {
      return undefined;
    }

    const moveDot = () => {
      dotElement.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
    };

    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      ringElement.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;
      frame.current = requestAnimationFrame(animateRing);
    };

    const updateVisible = (nextVisible: boolean) => {
      if (visibleRef.current === nextVisible) return;
      visibleRef.current = nextVisible;
      setVisible(nextVisible);
    };

    const updateVariant = (nextVariant: CursorVariant) => {
      if (variantRef.current === nextVariant) return;
      variantRef.current = nextVariant;
      setVariant(nextVariant);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      moveDot();
      updateVisible(true);
      updateVariant(getVariant(event.target));
    };

    const handleMouseOver = (event: MouseEvent) => {
      updateVariant(getVariant(event.target));
    };

    const handleMouseLeave = () => {
      updateVisible(false);
    };

    const handleMouseEnter = () => {
      updateVisible(true);
    };

    frame.current = requestAnimationFrame(animateRing);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot"
        data-visible={visible}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="custom-cursor-ring"
        data-visible={visible}
        data-variant={variant}
      />
    </>
  );
}
