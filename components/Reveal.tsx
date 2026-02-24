"use client";

import {
  CSSProperties,
  ElementType,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Variant = "up" | "fade" | "scale" | "left" | "right";

type RevealProps = {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  index?: number;
  staggerBase?: number;
  className?: string;
  as?: ElementType;
};

const VARIANT_CLASS: Record<Variant, string> = {
  up: "reveal-up",
  fade: "reveal-fade",
  scale: "reveal-scale",
  left: "reveal-left",
  right: "reveal-right",
};

export default function Reveal({
  children,
  variant = "up",
  delay,
  index,
  staggerBase = 90,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -44px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const computedDelay =
    delay !== undefined ? delay : index !== undefined ? index * staggerBase : 0;

  const style: CSSProperties | undefined =
    computedDelay > 0 ? { transitionDelay: `${computedDelay}ms` } : undefined;

  const classes = [VARIANT_CLASS[variant], inView ? "in-view" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
