"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrolls, achievements } from "@/lib/data";
import { Reveal, Section, SectionHeading, TiltCard } from "@/components/ui/Primitives";
import { DustField, GlyphWall } from "@/components/ui/Atmosphere";

/* ── A sealed scroll that breaks open ─────────────────────── */
function SealedScroll({
  scroll,
  index,
}: {
  scroll: (typeof scrolls)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={index * 0.12}>
      <div className="stone-card relative overflow-hidden">
        {/* the scroll body */}
        <div className="relative p-6 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-5">
            <div className="flex-1">
              <div className="glyph-label mb-2">{scroll.period}</div>
              <h3 className="mb-1.5 font-display text-lg leading-snug text-parchment sm:text-xl">
                {scroll.title}
              </h3>
              <p className="font-serif text-sm italic text-gold-pale/75">{scroll.issuer}</p>
            </div>

            {/* the wax seal */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Reseal the scroll" : "Break the seal to read"}
              className="group relative shrink-0"
            >
              <motion.div
                animate={
                  open
                    ? { scale: 1.06, rotate: -12 }
                    : { scale: 1, rotate: 0 }
                }
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid h-14 w-14 place-items-center rounded-full sm:h-16 sm:w-16"
                style={{
                  background:
                    "radial-gradient(circle at 35% 28%, #c0492e 0%, #8c3a28 42%, #5a2418 100%)",
                  boxShadow:
                    "inset 0 2px 6px rgba(255,255,255,0.22), inset 0 -3px 8px rgba(0,0,0,0.55), 0 6px 18px -6px rgba(0,0,0,0.9)",
                }}
              >
                {/* wax rim irregularity */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{
                    background:
                      "radial-gradient(circle at 72% 78%, rgba(0,0,0,0.4), transparent 52%)",
                  }}
                />
                <span className="relative font-display text-xl text-gold-leaf/90 sm:text-2xl">
                  {scroll.seal}
                </span>

                {/* crack line appears when broken */}
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-y-1 left-1/2 w-px bg-void-900/70"
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <span className="mt-2 block text-center text-[0.52rem] uppercase tracking-rune text-gold/50 transition-colors group-hover:text-gold/80">
                {open ? "Sealed" : "Break"}
              </span>
            </button>
          </div>

          {/* the revealed text */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="rule-gold mb-5" />
                <p className="text-sm leading-relaxed text-parchment/65">{scroll.detail}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* parchment edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
        />
      </div>
    </Reveal>
  );
}

export default function Certificates() {
  return (
    <Section id="certificates" className="overflow-hidden">
      <GlyphWall />
      <DustField count={16} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 76% 24%, rgba(140,58,40,0.12), transparent 68%)",
        }}
      />

      <SectionHeading
        glyph="𓆓"
        eyebrow="Chamber V"
        title="Sealed Scrolls"
        intro="Break a seal to read what it certifies."
        className="mb-16 sm:mb-20"
      />

      <div className="mb-24 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {scrolls.map((s, i) => (
          <SealedScroll key={s.title} scroll={s} index={i} />
        ))}
      </div>

      {/* ── Achievements ── */}
      <SectionHeading
        glyph="𓆃"
        eyebrow="The Offerings"
        title="Marks of the Expedition"
        className="mb-14"
      />

      <div className="perspective grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08}>
            <TiltCard intensity={10}>
              <div className="stone-card group h-full p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full border border-gold/25 bg-void-900/60 transition-all duration-600 group-hover:border-gold/60 group-hover:shadow-[0_0_26px_-8px_rgba(212,175,55,0.9)]">
                    <span className="text-glow font-display text-xl text-gold transition-transform duration-500 group-hover:scale-110">
                      {a.glyph}
                    </span>
                  </div>
                </div>
                <h3 className="mb-2.5 font-display text-sm uppercase tracking-rune text-gold-pale">
                  {a.title}
                </h3>
                <p className="text-xs leading-relaxed text-parchment/55">{a.detail}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
