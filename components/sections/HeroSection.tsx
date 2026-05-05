"use client";

import { ChevronDown, Clock3, Play, Sparkles, TrendingDown, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const headlineParts = [
  "Stop",
  "running",
  "your",
  "business",
  "on",
  "spreadsheets,",
  "Slack",
  "messages,",
  "and",
  "hope.",
] as const;

const badges = [
  {
    title: "40+ live systems",
    sub: "deployed in production",
    icon: Zap,
    tone: "amber",
  },
  {
    title: "5–10 day delivery",
    sub: "from brief to live",
    icon: Clock3,
    tone: "amber",
  },
  {
    title: "-68% manual work",
    sub: "average across clients",
    icon: TrendingDown,
    tone: "amber",
  },
  {
    title: "3× team output",
    sub: "same headcount",
    icon: Sparkles,
    tone: "blue",
  },
] as const;

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoUnavailable, setVideoUnavailable] = useState(false);

  const renderedHeadline = useMemo(
    () =>
      headlineParts.map((word, index) => {
        const content = index === headlineParts.length - 1 ? word : `${word} `;

        return (
          <span
            // GSAP targets the global word class requested in the brief.
            className={`${styles.word} word ${word === "hope." ? "gradient-text" : ""}`}
            key={`${word}-${index}`}
          >
            {content}
          </span>
        );
      }),
    [],
  );

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entrance: gsap.Context | undefined;
    const timer = window.setTimeout(() => {
      entrance = gsap.context(() => {
        gsap.fromTo(
          "#hero-eyebrow",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.8, ease: "power3.out" },
        );
        gsap.fromTo(
          "#hero-h1 .word",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: reduceMotion ? 0.01 : 0.9,
            ease: "power3.out",
            stagger: reduceMotion ? 0 : 0.05,
            delay: reduceMotion ? 0 : 0.1,
          },
        );
        gsap.fromTo(
          "#hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.8, ease: "power3.out", delay: reduceMotion ? 0 : 0.5 },
        );
        gsap.fromTo(
          "#hero-ctas",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: reduceMotion ? 0.01 : 0.7, ease: "power3.out", delay: reduceMotion ? 0 : 0.7 },
        );
        gsap.fromTo(
          "#hero-scroll-hint",
          { opacity: 0 },
          { opacity: 1, duration: reduceMotion ? 0.01 : 1, delay: reduceMotion ? 0 : 1.5 },
        );
      });

    }, 200);

    return () => {
      window.clearTimeout(timer);
      entrance?.revert();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reduceMotion = reduceMotionQuery.matches;
    const isMobile = mobileQuery.matches;

    if (isMobile || reduceMotion) {
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      void video.play().catch(() => undefined);
      return undefined;
    }

    let timeline: gsap.core.Timeline | undefined;

    const setupScrollScrub = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;

      timeline = gsap.timeline({
        scrollTrigger: {
          id: "hero-content-timeline",
          trigger: "#hero",
          pin: true,
          start: "top top",
          end: "+=280%",
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!duration) return;

            const videoProgress = Math.min(self.progress / 0.7, 1);
            try {
              video.currentTime = videoProgress * duration;
            } catch {
              // Some browsers can reject seeks before enough video data is buffered.
            }
          },
        },
      });

      timeline
        .to("#hero-eyebrow", { opacity: 0, y: -10, duration: 0.15 }, 0)
        .to("#hero-scroll-hint", { opacity: 0, duration: 0.1 }, 0)
        .to("#hero-h1", { opacity: 0.7, scale: 1.01, duration: 0.25 }, 0.15)
        .to("#hero-sub", { opacity: 0, y: -16, duration: 0.2 }, 0.2)
        .to("#hero-ctas", { opacity: 0, y: -12, duration: 0.2 }, 0.2)
        .to("#hero-transform", { opacity: 1, duration: 0.2 }, 0.4)
        .to("#hero-h1", { opacity: 0, duration: 0.15 }, 0.45)
        .to("#hero-from", { opacity: 1, y: 0, duration: 0.2 }, 0.48)
        .to("#hero-to", { opacity: 1, y: 0, duration: 0.2 }, 0.55)
        .to("#hero-badges", { opacity: 1, duration: 0.15 }, 0.62)
        .to("#hero-transform", { opacity: 0, duration: 0.15 }, 0.8)
        .to("#hero-badges", { opacity: 0, duration: 0.15 }, 0.82)
        .to(".hero-vignette", { opacity: 1, duration: 0.2 }, 0.85)
        .to("#hero-exit-overlay", { opacity: 1, duration: 0.2 }, 0.85);

      timeline.scrollTrigger?.refresh();
    };

    if (video.readyState >= 1) {
      setupScrollScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrollScrub, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", setupScrollScrub);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    };
  }, []);

  return (
    <section className={styles.hero} id="hero" aria-label="FlowOps hero">
      <div className={styles.starField} aria-hidden="true" />

      {!videoUnavailable ? (
      <video
          ref={videoRef}
          className={`${styles.video} ${videoReady ? styles.videoReady : ""}`}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoUnavailable(true)}
          aria-hidden="true"
        />
      ) : null}

      <div className={`${styles.vignette} hero-vignette`} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow} id="hero-eyebrow">
          <span className={styles.pulseDot} aria-hidden="true" />
          AI Automation Agency · 40+ systems deployed
        </p>

        <h1 className={styles.headline} id="hero-h1">
          {renderedHeadline}
        </h1>

        <p className={styles.subheadline} id="hero-sub">
          FlowOps designs and deploys AI-powered automation systems that eliminate manual work,
          connect your tools, and scale your output — without hiring.
        </p>

        <div className={styles.ctas} id="hero-ctas">
          <a className={styles.primaryButton} href="#contact" data-cursor="pointer">
            Get a free audit →
          </a>
          <a className={styles.ghostButton} href="#systems" data-cursor="pointer">
            <Play className={styles.playIcon} aria-hidden="true" />
            See live systems
          </a>
        </div>

        <p className={styles.trustLine}>
          No commitment required · Audit response within 1 business day
        </p>
      </div>

      <div className={styles.transformText} id="hero-transform">
        <p className={styles.fromText} id="hero-from">
          From: tools that don&apos;t talk to each other.
        </p>
        <p className={styles.toText} id="hero-to">
          To: one system that <span className="gradient-text">thinks, routes,</span> and executes.
        </p>
      </div>

      <div className={styles.badges} id="hero-badges" aria-hidden="true">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div className={styles.badge} key={badge.title}>
              <span
                className={`${styles.badgeIcon} ${
                  badge.tone === "blue" ? styles.badgeIconBlue : ""
                }`}
              >
                <Icon aria-hidden="true" />
              </span>
              <span className={styles.badgeText}>
                <span className={styles.badgeTitle}>{badge.title}</span>
                <span className={styles.badgeSub}>{badge.sub}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.scrollHint} id="hero-scroll-hint" aria-hidden="true">
        <ChevronDown className={styles.chevron} />
        <span className={styles.scrollHintText}>Scroll to explore</span>
      </div>

      <div className={styles.bottomFade} aria-hidden="true" />
      <div className={styles.exitOverlay} id="hero-exit-overlay" aria-hidden="true" />
    </section>
  );
}
