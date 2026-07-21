"use client";

import { useEffect, useRef } from "react";
import { seeded } from "@/lib/utils";
import { useIsCoarsePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/* ── Floating dust motes ──────────────────────────────────── */
export function DustField({ count = 44, className = "" }: { count?: number; className?: string }) {
  const rand = seeded(1337);
  const motes = Array.from({ length: count }, () => ({
    left: rand() * 100,
    size: 1 + rand() * 2.6,
    delay: rand() * 26,
    duration: 20 + rand() * 30,
    drift: -30 + rand() * 60,
    opacity: 0.18 + rand() * 0.5,
  }));

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute bottom-[-10%] rounded-full bg-gold-pale"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            opacity: m.opacity,
            boxShadow: `0 0 ${m.size * 3}px rgba(235,203,139,0.65)`,
            animation: `dust-rise ${m.duration}s linear ${m.delay}s infinite`,
            ["--drift" as string]: `${m.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Volumetric god-rays ──────────────────────────────────── */
export function LightShafts({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {[
        { left: "12%", w: 130, rot: 14, op: 0.09, dur: "17s" },
        { left: "38%", w: 190, rot: 9, op: 0.13, dur: "23s" },
        { left: "64%", w: 150, rot: -11, op: 0.1, dur: "19s" },
        { left: "84%", w: 110, rot: -16, op: 0.07, dur: "27s" },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute -top-1/3 h-[180%] origin-top animate-drift"
          style={{
            left: s.left,
            width: s.w,
            opacity: s.op,
            transform: `rotate(${s.rot}deg)`,
            animationDuration: s.dur,
            background:
              "linear-gradient(to bottom, rgba(245,230,179,0.85), rgba(212,175,55,0.28) 45%, transparent 78%)",
            filter: "blur(28px)",
          }}
        />
      ))}
    </div>
  );
}

/* ── Drifting fog banks ───────────────────────────────────── */
export function FogBank({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -inset-[20%] animate-drift opacity-[0.16]"
        style={{
          background:
            "radial-gradient(46% 34% at 22% 68%, rgba(169,113,66,0.6), transparent 70%), radial-gradient(38% 30% at 74% 42%, rgba(212,175,55,0.35), transparent 72%), radial-gradient(52% 26% at 50% 90%, rgba(90,36,24,0.42), transparent 74%)",
          filter: "blur(58px)",
        }}
      />
      <div
        className="absolute -inset-[25%] animate-drift opacity-[0.1]"
        style={{
          animationDirection: "reverse",
          animationDuration: "48s",
          background:
            "radial-gradient(40% 30% at 62% 30%, rgba(235,203,139,0.5), transparent 70%), radial-gradient(44% 28% at 30% 80%, rgba(44,37,27,0.9), transparent 72%)",
          filter: "blur(72px)",
        }}
      />
    </div>
  );
}

/* ── A torch that gutters and throws light ────────────────── */
export function Torch({
  side = "left",
  className = "",
}: {
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-0 h-full w-40 sm:w-56 ${
        side === "left" ? "left-0" : "right-0"
      } ${className}`}
    >
      {/* bracket */}
      <div
        className={`absolute top-[26%] ${side === "left" ? "left-6 sm:left-10" : "right-6 sm:right-10"}`}
      >
        <div className="relative">
          {/* flame */}
          <div className="animate-torch">
            <div
              className="h-9 w-5 rounded-full sm:h-12 sm:w-7"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 70%, #fff6d8 0%, #f5e6b3 18%, #d4af37 42%, #c0492e 74%, transparent 88%)",
                filter: "blur(3px)",
              }}
            />
          </div>
          {/* halo */}
          <div
            className="animate-torch-slow absolute -inset-16 -z-10 sm:-inset-24"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.4) 0%, rgba(192,73,46,0.16) 34%, transparent 68%)",
              filter: "blur(22px)",
            }}
          />
          {/* sconce */}
          <div className="mx-auto mt-1 h-6 w-3 rounded-b-sm bg-gradient-to-b from-gold-bronze to-void-900 sm:h-8 sm:w-4" />
          <div className="mx-auto h-10 w-1 bg-gradient-to-b from-void-500 to-transparent sm:h-16" />
        </div>
      </div>
    </div>
  );
}

/* ── A hieroglyph wall that breathes ──────────────────────── */
export function GlyphWall({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`hieroglyph-wall pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

/* ── Cursor: a pool of torchlight that follows the hand ───── */
export function TorchCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const coarse = useIsCoarsePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (coarse || reduced) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let hx = mx;
    let hy = my;
    let raf = 0;
    let woken = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Don't paint a stray dot in the middle of the screen before the
      // explorer has actually moved their hand.
      if (!woken) {
        woken = true;
        hx = mx;
        hy = my;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (haloRef.current) haloRef.current.style.opacity = "1";
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      hx += (mx - hx) * 0.11;
      hy += (my - hy) * 0.11;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, textarea");
      if (dotRef.current) {
        dotRef.current.style.width = interactive ? "44px" : "8px";
        dotRef.current.style.height = interactive ? "44px" : "8px";
        dotRef.current.style.borderWidth = interactive ? "1px" : "0px";
        dotRef.current.style.backgroundColor = interactive
          ? "transparent"
          : "rgba(245,230,179,0.95)";
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [coarse, reduced]);

  if (coarse || reduced) return null;

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-[420px] w-[420px] rounded-full opacity-0 mix-blend-screen transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.11) 0%, rgba(192,73,46,0.05) 38%, transparent 68%)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[96] rounded-full border-gold/70 opacity-0 transition-[width,height,background-color,border-width,opacity] duration-300 ease-tomb"
        style={{ width: 8, height: 8, backgroundColor: "rgba(245,230,179,0.95)" }}
      />
    </>
  );
}
