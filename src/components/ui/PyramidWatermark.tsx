"use client";

import { useEffect, useRef } from "react";
import { useIsCoarsePointer, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * What the pyramid leaves behind once the intro hands over.
 *
 * Deliberately SVG rather than a second WebGL canvas: at 6% opacity nobody can
 * tell the difference, and keeping a renderer alive for the whole session to
 * draw a faint silhouette would cost real battery on every page.
 */
export default function PyramidWatermark({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useIsCoarsePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active || coarse || reduced) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      // Very subtle — a few pixels of drift, not a parallax showpiece
      tx = (e.clientX / window.innerWidth - 0.5) * 26;
      ty = (e.clientY / window.innerHeight - 0.5) * 16;
    };

    const loop = () => {
      x += (tx - x) * 0.045;
      y += (ty - y) * 0.045;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active, coarse, reduced]);

  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: 0.075 }}
    >
      <div
        ref={ref}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ width: "150vmax", height: "150vmax" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="wm-face" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5E6B3" />
              <stop offset="55%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A97142" />
            </linearGradient>
            <linearGradient id="wm-shade" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A97142" />
              <stop offset="100%" stopColor="#2C251B" />
            </linearGradient>
          </defs>
          {/* lit face */}
          <path d="M50 22 L50 74 L20 74 Z" fill="url(#wm-face)" />
          {/* shaded face */}
          <path d="M50 22 L50 74 L80 74 Z" fill="url(#wm-shade)" />
          {/* course lines */}
          <g stroke="#0F0E0B" strokeWidth="0.22" opacity="0.5">
            {Array.from({ length: 11 }).map((_, i) => {
              const t = (i + 1) / 12;
              const yy = 22 + t * 52;
              const half = t * 30;
              return <line key={i} x1={50 - half} y1={yy} x2={50 + half} y2={yy} />;
            })}
          </g>
          <path d="M50 22 L50 74" stroke="#F5E6B3" strokeWidth="0.16" opacity="0.55" />
        </svg>
      </div>
    </div>
  );
}
