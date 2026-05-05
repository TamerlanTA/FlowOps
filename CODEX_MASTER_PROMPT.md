# FlowOps — Master Codex Prompt
# Complete Website Rebuild: Dark Space Aesthetic
# Design reference: deep black background, Saturn video hero, electric blue + amber accents

---

## HOW TO USE THIS PROMPT

Split this into 3 sequential Codex sessions:
1. **Session A** — Foundation (design system + Lenis + GSAP + Custom Cursor)
2. **Session B** — Hero section with Saturn video + scroll zoom freeze
3. **Session C** — All remaining sections

Do NOT combine all into one prompt — Codex works better with focused scope per session.

---

---

# ═══════════════════════════════════
# SESSION A — FOUNDATION
# ═══════════════════════════════════

## PASTE THIS INTO CODEX:

---

You are rebuilding the FlowOps website — an AI automation agency. The codebase is a Next.js 14 app with TypeScript, Tailwind CSS, and App Router. It already exists at the current working directory.

Your task is to set up the complete design foundation and animation infrastructure. Do NOT build any page content yet — only infrastructure.

---

## GOAL

Set up:
1. Design system (CSS variables, typography, colors) — DARK theme
2. Lenis smooth scroll
3. GSAP + ScrollTrigger integration with Lenis
4. Custom cursor component
5. Global layout wrappers

---

## DESIGN SYSTEM

### Color palette — Dark Space + Electric Blue + Amber

The entire site is dark. Background is near-black. Text is white/light. Accents are electric blue and amber.

```css
/* Backgrounds */
--color-bg:        #000000;
--color-bg-soft:   #0a0a0f;
--color-bg-card:   #0f1017;
--color-bg-subtle: #141520;
--color-bg-elevated: #1a1b2e;

/* Text */
--color-text:        #f0f2ff;
--color-text-muted:  #8b92b3;
--color-text-faint:  #4a5080;

/* Primary — electric blue */
--color-primary:        #3b82f6;
--color-primary-hover:  #60a5fa;
--color-primary-dim:    rgba(59,130,246,0.15);
--color-primary-glow:   rgba(59,130,246,0.3);

/* Accent — amber (pops beautifully on dark) */
--color-accent:        #f59e0b;
--color-accent-hover:  #fbbf24;
--color-accent-dim:    rgba(245,158,11,0.15);
--color-accent-glow:   rgba(245,158,11,0.25);

/* Success */
--color-success:       #10b981;
--color-success-dim:   rgba(16,185,129,0.15);

/* Borders */
--color-border:        rgba(255,255,255,0.08);
--color-border-strong: rgba(255,255,255,0.16);
--color-border-blue:   rgba(59,130,246,0.3);

/* Gradients */
--gradient-hero:    linear-gradient(180deg, #000000 0%, #050510 100%);
--gradient-primary: linear-gradient(135deg, #3b82f6, #1d4ed8);
--gradient-text:    linear-gradient(135deg, #60a5fa 0%, #f59e0b 100%);
--gradient-glow:    radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.2) 0%, transparent 70%);
--gradient-amber-glow: radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.15) 0%, transparent 60%);
--gradient-section: linear-gradient(180deg, #000000, #0a0a0f);
```

### Typography — Inter
```css
/* Font: Inter — load via next/font/google */
--font-display: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--text-xs:   0.75rem;    /* 12px */
--text-sm:   0.875rem;   /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg:   1.125rem;   /* 18px */
--text-xl:   1.25rem;    /* 20px */
--text-2xl:  1.5rem;     /* 24px */
--text-3xl:  1.875rem;   /* 30px */
--text-4xl:  2.25rem;    /* 36px */
--text-5xl:  3rem;       /* 48px */
--text-6xl:  3.75rem;    /* 60px */
--text-7xl:  4.5rem;     /* 72px */

--leading-tight:   1.1;
--leading-snug:    1.25;
--leading-normal:  1.5;
--leading-relaxed: 1.625;

--tracking-tight:   -0.025em;
--tracking-snug:    -0.015em;
--tracking-normal:  0;
--tracking-wide:    0.05em;
--tracking-widest:  0.1em;
```

### Spacing & Radii
```css
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-full: 9999px;

--section-padding:        120px 0;
--section-padding-mobile: 80px 0;
--container-width:   1200px;
--container-padding: 0 24px;
```

### Shadows (on dark bg — use glow instead of drop-shadow)
```css
--shadow-sm:       0 1px 3px rgba(0,0,0,0.4);
--shadow-md:       0 4px 16px rgba(0,0,0,0.5);
--shadow-lg:       0 8px 32px rgba(0,0,0,0.6);
--shadow-xl:       0 20px 60px rgba(0,0,0,0.7);
--shadow-blue:     0 0 24px rgba(59,130,246,0.35), 0 4px 16px rgba(59,130,246,0.2);
--shadow-blue-lg:  0 0 48px rgba(59,130,246,0.4), 0 8px 32px rgba(59,130,246,0.25);
--shadow-amber:    0 0 24px rgba(245,158,11,0.35), 0 4px 16px rgba(245,158,11,0.2);
--shadow-card:     0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset;
```

