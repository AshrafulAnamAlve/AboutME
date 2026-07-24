"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Mail, ChevronDown, MapPin } from "lucide-react";
import { identity, stats } from "@/lib/data";
import { MagneticButton } from "@/components/ui/Primitives";
import { DustField, LightShafts, FogBank, GlyphWall } from "@/components/ui/Atmosphere";
import { scrollToSection } from "@/components/providers/SmoothScroll";

const DesertScene = dynamic(() => import("@/components/three/DesertScene"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(70% 52% at 50% 62%, rgba(212,175,55,0.16), transparent 68%)",
      }}
    />
  ),
});

export default function Hero({ started }: { started: boolean }) {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(
      () => setTitleIndex((i) => (i + 1) % identity.titles.length),
      3400
    );
    return () => clearInterval(id);
  }, [started]);

  // Everything waits for the doors to open.
  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 34 },
    animate: started ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 },
    transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="hero"
      /* `clip` not `hidden`: an overflow-hidden box is a scroll container, and
         Chromium refuses to chain wheel scrolling out of one. With Lenis
         absent (reduced motion) that left the page completely unscrollable.
         `clip` clips identically without creating a scroll container. */
      className="relative flex min-h-[100svh] w-full items-center overflow-clip"
    >
      {/* ── Layers of the world ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-900 via-void-800 to-void-700" />
      {/* The desert is only rendered once the seal is broken — running WebGL
          behind an opaque preloader just starves the loader of frames. */}
      {started && <DesertScene />}
      <GlyphWall />
      <FogBank />
      <LightShafts />
      <DustField count={48} />

      {/* Horizon glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, rgba(15,14,11,0.96) 6%, rgba(169,113,66,0.14) 46%, transparent 100%)",
        }}
      />

      {/* Reading scrim — the desert must never win against the name. Weighted
          to the left where the copy sits, so the right stays open sky. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,9,7,0.88) 0%, rgba(10,9,7,0.62) 30%, rgba(10,9,7,0.2) 56%, rgba(10,9,7,0) 100%)",
        }}
      />

      {/* ── Content ── */}
      {/* Vertical rhythm is tuned to survive a 900px-tall laptop viewport —
          the stats row was clipping below the fold at lg:pt-32. */}
      <div className="relative z-10 mx-auto grid w-full max-w-chamber grid-cols-1 items-center gap-10 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:px-12 lg:pb-16 lg:pt-24">
        {/* Left — the inscription */}
        <div>
          <motion.div {...reveal(0.15)} className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-gold/50" />
            <span className="glyph-label">Expedition 2027 · Dhaka</span>
          </motion.div>

          <motion.p {...reveal(0.25)} className="mb-4 font-serif text-lg italic text-gold-pale/70 sm:text-xl">
            From the sands of Barishal, a builder emerges —
          </motion.p>

          <motion.h1 {...reveal(0.35)} className="heading-xl mb-4">
            <span className="text-gilded-live block">Ashraful</span>
            <span className="block text-parchment/95">Anam Alve</span>
          </motion.h1>

          {/* Rotating titles */}
          {/* One title at a time, absolutely placed.
              The previous version stacked all four and slid them behind a
              clipped 44px window — which made this a scrollable box, and
              Chromium refuses to chain wheel scrolling out of one. It froze
              the entire page for anyone scrolling with the cursor here and
              no Lenis (i.e. reduced motion). No overflow, no trap. */}
          <motion.div {...reveal(0.5)} className="relative mb-6 h-9 sm:h-11">
            <AnimatePresence mode="wait">
              <motion.span
                key={identity.titles[titleIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center font-display text-base uppercase tracking-rune text-gold-pale sm:text-xl"
              >
                {identity.titles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p {...reveal(0.6)} className="body-lg mb-7 max-w-xl">
            {identity.tagline}
          </motion.p>

          <motion.div {...reveal(0.72)} className="mb-8 flex flex-wrap gap-3 sm:gap-4">
            <MagneticButton
              className="btn-relic-solid"
              onClick={() => scrollToSection("#about")}
              ariaLabel="Explore the journey"
            >
              Explore the Journey
            </MagneticButton>
            <MagneticButton
              as="a"
              href={identity.cv}
              download="Ashraful_Anam_Alve_CV.pdf"
              ariaLabel="Download CV"
            >
              <Download size={15} strokeWidth={1.6} /> The Scroll (CV)
            </MagneticButton>
            <MagneticButton onClick={() => scrollToSection("#contact")} ariaLabel="Contact">
              <Mail size={15} strokeWidth={1.6} /> Summon Me
            </MagneticButton>
          </motion.div>

          {/* Stats carved in a row */}
          <motion.div
            {...reveal(0.85)}
            className="grid max-w-2xl grid-cols-2 gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="group bg-void-800/85 px-4 py-4 backdrop-blur-sm">
                <div className="text-gilded font-display text-2xl font-semibold sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[0.62rem] uppercase tracking-rune text-parchment/45">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — the portrait, entombed in stone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={started ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-none"
        >
          <div className="relative">
            {/* Outer sarcophagus frame */}
            <div className="relative border border-gold/25 bg-gradient-to-b from-void-600/60 to-void-900/80 p-3 backdrop-blur-sm">
              {/* corner rivets */}
              {[
                "left-1.5 top-1.5",
                "right-1.5 top-1.5",
                "bottom-1.5 left-1.5",
                "bottom-1.5 right-1.5",
              ].map((pos) => (
                <span
                  key={pos}
                  className={`absolute ${pos} h-1.5 w-1.5 rounded-full bg-gold/60 shadow-[0_0_8px_rgba(212,175,55,0.7)]`}
                />
              ))}

              {/* Arched portrait niche */}
              <div
                className="group relative overflow-hidden bg-void-900"
                style={{ borderRadius: "50% 50% 6px 6px / 26% 26% 3px 3px" }}
              >
                <Image
                  src="/images/profile.jpg"
                  alt="Portrait of Ashraful Anam Alve"
                  width={640}
                  height={800}
                  priority
                  sizes="(max-width: 1024px) 60vw, 30vw"
                  className="portrait-relic h-auto w-full object-cover"
                />

                {/* torchlight falling across the face */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-overlay"
                  style={{
                    background:
                      "linear-gradient(122deg, rgba(245,230,179,0.32) 0%, transparent 44%), radial-gradient(70% 55% at 30% 22%, rgba(212,175,55,0.34), transparent 66%)",
                  }}
                />
                {/* shadow pooling at the base */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,9,7,0.94) 2%, rgba(10,9,7,0.35) 26%, transparent 58%)",
                  }}
                />
                {/* dust on the glass */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay"
                  style={{
                    backgroundImage: "var(--tex-stone)",
                    backgroundSize: "200px",
                  }}
                />
              </div>

              {/* Cartouche nameplate */}
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-gold/15 px-1 pt-3">
                <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-rune text-parchment/45">
                  <MapPin size={11} strokeWidth={1.6} className="text-gold/70" />
                  Dhaka, BD
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-rune text-gold-pale/80">
                    Available
                  </span>
                </div>
              </div>
            </div>

            {/* Glyph columns flanking the portrait */}
            <div className="pointer-events-none absolute -left-7 top-8 hidden flex-col gap-4 text-gold/30 lg:flex">
              {["𓉴", "𓏛", "𓈖", "𓆓"].map((g, i) => (
                <span
                  key={i}
                  className="animate-breathe font-display text-lg"
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  {g}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute -right-7 top-14 hidden flex-col gap-4 text-gold/30 lg:flex">
              {["𓈖", "𓉔", "𓄤", "𓏏"].map((g, i) => (
                <span
                  key={i}
                  className="animate-breathe font-display text-lg"
                  style={{ animationDelay: `${i * 0.6 + 0.3}s` }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* halo behind everything */}
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 opacity-55"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(212,175,55,0.26), transparent 66%)",
                filter: "blur(38px)",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.7, duration: 1 }}
        onClick={() => scrollToSection("#about")}
        aria-label="Scroll to begin"
        /* Centred it collides with the stats row on a 900px-tall laptop —
           on wide screens it moves under the portrait column, which is clear. */
        /* Only shown where the hero is exactly one screen tall. Once the layout
           stacks, the content visibly continues and the hint just collides
           with the portrait. */
        className="absolute bottom-6 right-4 z-10 hidden flex-col items-center gap-2 lg:flex xl:right-6"
      >
        <span className="text-[0.58rem] uppercase tracking-glyph text-gold/55">Descend</span>
        <span className="relative flex h-9 w-[22px] justify-center overflow-hidden rounded-full border border-gold/35">
          <motion.span
            className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <ChevronDown size={13} className="animate-bounce text-gold/45" strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}
