import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollAnimationOptions = {
  stagger?: number;
};

export function fadeUpOnScroll(selector: gsap.DOMTarget, options: ScrollAnimationOptions = {}) {
  return gsap.fromTo(
    selector,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: options.stagger ?? 0.12,
      scrollTrigger: {
        trigger: selector,
        start: "top 82%",
        once: true,
      },
    },
  );
}

export function fadeInOnScroll(selector: gsap.DOMTarget, options: ScrollAnimationOptions = {}) {
  return gsap.fromTo(
    selector,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: options.stagger ?? 0.12,
      scrollTrigger: {
        trigger: selector,
        start: "top 82%",
        once: true,
      },
    },
  );
}

export function splitTextReveal(element: HTMLElement) {
  const words = element.textContent?.trim().split(/\s+/) ?? [];

  element.textContent = "";

  const wordElements = words.map((word, index) => {
    const span = document.createElement("span");
    span.textContent = index === words.length - 1 ? word : `${word} `;
    span.style.display = "inline-block";
    element.appendChild(span);
    return span;
  });

  return gsap.fromTo(
    wordElements,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.7,
      ease: "power3.out",
    },
  );
}

export function pinSection(trigger: gsap.DOMTarget, endOffset = "+=200%") {
  return ScrollTrigger.create({
    trigger,
    pin: true,
    start: "top top",
    end: endOffset,
    scrub: 1,
  });
}

export { gsap, ScrollTrigger };
