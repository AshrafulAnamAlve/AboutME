"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SealedDoor from "./SealedDoor";
import { lockScroll, unlockScroll, scrollToTop } from "@/components/providers/SmoothScroll";
import { useAudio } from "@/components/providers/AudioProvider";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

/** How much scroll runway the journey gets. Longer = slower, more cinematic. */
const TRACK_VH = 620;

type Phase = "door" | "journey" | "arrived";

export default function IntroExperience({
  onArrive,
}: {
  onArrive: (arrived: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>("door");
  const [visible, setVisible] = useState(true);
  /* Once true the intro is gone for good — the runway is torn down and there is
     no scrolling back into it; only a reload replays the journey. */
  const [locked, setLocked] = useState(false);
  const [showHint, setShowHint] = useState(true);
  /* The leaves stay in the DOM for the whole swing, while the map renders
     behind them — otherwise the door vanishes mid-movement and the reveal
     is lost entirely. */
  const [doorMounted, setDoorMounted] = useState(true);
  /* Gated on scroll progress rather than on the overlay's own unmount: the
     overlay fades out reliably, but leaving a second WebGL context alive
     underneath the whole portfolio is what makes intros like this wreck the
     scrolling performance of every section below them. */
  const [sceneOn, setSceneOn] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /** Scroll progress 0→1, read inside useFrame. Never React state. */
  const progressRef = useRef(0);

  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const { unlock } = useAudio();

  /* Hold the page still until the seal is broken. */
  useEffect(() => {
    if (phase === "door") lockScroll();
    return () => unlockScroll();
  }, [phase]);

  /**
   * Anyone who has asked for reduced motion gets the door and nothing else —
   * a scroll-driven camera push is exactly the kind of thing that triggers
   * vestibular symptoms.
   */
  const skipJourney = reduced;

  const handleDoorOpened = useCallback(() => {
    unlock(); // the click on the seal is the gesture that permits audio

    if (skipJourney) {
      setPhase("arrived");
      setVisible(false);
      setDoorMounted(false);
      onArrive(true);
      unlockScroll();
      return;
    }

    setPhase("journey");
    unlockScroll();
    onArrive(false);

    // Remove the leaves only once they have finished swinging clear.
    window.setTimeout(() => setDoorMounted(false), 2200);
  }, [skipJourney, onArrive, unlock]);

  /* Drive the journey from scroll position. */
  useEffect(() => {
    if (phase !== "journey" || skipJourney) return;
    const track = trackRef.current;
    if (!track) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;

        // The prompt has done its job the moment they start moving
        setShowHint(self.progress < 0.06);
        // Drop the renderer once the handoff is complete; restore it if they
        // scroll back up into the journey.
        setSceneOn(self.progress < 0.995);

        // The handoff happens deep inside the passage, not out in the desert —
        // fading any earlier would cut the entry through the doorway short.
        const fade = gsap.utils.clamp(0, 1, (self.progress - 0.955) / 0.045);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String(1 - fade);
          overlayRef.current.style.pointerEvents = fade > 0.5 ? "none" : "auto";
        }

        const done = self.progress > 0.985;
        setPhase((p) => (done && p === "journey" ? "arrived" : p));
        onArrive(self.progress > 0.9);
      },
    });

    ScrollTrigger.refresh();
    return () => st.kill();
  }, [phase, skipJourney, onArrive]);

  /**
   * Once the visitor is properly onto the site, lock the intro away for good:
   * tear the runway down and pin to the top. There is no scrolling back into
   * the journey — a reload is the only way to replay it. (This also unmounts
   * the second WebGL context, which is what otherwise tanks scroll perf below.)
   */
  useEffect(() => {
    if (phase !== "arrived") return;
    const check = () => {
      const track = trackRef.current;
      if (track && window.scrollY > track.offsetHeight * 0.98) setLocked(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [phase]);

  useLayoutEffect(() => {
    if (!locked) return;
    onArrive(true);
    unlockScroll();
    scrollToTop();
    // The runway just vanished — let ScrollTrigger re-measure the page.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [locked, onArrive]);

  if (locked) return null;

  return (
    <>
      {/* Scroll runway. Occupies real height so the page scrolls naturally —
          no hijacking, which keeps Lenis and ScrollTrigger in agreement. */}
      {!skipJourney && (
        <div
          ref={trackRef}
          aria-hidden
          style={{ height: phase === "door" ? "100svh" : `${TRACK_VH}vh` }}
        />
      )}

      {/* Not wrapped in AnimatePresence under reduced motion: the exit
          animation never resolves there, leaving a fixed full-screen overlay
          mounted over the site that silently swallows every scroll event. */}
      <ConditionalPresence animate={!skipJourney}>
        {visible && (
          <motion.div
            key="intro-overlay"
            ref={overlayRef}
            className="fixed inset-0 z-[160] overflow-hidden bg-void-900"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scenes 2–5 sit behind the door and are revealed as it opens */}
            {phase !== "door" && sceneOn && (
              <div className="absolute inset-0">
                <JourneyScene
                  progressRef={progressRef}
                  quality={isMobile ? "low" : "high"}
                />
              </div>
            )}

            {/* Scene 1 — kept above the canvas so the map is revealed
                through the widening gap as the leaves swing outward */}
            {doorMounted && (
              <div className="absolute inset-0 z-10">
                <SealedDoor onOpened={handleDoorOpened} muted={false} />
              </div>
            )}

            {/* Scroll invitation, only while the journey has barely begun */}
            {phase === "journey" && showHint && (
              <motion.div
                className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 1.2 }}
              >
                <span className="font-display text-[0.6rem] uppercase tracking-glyph text-gold/60">
                  Scroll to travel inward
                </span>
                <motion.span
                  className="h-8 w-px bg-gradient-to-b from-gold to-transparent"
                  animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </ConditionalPresence>
    </>
  );
}

/** AnimatePresence when we want the fade, a plain passthrough when we don't. */
function ConditionalPresence({
  animate,
  children,
}: {
  animate: boolean;
  children: React.ReactNode;
}) {
  if (!animate) return <>{children}</>;
  return <AnimatePresence>{children}</AnimatePresence>;
}
