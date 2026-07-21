"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsCoarsePointer } from "@/hooks/useMediaQuery";

/* ── Reveal: content rises out of the dark on scroll ──────── */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-12% 0px -12% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Words surface one at a time, like a translation ──────── */
export function RevealText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: "0em",
      filter: "blur(0px)",
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="inline-block whitespace-pre">
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── Section heading with glyph + rule ────────────────────── */
export function SectionHeading({
  glyph,
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  glyph: string;
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "relative",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      <Reveal>
        <div
          className={cn(
            "mb-5 flex items-center gap-4",
            centered && "justify-center"
          )}
        >
          {centered && <span className="h-px w-10 bg-gold/35 sm:w-16" />}
          <span className="animate-breathe text-glow font-display text-2xl text-gold">
            {glyph}
          </span>
          <span className="glyph-label">{eyebrow}</span>
          <span className="h-px w-10 bg-gold/35 sm:w-16" />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="heading-lg text-gilded">{title}</h2>
      </Reveal>

      {intro && (
        <Reveal delay={0.16}>
          <p className={cn("body-lg mt-6", centered && "mx-auto max-w-xl")}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── A card that tilts toward the cursor ──────────────────── */
export function TiltCard({
  children,
  className,
  intensity = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, on: false });
  const coarse = useIsCoarsePointer();

  const onMove = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      transform: `perspective(1000px) rotateX(${(0.5 - py) * intensity}deg) rotateY(${
        (px - 0.5) * intensity
      }deg) translateZ(0)`,
    });
    setGlarePos({ x: px * 100, y: py * 100, on: true });
  };

  const onLeave = () => {
    setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" });
    setGlarePos((g) => ({ ...g, on: false }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={style}
      className={cn(
        "relative transition-transform duration-500 ease-tomb will-change-transform",
        className
      )}
    >
      {children}
      {glare && !coarse && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: glarePos.on ? 1 : 0,
            background: `radial-gradient(30rem circle at ${glarePos.x}% ${glarePos.y}%, rgba(245,230,179,0.11), transparent 42%)`,
          }}
        />
      )}
    </div>
  );
}

/* ── Button that pulls toward the hand ────────────────────── */
export function MagneticButton({
  children,
  className,
  as = "button",
  href,
  onClick,
  download,
  target,
  rel,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  download?: boolean | string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const coarse = useIsCoarsePointer();

  const onMove = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setOffset({ x: x * 0.24, y: y * 0.32 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const inner = <span className="relative z-10 flex items-center gap-2.5">{children}</span>;

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block"
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: offset.x === 0 && offset.y === 0 ? "transform 0.6s cubic-bezier(0.16,1,0.3,1)" : "none",
      }}
    >
      {as === "a" ? (
        <a
          href={href}
          onClick={onClick}
          download={download}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          className={cn("btn-relic", className)}
        >
          {inner}
        </a>
      ) : (
        <button onClick={onClick} aria-label={ariaLabel} className={cn("btn-relic", className)}>
          {inner}
        </button>
      )}
    </div>
  );
}

/* ── Section shell: consistent rhythm everywhere ──────────── */
export function Section({
  id,
  children,
  className,
  full = false,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  full?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        full ? "" : "px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40",
        className
      )}
    >
      {full ? children : <div className="mx-auto max-w-chamber">{children}</div>}
    </section>
  );
}
