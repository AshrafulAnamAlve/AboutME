"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/components/providers/AudioProvider";
import { DustField } from "./Atmosphere";

const GLYPH_RING = ["𓉴", "𓏛", "𓈖", "𓆓", "𓇋", "𓉔", "𓄤", "𓏏", "𓅓", "𓎛", "𓋴", "𓃀"];

const OMENS = [
  "Brushing sand from the seal…",
  "Translating the outer inscriptions…",
  "Lighting the passage torches…",
  "The chamber has not been opened in 4,000 years…",
  "Something inside is still warm…",
];

export default function Preloader({ onEnter }: { onEnter: () => void }) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false); // doors are parting
  const [gone, setGone] = useState(false); // fully unmounted
  const [omen, setOmen] = useState(0);
  const { unlock } = useAudio();

  /**
   * Excavate to 100 on a *time* basis, not a frame basis. A frame-driven
   * counter stalls on weak GPUs — the loader would sit near zero while the
   * device struggled. Wall-clock keeps the dig honest at ~2.8s everywhere.
   */
  useEffect(() => {
    const DURATION = 2800;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // Decelerating — the last of the sand is always the slowest
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(eased * 100);

      if (t >= 1) {
        setReady(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    /**
     * rAF is throttled to a crawl in background tabs and starved under heavy
     * load — without this the seal would simply never appear. Timers keep
     * running, so this guarantees the gate always opens.
     */
    const failsafe = window.setTimeout(() => {
      setProgress(100);
      setReady(true);
      cancelAnimationFrame(frame);
    }, DURATION + 400);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
    };
  }, []);

  /* Rotate the omens. */
  useEffect(() => {
    if (ready) return;
    const id = setInterval(() => setOmen((o) => (o + 1) % OMENS.length), 1500);
    return () => clearInterval(id);
  }, [ready]);

  const handleEnter = () => {
    unlock(); // user gesture → audio permitted
    setLeaving(true); // doors part first…
    window.setTimeout(() => {
      onEnter(); // …hero begins revealing behind them…
      setGone(true); // …then the shell unmounts
    }, 1400);
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="preloader"
          className={`fixed inset-0 z-[200] flex items-center justify-center transition-colors duration-700 ${
            leaving ? "bg-transparent" : "bg-void-900"
          }`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* The doors of the tomb */}
          <motion.div
            className="absolute inset-y-0 left-0 z-20 w-1/2 origin-left border-r border-gold/25"
            style={{
              background:
                "linear-gradient(100deg, #0a0907 0%, #16130f 55%, #201b14 100%)",
            }}
            animate={leaving ? { x: "-102%" } : { x: 0 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 z-20 w-1/2 origin-right border-l border-gold/25"
            style={{
              background:
                "linear-gradient(260deg, #0a0907 0%, #16130f 55%, #201b14 100%)",
            }}
            animate={leaving ? { x: "102%" } : { x: 0 }}
            transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          />

          <DustField count={30} />

          {/* Content sits above the doors until they part */}
          <motion.div
            className="relative z-30 flex w-full max-w-md flex-col items-center px-6 text-center"
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Rotating glyph rings */}
            <div className="relative mb-12 h-48 w-48 sm:h-56 sm:w-56">
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 44, ease: "linear", repeat: Infinity }}
              >
                {GLYPH_RING.map((g, i) => {
                  const angle = (i / GLYPH_RING.length) * Math.PI * 2;
                  return (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2 font-display text-lg text-gold/55 sm:text-xl"
                      style={{
                        transform: `translate(-50%,-50%) translate(${Math.cos(angle) * 96}px, ${
                          Math.sin(angle) * 96
                        }px)`,
                      }}
                    >
                      {g}
                    </span>
                  );
                })}
              </motion.div>

              <motion.div
                className="absolute inset-8 rounded-full border border-gold/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, ease: "linear", repeat: Infinity }}
              >
                <span className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-t border-gold/70 bg-void-900" />
              </motion.div>

              {/* The eye at the centre */}
              <div className="absolute inset-0 grid place-items-center">
                <motion.span
                  className="text-glow-strong font-display text-5xl text-gold sm:text-6xl"
                  animate={{
                    opacity: [0.55, 1, 0.55],
                    scale: [0.97, 1.03, 0.97],
                  }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  𓉴
                </motion.span>
              </div>

              {/* Progress arc */}
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="rgba(212,175,55,0.12)"
                  strokeWidth="0.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="url(#pl-grad)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 47}
                  strokeDashoffset={2 * Math.PI * 47 * (1 - progress / 100)}
                  style={{ transition: "stroke-dashoffset 0.15s linear" }}
                />
                <defs>
                  <linearGradient id="pl-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a97142" />
                    <stop offset="50%" stopColor="#f5e6b3" />
                    <stop offset="100%" stopColor="#d4af37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="mb-2 font-display text-[0.6rem] uppercase tracking-glyph text-gold/50">
              Excavation
            </div>

            <div className="text-gilded mb-6 font-display text-6xl font-semibold tabular-nums sm:text-7xl">
              {Math.floor(progress)}
              <span className="text-2xl sm:text-3xl">%</span>
            </div>

            <div className="mb-10 h-px w-52 overflow-hidden bg-gold/12">
              <div
                className="h-full bg-gradient-to-r from-gold-bronze via-gold-leaf to-gold"
                style={{ width: `${progress}%`, transition: "width 0.15s linear" }}
              />
            </div>

            {/* Reserve real height — a 24px box let the note below collide
                with the button once the seal appeared. */}
            <div className="flex min-h-[3.5rem] items-center justify-center">
              {!ready ? (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={omen}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.45 }}
                    className="text-xs tracking-wide text-parchment/40"
                  >
                    {OMENS[omen]}
                  </motion.p>
                </AnimatePresence>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onClick={handleEnter}
                  className="btn-relic btn-relic-solid"
                >
                  Break the Seal
                </motion.button>
              )}
            </div>

            {ready && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.9 }}
                className="mt-6 text-[0.62rem] uppercase tracking-rune text-parchment/25"
              >
                Sound is part of this tomb — headphones advised
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
