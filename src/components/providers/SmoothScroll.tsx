"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis drives the scroll; GSAP ScrollTrigger listens to it.
 * Both are disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /**
     * Read the preference directly rather than through the hook. The hook
     * returns false on first render and only flips after mount, which meant
     * Lenis was constructed and then immediately destroyed for anyone who had
     * asked for reduced motion — and that teardown left the page unable to
     * scroll natively at all. Checking here means it is never built.
     */
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The intro must always begin at the sealed door — browsers otherwise
    // restore the previous scroll position on reload and drop the visitor
    // halfway through the journey.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
      syncTouch: false,
    });

    // Expose for in-page anchor navigation
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Honour a lock requested before this instance existed
    if (scrollLocked) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Effects run child-first, so IntroExperience calls lockScroll() *before*
 * this provider has created Lenis — `lenis.stop()` would hit undefined and
 * silently do nothing. This flag lets the instance pick the lock up on
 * creation instead of depending on mount order.
 */
let scrollLocked = false;
export const isScrollLocked = () => scrollLocked;

/**
 * Freeze the page while the door is still sealed. Locking Lenis alone is not
 * enough — with Lenis absent (reduced motion) the native scroll still moves,
 * so the body is pinned too.
 */
export function lockScroll() {
  scrollLocked = true;
  getLenis()?.stop();
  document.documentElement.classList.add("tomb-locked");
  window.scrollTo(0, 0);
}

export function unlockScroll() {
  scrollLocked = false;
  getLenis()?.start();
  document.documentElement.classList.remove("tomb-locked");
}

/** Jump to the very top immediately — used when the intro tears itself down. */
export function scrollToTop() {
  getLenis()?.scrollTo(0, { immediate: true });
  window.scrollTo(0, 0);
}

/** Smooth-scroll to a section id, falling back to native behaviour. */
export function scrollToSection(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