---

## TASK 1: Update globals.css

Replace the existing globals.css with:
- All CSS variables above (dark palette)
- Reset: box-sizing, scroll-behavior
- Base body: background #000000, color var(--color-text), font-family Inter, -webkit-font-smoothing antialiased
- Utility: .container (max-width 1200px, margin auto, padding 0 24px)
- Utility: .section (padding: var(--section-padding))
- Utility: .eyebrow — font-size 11px, font-weight 700, letter-spacing 0.12em, text-transform uppercase, color var(--color-text-faint)
- Gradient text: .gradient-text { background: var(--gradient-text); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
- Glow text: .glow-blue { text-shadow: 0 0 40px rgba(59,130,246,0.6); }
- Glow text: .glow-amber { text-shadow: 0 0 40px rgba(245,158,11,0.5); }
- Hide default cursor globally: html { cursor: none; }
- Smooth scroll: scroll-behavior: smooth
- Selection highlight: ::selection { background: rgba(59,130,246,0.3); color: white; }
- Dark scrollbar: ::-webkit-scrollbar { width: 6px; background: #000; } ::-webkit-scrollbar-thumb { background: #1a1b2e; border-radius: 3px; }

---

## TASK 2: Install dependencies

Run these installs:
```bash
npm install lenis gsap @gsap/react framer-motion
```

---

## TASK 3: Create Lenis provider

Create `components/providers/LenisProvider.tsx`:

```
- Client component ('use client')
- Initializes Lenis on mount with:
    duration: 1.2
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    orientation: 'vertical'
    smoothWheel: true
- On each Lenis 'scroll' event: ScrollTrigger.update()
- Uses gsap.ticker.add((time) => lenis.raf(time * 1000))
- gsap.ticker.lagSmoothing(0)
- Destroys on unmount (lenis.destroy(), gsap.ticker.remove)
- Provides lenis instance via React context
- Export useLenis() hook
- Wraps children: return <>{children}</>
```

---

## TASK 4: Create Custom Cursor component

Create `components/ui/CustomCursor.tsx`:

```
BEHAVIOR:
- Two elements:
    Dot: 6px circle, position fixed, z-index 9999, pointer-events none
         background: #f0f2ff (white-ish on dark bg)
         transition: none (instant follow)
    Ring: 36px circle, position fixed, z-index 9999, pointer-events none
         border: 1.5px solid rgba(59,130,246,0.7)
         background: transparent
         follows mouse with 0.12 lerp factor (smooth lag)
         transition: width 0.3s, height 0.3s, border-color 0.3s

- Both hidden on mobile (pointer: coarse media query — display none)

- On hover of [data-cursor="pointer"]:
    Ring expands to 52px, fills with rgba(59,130,246,0.12), border-color: #3b82f6

- On hover of [data-cursor="text"]:
    Ring shrinks to 3px, border: none, bg: #3b82f6

- On hover of [data-cursor="glow"]:
    Ring expands to 80px, border-color: rgba(245,158,11,0.8), bg: rgba(245,158,11,0.08)

- On hover of any <button> or <a>:
    Ring scales to 1.4x, border-color: var(--color-primary)

- Cursor disappears (opacity 0) when mouse leaves viewport
- Uses requestAnimationFrame for ring lerp
- Mix-blend-mode: normal
```

---

## TASK 5: Create GSAP utilities

Create `lib/gsap.ts`:
```typescript
// Import gsap and ScrollTrigger, register ScrollTrigger
// Export: gsap, ScrollTrigger

// fadeUpOnScroll(selector, options?)
//   ScrollTrigger: start "top 82%", once: true
//   from: { opacity: 0, y: 40 } to: { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
//   stagger: options.stagger ?? 0.12

// fadeInOnScroll(selector, options?)
//   same but no Y movement — pure opacity fade

// splitTextReveal(element)
//   splits text by words, animates each from { opacity: 0, y: 24 }
//   stagger 0.04, duration 0.7, ease "power3.out"

// pinSection(trigger, endOffset?)
//   ScrollTrigger pin: true, start: "top top", end: endOffset ?? "+=200%", scrub: 1
```

---

## TASK 6: Update layout.tsx

Update `app/layout.tsx`:
- Load Inter font via next/font/google (weights: 300, 400, 500, 600, 700, 800)
- Apply font variable to html element
- Wrap `<body>` children in LenisProvider
- Add `<CustomCursor />` as first child inside body (outside LenisProvider is fine)
- Set html lang="en"
- Keep existing metadata
- body background: #000000 (also set in globals.css but belt-and-suspenders)

---

## CONSTRAINTS
- Do NOT modify any existing page content or components
- Do NOT create any page sections
- Preserve existing API routes (app/api/)
- Preserve lib/ files other than adding lib/gsap.ts
- Only create new files and modify globals.css and layout.tsx

## VALIDATION
After completing:
1. Run `npm run build` — must pass with 0 errors
2. Run `npm run dev` — site should load with black background and smooth scrolling active
3. Custom cursor visible on desktop: white dot + blue ring
4. Confirm no console errors related to GSAP or Lenis

## REPORT FORMAT
```
FILES CHANGED: [list]
FILES CREATED: [list]
PACKAGES INSTALLED: [list]
BUILD STATUS: pass/fail
RISKS: [any]
```

---

---

# ═══════════════════════════════════
# SESSION B — HERO SECTION
# ═══════════════════════════════════

## PASTE THIS INTO CODEX (after Session A is complete and working):

---

You are building the Hero section for the FlowOps website. Foundation (Lenis, GSAP, Custom Cursor, dark design system) is already in place from Session A. Do NOT touch globals.css, layout.tsx, LenisProvider, or CustomCursor.

---

## GOAL

Build a cinematic Hero section with:
1. Full-screen vertical video background (`/public/hero-video.mp4`) — a slow zoom through space toward a giant planet
2. Apple-style scroll freeze: the section pins while the user scrolls, driving a GSAP timeline
3. During the scroll freeze, the video playback rate is controlled by scroll position (scrubbed) — creating a "scroll to zoom in" effect
4. Text content reveals and transforms across 4 scroll stages
5. Smooth fade transition out of hero into the next dark section

---

## VISUAL CONCEPT

The hero background is a space video: a cinematic slow zoom from a wide shot of Saturn toward a close-up of its glowing ring plane. As the user scrolls, the video progresses — creating the feeling that the user is flying through space toward the planet. The text content sits on top of this video.

This is a dark, premium, immersive opening. All text is white/light. No light backgrounds.

---

## COMPONENT: `components/sections/HeroSection.tsx`

### LAYER STRUCTURE (bottom to top, all absolute/fixed within pinned section):

```
<section id="hero" style="position: relative; height: 100vh; overflow: hidden; background: #000;">

  Layer 1 — Video background (z-index: 1)
    <video
      ref={videoRef}
      src="/public/hero-video.mp4"
      muted
      playsInline
      preload="auto"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center center',
      }}
    />
    NOTE: Do NOT use autoPlay — we control playback via scroll scrub.
    The video plays forward as scroll progress increases.

  Layer 2 — Dark vignette overlay (z-index: 2)
    position: absolute, inset: 0
    background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)
    Also add: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.8) 100%)
    This keeps edges dark and content readable.

  Layer 3 — Subtle grid overlay (z-index: 3)
    CSS grid pattern: 1px lines, spacing 60px
    color: rgba(59,130,246,0.04)
    pointer-events: none
    mask-image: linear-gradient(180deg, rgba(0,0,0,0.6), transparent 70%)

  Layer 4 — Hero content (z-index: 10)
    position: absolute
    bottom: 15%  ← content anchored to bottom third (planet is in upper portion)
    left: 50%, transform: translateX(-50%)
    width: 100%, max-width: 900px
    text-align: center
    padding: 0 32px

    Elements (top to bottom within content):

    a) Eyebrow badge:
       "AI Automation Agency · 40+ systems deployed"
       background: rgba(255,255,255,0.06)
       border: 1px solid rgba(255,255,255,0.12)
       backdrop-filter: blur(12px)
       border-radius: 999px
       padding: 6px 16px
       font-size: 11px, font-weight: 700, letter-spacing: 0.1em, text-transform: uppercase
       color: var(--color-text-muted)
       Left: small pulsing blue dot (4px, background: #3b82f6, box-shadow: 0 0 8px #3b82f6)
       id="hero-eyebrow"

    b) H1:
       "Stop running your business on spreadsheets, Slack messages, and hope."
       font-size: clamp(36px, 5.5vw, 68px)
       font-weight: 800
       line-height: 1.08
       letter-spacing: -0.03em
       color: #f0f2ff
       max-width: 820px
       margin: 16px auto 0
       id="hero-h1"
       The word "hope." should be wrapped in <span class="gradient-text">

    c) Subheadline:
       "FlowOps designs and deploys AI-powered automation systems that eliminate manual work, connect your tools, and scale your output — without hiring."
       font-size: clamp(15px, 1.8vw, 18px)
       color: var(--color-text-muted)
       max-width: 580px
       line-height: 1.65
       margin: 20px auto 0
       id="hero-sub"

    d) CTA row:
       display: flex, gap: 14px, justify-content: center, margin-top: 32px
       id="hero-ctas"

       Button 1 — Primary:
         "Get a free audit →"
         background: #3b82f6
         color: white, font-weight: 700, font-size: 15px
         padding: 13px 28px, border-radius: 10px
         box-shadow: var(--shadow-blue)
         hover: background #60a5fa, transform: translateY(-1px), shadow intensifies
         data-cursor="pointer"

       Button 2 — Ghost:
         "▶ See live systems"
         background: rgba(255,255,255,0.06)
         border: 1px solid rgba(255,255,255,0.14)
         color: var(--color-text), font-weight: 600, font-size: 15px
         padding: 13px 28px, border-radius: 10px
         backdrop-filter: blur(8px)
         hover: border-color rgba(59,130,246,0.5), background rgba(59,130,246,0.08)

    e) Trust line:
       "No commitment required · Audit response within 1 business day"
       font-size: 12px, color: var(--color-text-faint)
       margin-top: 16px

  Layer 5 — Transform overlay text (z-index: 11, opacity: 0 initially)
    id="hero-transform"
    position: absolute, inset: 0
    display: flex, flex-direction: column, align-items: center, justify-content: center
    text-align: center, pointer-events: none

    Contains:
      <p id="hero-from" style="font-size: clamp(18px,2.5vw,28px); color: rgba(240,242,255,0.5); font-weight: 500; letter-spacing: -0.01em">
        From: tools that don't talk to each other.
      </p>
      <p id="hero-to" style="font-size: clamp(22px,3.5vw,42px); color: #f0f2ff; font-weight: 700; letter-spacing: -0.02em; margin-top: 16px; opacity: 0">
        To: one system that <span class="gradient-text">thinks, routes,</span> and executes.
      </p>

  Layer 6 — Floating stat badges (z-index: 12, opacity: 0 initially)
    id="hero-badges"
    4 badges, each absolutely positioned:

    Badge structure:
      background: rgba(10,10,15,0.75)
      border: 1px solid rgba(255,255,255,0.1)
      border-radius: 14px
      padding: 12px 18px
      backdrop-filter: blur(16px)
      box-shadow: var(--shadow-card)
      display: flex, align-items: center, gap: 10px

    Badge 1 — bottom-left (left: 5%, bottom: 25%):
      Icon: ⚡ (amber)
      Text: "40+ live systems"
      Sub: "deployed in production"

    Badge 2 — bottom-right (right: 5%, bottom: 25%):
      Icon: ⏱
      Text: "5–10 day delivery"
      Sub: "from brief to live"

    Badge 3 — top-right (right: 4%, top: 30%):
      Icon: 📉
      Text: "-68% manual work"
      Sub: "average across clients"

    Badge 4 — top-left (left: 4%, top: 30%):
      Icon: ✦ (blue)
      Text: "3× team output"
      Sub: "same headcount"

    Each badge has number in font-weight: 700, color: white, font-size: 16px
    Sub text: font-size: 11px, color: var(--color-text-faint)

  Layer 7 — Scroll indicator (z-index: 13)
    id="hero-scroll-hint"
    position: absolute, bottom: 32px, left: 50%, transform: translateX(-50%)
    display: flex, flex-direction: column, align-items: center, gap: 8px

    Contains:
      Small animated arrow/chevron (CSS keyframe bounce, up-down)
      Text: "Scroll to explore"
      font-size: 11px, color: var(--color-text-faint), letter-spacing: 0.08em

  Layer 8 — Bottom fade to next section (z-index: 14)
    position: absolute, bottom: 0, left: 0, right: 0, height: 200px
    background: linear-gradient(to bottom, transparent, #000000)
    pointer-events: none

</section>
```

---

### VIDEO SCRUB LOGIC (the core "scroll to zoom" effect)

This is the most important part. The video does NOT autoplay. Its currentTime is driven by scroll progress.

```typescript
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  // Wait for video metadata to load
  video.addEventListener('loadedmetadata', () => {
    const duration = video.duration; // e.g. 10s

    // Pin the hero section
    ScrollTrigger.create({
      trigger: '#hero',
      pin: true,
      start: 'top top',
      end: '+=280%',   // 2.8 screens of scroll
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Drive video playback from scroll progress
        // Use only the first 70% of scroll for video (last 30% is exit)
        const videoProgress = Math.min(self.progress / 0.7, 1);
        video.currentTime = videoProgress * duration;
      },
    });

    // Separate timeline for content animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=280%',
        scrub: 1.5,
      }
    });

    // Stage 0 → 20%: Initial reveal — content slides up, eyebrow fades
    tl.to('#hero-eyebrow', { opacity: 0, y: -10, duration: 0.15 }, 0)
      .to('#hero-scroll-hint', { opacity: 0, duration: 0.1 }, 0)

    // Stage 20% → 45%: Video zooms in (via currentTime), content fades slightly
    tl.to('#hero-h1', { opacity: 0.7, scale: 1.01, duration: 0.25 }, 0.15)
      .to('#hero-sub', { opacity: 0, y: -16, duration: 0.2 }, 0.2)
      .to('#hero-ctas', { opacity: 0, y: -12, duration: 0.2 }, 0.2)

    // Stage 45% → 65%: Transform text appears
    tl.to('#hero-transform', { opacity: 1, duration: 0.2 }, 0.4)
      .to('#hero-h1', { opacity: 0, duration: 0.15 }, 0.45)
      .to('#hero-from', { opacity: 1, y: 0, duration: 0.2 }, 0.48)
      .to('#hero-to', { opacity: 1, y: 0, duration: 0.2 }, 0.55)

    // Stage 65% → 80%: Badges appear
    tl.to('#hero-badges', { opacity: 1, duration: 0.15 }, 0.62)

    // Stage 80% → 100%: Exit — everything fades, black overlay comes in
    tl.to('#hero-transform', { opacity: 0, duration: 0.15 }, 0.8)
      .to('#hero-badges', { opacity: 0, duration: 0.15 }, 0.82)
      .to('.hero-vignette', { opacity: 1, duration: 0.2 }, 0.85)
      // Final black overlay fade (add a full black div with id="hero-exit-overlay", opacity 0)
      .to('#hero-exit-overlay', { opacity: 1, duration: 0.2 }, 0.85)
  });

  return () => ScrollTrigger.getAll().forEach(t => t.kill());
}, []);
```

Add `<div id="hero-exit-overlay" style="position:absolute;inset:0;background:#000;opacity:0;zIndex:20;pointerEvents:none" />` as the topmost layer.

---

### INITIAL LOAD ANIMATION (on mount, no scroll needed)

```typescript
useEffect(() => {
  // After 200ms delay, animate content in
  const timer = setTimeout(() => {
    gsap.fromTo('#hero-eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('#hero-h1 .word', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.05, delay: 0.1 });
    gsap.fromTo('#hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
    gsap.fromTo('#hero-ctas', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.7 });
    gsap.fromTo('#hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
  }, 200);
  return () => clearTimeout(timer);
}, []);
```

For the H1 word-by-word animation, wrap each word in a `<span class="word">` in JSX, or use a simple split function.

---

### MOBILE BEHAVIOR (< 768px)
- Disable all ScrollTrigger / scroll freeze
- Video plays on loop with `autoPlay muted loop playsInline` normally
- Static layout: content centered, no pin
- Badges hidden on mobile
- Custom cursor hidden (already handled in CustomCursor component)

---

### ALSO CREATE: `components/sections/HeroSection.tsx` imports
```typescript
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

---

## VIDEO PLACEHOLDER NOTE

If `/public/hero-video.mp4` does not exist yet, use a black background with a CSS star field animation as placeholder:
```css
/* Animated star field — pure CSS, no video needed for dev */
background: radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%);
/* Add 200 tiny white dots via pseudo-elements or box-shadow trick */
```
The GSAP scroll freeze and timeline animations should still work — just no video content yet.

---

## VALIDATION
1. `npm run build` must pass
2. Hero is black/dark with video (or dark placeholder) filling the screen
3. Scroll freeze works: section stays pinned for ~3 screens of scroll
4. Scrolling forward advances video playback (zoom toward planet)
5. Text stages appear and disappear correctly during scroll
6. Badges appear in stage 3
7. Black overlay fades in at end, smooth transition to next section
8. Mobile: normal scroll, no pin, video loops normally

---

---

# ═══════════════════════════════════
# SESSION C — ALL REMAINING SECTIONS
# ═══════════════════════════════════

## PASTE THIS INTO CODEX (after Sessions A + B are complete):

---

You are building all remaining sections of the FlowOps website. Sessions A (foundation) and B (hero) are complete. The design system is DARK — black backgrounds, white text, electric blue and amber accents. All sections must match this dark aesthetic.

Build each section as a separate component in `components/sections/`. Each section uses GSAP ScrollTrigger for scroll-reveal animations. Use the content from `SITE_CONTENT.md` in the root of the project.

---

## DARK THEME RULES (apply to every section)

```
- Section backgrounds alternate between:
    Primary: #000000
    Soft: #0a0a0f
    Card: #0f1017
- Section headings: color #f0f2ff, font-weight 800
- Body text: color var(--color-text-muted) = #8b92b3
- Cards: background #0f1017, border: 1px solid rgba(255,255,255,0.08)
         box-shadow: var(--shadow-card), border-radius: 16px
- Cards on hover: border-color rgba(59,130,246,0.3), box-shadow: var(--shadow-blue)
- Eyebrow labels: var(--color-text-faint), uppercase, letter-spacing 0.1em
- Accent elements: blue #3b82f6 or amber #f59e0b
- Input fields (dark): background #0f1017, border rgba(255,255,255,0.1), color white
  focus border: #3b82f6, outline: none, box-shadow: 0 0 0 3px rgba(59,130,246,0.15)
- Primary buttons: background #3b82f6, color white, hover: #60a5fa + shadow-blue
- Ghost buttons: border rgba(255,255,255,0.14), bg rgba(255,255,255,0.05), hover: blue border
```

---

## GLOBAL ANIMATION PATTERN (apply to all sections)

```
- Initial state: opacity 0, translateY: 32px
- On scroll into view: opacity 1, translateY 0
- Timing: duration 0.85s, ease: "power3.out"
- Headings: duration 1s, movement 44px
- Cards stagger: 0.1s between each
- ScrollTrigger: start "top 82%", once: true
```

---

## SECTION 2: PainSection.tsx

**Layout:** Two-column — left: heading + subtext / right: interactive checkbox grid
**Background:** #0a0a0f
**Eyebrow:** "The Problem"

**Interactive behavior:**
- 8 pain cards, each with a custom dark-styled checkbox
- Card base: background #0f1017, border 1px solid rgba(255,255,255,0.07)
- On checkbox tick: card border turns blue rgba(59,130,246,0.5), left edge gets 3px blue border
  Blue checkmark icon (✓) animates in with scale from 0→1
- Live counter at bottom: "X of 8 problems recognized"
- Estimated monthly loss updates: ticked × $2,400 (amber color, large font)
- When ≥ 3 ticked: CTA appears: "That's $[X]/month. Let's fix it →" (amber button)
- React state (useState) only — no localStorage
- Cards animate in with stagger on scroll reveal

---

## SECTION 3: BeforeAfterSection.tsx

**Layout:** Two-column with animated SVG divider
**Background:** #000000
**Eyebrow:** "Before vs After FlowOps"

**Design:**
- Left column (BEFORE): background #0f1017, subtle red tint rgba(239,68,68,0.05)
  Items have ✗ prefix in color rgba(239,68,68,0.7)
  Header: "Without FlowOps", color: var(--color-text-muted)
- Right column (AFTER): background #0f1017, subtle blue tint rgba(59,130,246,0.05)
  Items have ✓ prefix in #3b82f6
  Header: "With FlowOps", color: var(--color-primary)
- Center: animated SVG vertical line (draws on scroll, stroke: rgba(255,255,255,0.15))
  Arrow pointing right at center
- Bottom metric bar: dark background #0f1017, 4 numbers count up on scroll
  Numbers in white, large font-weight 800, labels in var(--color-text-faint)
  Use requestAnimationFrame counter: 0 → target over 1.5s when visible

---

## SECTION 4: ServicesSection.tsx

**Layout:** Tab nav + active panel
**Background:** #0a0a0f
**Eyebrow:** "What We Build"

**Design:**
- 3 tabs: "Sales System" / "Ops System" / "AI Layer"
- Tab bar: background #0f1017, border-bottom rgba(255,255,255,0.08)
- Active tab: blue text, border-bottom 2px #3b82f6, background rgba(59,130,246,0.08)
- Inactive tabs: color var(--color-text-faint), hover: var(--color-text-muted)
- Service panel: left = description + bullet list / right = animated SVG flow diagram
- Flow diagram: dark background, nodes are dark cards with blue/amber borders
  SVG lines between nodes: dashed stroke #3b82f6, animates with stroke-dashoffset on tab switch
  Nodes pulse subtly (CSS keyframe: box-shadow oscillates)
- Panel switch: Framer Motion AnimatePresence, slide + fade
- Each bullet: blue dot prefix, color var(--color-text-muted)

---

## SECTION 5: CasesSection.tsx

**Layout:** Filter tabs + 3-column card grid
**Background:** #000000
**Eyebrow:** "Live Results"

**Design:**
- Filter tabs: "All" / "Sales" / "Operations" / "AI"
  Tab buttons: background #0f1017, border rgba(255,255,255,0.08)
  Active: background #3b82f6, color white
- Case card:
  Background: #0f1017
  Border: 1px solid rgba(255,255,255,0.07)
  Border-radius: 16px
  Top: industry badge (small pill, background rgba(59,130,246,0.1), color #60a5fa) + title
  Body: problem text, max 2 lines, ellipsis
  Flow pipeline: 4-5 nodes connected by arrows, dark mini-diagram
  Results: 3 metrics in a row — big number (white, weight 800) + label (text-faint)
  Numbers use amber color (#f59e0b) for emphasis
  Quote: italic, color text-muted, border-left 2px solid rgba(59,130,246,0.4)
  CTA: "Read full case →" ghost button (blue border on hover)
- Hover: translateY -4px, border-color rgba(59,130,246,0.3), shadow-blue
- Filter: Framer Motion layout animation
- Stagger on initial reveal

---

## SECTION 6: ROICalculator.tsx

**Layout:** Centered card, max-width 640px
**Background:** #0a0a0f
**Eyebrow:** "Calculate Your Loss"

**Design:**
- Card: background #0f1017, border 1px solid rgba(59,130,246,0.2), border-radius 20px
  box-shadow: var(--shadow-blue)
- 4 inputs (dark styled): Team members / Hours lost per week / Monthly salary / Project complexity
- Input fields: bg #141520, border rgba(255,255,255,0.1), color white, focus: blue border + glow
- Results panel: background #000, border-top rgba(255,255,255,0.08)
  Monthly loss: large white number with amber color
  ROI Multiple: blue
  Payback period: text-muted
- Numbers animate (count up) on input change
- CTA: "Get a precise estimate →" — blue button, full width
- Calculation:
  monthly_loss = team × hours × 4 × (salary/160) × 0.35
  annual_roi = (monthly_loss × 12 × 3) / 5000
  payback_weeks = 5000 / (monthly_loss / 4)

---

## SECTION 7: MethodSection.tsx

**Layout:** Left heading / Right vertical timeline
**Background:** #000000
**Eyebrow:** "How It Works"

**Design:**
- Left: large section heading, description, small "5-step process" badge
- Right: vertical timeline of 5 steps
- Timeline connector: SVG vertical line, stroke rgba(255,255,255,0.08)
  Draws itself as user scrolls (stroke-dashoffset animation on scroll)
  Active node glow: box-shadow 0 0 16px rgba(59,130,246,0.5)
- Each step card:
  Background: transparent (just the timeline line + number circle + content)
  Number circle: 36px, border 1px solid rgba(255,255,255,0.1), background #0f1017
  Active step: circle fills with #3b82f6, glow
  Title: white, weight 700
  Description: var(--color-text-muted)
  "What you get" chips: small pills, background rgba(59,130,246,0.1), color #60a5fa
- Step cards slide in from right with stagger

---

## SECTION 8: AboutSection.tsx

**Layout:** Two-column — left: story / right: stats grid
**Background:** #0a0a0f
**Eyebrow:** "About FlowOps"

**Design:**
- Left: heading + story paragraph + 3 value cards
  Value cards: background #0f1017, border rgba(255,255,255,0.07), icon (blue) + title + description
- Right: 2×2 stats grid
  Stat cards: background #0f1017, large number (white, weight 800), unit in amber, label in text-faint
  Numbers count up on scroll
- No team photos needed — keep generic/abstract

---

## SECTION 9: TestimonialsSection.tsx

**Layout:** Auto-scrolling dual marquee
**Background:** #000000
**Eyebrow:** "What Clients Say"

**Design:**
- Section heading centered
- Two rows of testimonial cards moving in opposite directions
- CSS animation (not GSAP) for performance
- Pause on hover (animation-play-state: paused)
- Card: background #0f1017, border rgba(255,255,255,0.07), border-radius 14px
  padding: 20px 24px
  Stars: 5 amber stars (★) at top
  Quote: color var(--color-text-muted), line-height 1.7, italic
  Author: name white weight 600, role text-faint
  Small company badge pill on top-right
- Infinite loop via duplicating the array (2× cards per row)
- Row 1: moves left, speed 30s
- Row 2: moves right, speed 38s (different speed for natural feel)

---

## SECTION 10: FAQSection.tsx

**Layout:** Centered, max-width 720px, accordion
**Background:** #0a0a0f
**Eyebrow:** "Frequently Asked"

**Design:**
- Centered heading + subtitle
- 10 items in accordion
- Item base: border-bottom 1px solid rgba(255,255,255,0.07)
- Question: color var(--color-text), weight 600, font-size 16px
  Chevron icon right-aligned, rotates 180° on open
- Active question: color #3b82f6
- Answer: color var(--color-text-muted), line-height 1.75
  Framer Motion AnimatePresence for height animation (overflow hidden)
- One open at a time

---

## SECTION 11: CTASection.tsx

**Layout:** Two-column — left: copy / right: multi-step form
**Background:** linear-gradient(180deg, #000000, #050510) with subtle blue glow radial at top
**Eyebrow:** "Start Here"

**Design:**
- Left side: large heading "Ready to cut 68% of manual work?", description, 4 trust chips
  Trust chips: background rgba(255,255,255,0.05), border rgba(255,255,255,0.1)
  Icons in blue or amber
- Right side: 3-step form card
  Card: background #0f1017, border rgba(255,255,255,0.1), border-radius 20px
  Progress: 3 step dots at top (active = blue, inactive = rgba(255,255,255,0.15))

  Step 1: 4 service option cards (click to select)
    Options: Sales Automation / Ops Automation / AI Integration / Full System Build
    Card selected: border #3b82f6, bg rgba(59,130,246,0.08), checkmark icon appears
    
  Step 2: Textarea + tools input
    "Describe your biggest bottleneck"
    "What tools do you currently use?"
    
  Step 3: Name / Email / WhatsApp / Revenue range select
    Revenue select: bg #141520, border rgba(255,255,255,0.1)

  Step transitions: Framer Motion slide (current: x 0→-40, opacity 1→0 / next: x 40→0, opacity 0→1)
  Next button: blue, full width, with arrow →
  Submit: calls existing /api/contact endpoint
  Success: animated blue checkmark + "We'll be in touch within 1 business day."

---

## SECTION 12: NavBar.tsx

**Design:**
- Fixed, top 0, full width, z-index 100
- Background: rgba(0,0,0,0.7), backdrop-filter: blur(20px) saturate(180%)
- Border-bottom: 1px solid rgba(255,255,255,0.07)
- Logo left: "FlowOps" — white, weight 800, + small blue dot after "Flow"
- Nav links center: color text-muted, hover: color text (white), font-weight 500
- CTA right: "Get free audit →" — blue bg, white text, small, rounded
- On scroll: border-bottom becomes rgba(255,255,255,0.1), background more opaque
- Mobile: hamburger (3 lines, white) → full-screen dark overlay menu (#000000)
  Menu links large, centered, stagger animate in
- Active section: nav link color turns white + small blue dot under link

---

## SECTION 13: Footer.tsx

**Design:**
- Background: #000000
- Top border: 1px solid rgba(255,255,255,0.07)
- 3 columns: logo+tagline / nav links / social + legal
- Logo: white text
- Tagline: "AI automation systems for ambitious teams." color text-faint
- Nav links: color text-faint, hover: text-muted
- Social icons: border rgba(255,255,255,0.1), bg rgba(255,255,255,0.04), hover: blue border
- Copyright: text-faint, font-size 12px
- Small top gradient line: 1px solid, linear-gradient(90deg, transparent, #3b82f6, transparent)

---

## ASSEMBLY: Update app/page.tsx

```tsx
import NavBar from "@/components/sections/NavBar"
import HeroSection from "@/components/sections/HeroSection"
import PainSection from "@/components/sections/PainSection"
import BeforeAfterSection from "@/components/sections/BeforeAfterSection"
import ServicesSection from "@/components/sections/ServicesSection"
import CasesSection from "@/components/sections/CasesSection"
import ROICalculator from "@/components/sections/ROICalculator"
import MethodSection from "@/components/sections/MethodSection"
import AboutSection from "@/components/sections/AboutSection"
import TestimonialsSection from "@/components/sections/TestimonialsSection"
import FAQSection from "@/components/sections/FAQSection"
import CTASection from "@/components/sections/CTASection"
import Footer from "@/components/sections/Footer"

export default function HomePage() {
  return (
    <main style={{ background: '#000000' }}>
      <NavBar />
      <HeroSection />
      <PainSection />
      <BeforeAfterSection />
      <ServicesSection />
      <CasesSection />
      <ROICalculator />
      <MethodSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}
```

---

## GLOBAL CONSTRAINTS (all sessions)

- Preserve existing: app/api/sendLead/route.ts, app/api/contact/route.ts, lib/
- Do NOT break the /api/contact endpoint
- All text content comes from SITE_CONTENT.md (already in project root)
- Mobile-first responsive (breakpoints: 768px, 1024px, 1280px)
- No console errors or TypeScript errors
- Run `npm run build` after each session — must pass

## PERFORMANCE CONSTRAINTS
- Hero video: preload="auto", no autoPlay, controlled via GSAP scrub
- Images: use next/image with proper dimensions
- GSAP: ScrollTrigger.refresh() after fonts load
- Target: Lighthouse performance score > 75

## FINAL REPORT FORMAT
```
SESSION: A / B / C
FILES CREATED: [list]
FILES MODIFIED: [list]
ANIMATION STATUS: [what works, what needs iteration]
BUILD: pass/fail
KNOWN ISSUES: [list]
NEXT STEPS: [what to iterate]
```

---

*Prompt v2.0 — FlowOps · May 2026*
*Design: Dark space aesthetic — Black bg, electric blue + amber, Saturn zoom hero*
*Reference: juanmora.co scroll feel + cinematic space cinematography*
