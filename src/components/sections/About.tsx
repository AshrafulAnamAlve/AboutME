"use client";

import { motion } from "framer-motion";
import { about, identity } from "@/lib/data";
import { Reveal, RevealText, Section, SectionHeading } from "@/components/ui/Primitives";
import { DustField, GlyphWall, Torch } from "@/components/ui/Atmosphere";

export default function About() {
  return (
    <Section id="about" className="overflow-hidden">
      {/* chamber walls */}
      <GlyphWall />
      <Torch side="left" />
      <Torch side="right" />
      <DustField count={22} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 44% at 50% 0%, rgba(169,113,66,0.12), transparent 70%)",
        }}
      />

      <SectionHeading
        glyph="𓊪"
        eyebrow="Chamber I"
        title="The Tablet of the Builder"
        intro="Carved for whoever opens this chamber next."
        className="mb-16 sm:mb-20"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
        {/* ── The tablet ── */}
        <Reveal>
          <article className="tablet tablet-notch relative h-full p-6 sm:p-10 lg:p-12">
            {/* chiselled top band */}
            <div className="mb-8 flex items-center justify-between border-b border-gold/15 pb-5">
              <div className="flex gap-2.5 text-gold/50">
                {["𓉴", "𓏛", "𓈖", "𓆓", "𓇋"].map((g, i) => (
                  <span
                    key={i}
                    className="animate-breathe font-display text-base sm:text-lg"
                    style={{ animationDelay: `${i * 0.55}s` }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              <span className="glyph-label">Inscription I</span>
            </div>

            <div className="space-y-5">
              {about.carved.map((line, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-serif text-xl leading-relaxed text-parchment/90 sm:text-2xl"
                      : "body-lg"
                  }
                >
                  <RevealText text={line} delay={i * 0.06} stagger={0.014} />
                </p>
              ))}
            </div>

            {/* carved signature */}
            <div className="mt-10 flex items-end justify-between gap-4 border-t border-gold/15 pt-6">
              <div>
                <div className="glyph-label mb-1.5">Sealed by</div>
                <div className="font-display text-base text-gold-pale sm:text-lg">
                  {identity.name}
                </div>
              </div>
              <div className="text-right">
                <div className="glyph-label mb-1.5">Cartouche</div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 px-3.5 py-1.5">
                  <span className="font-display text-sm text-gold">𓄿𓈙𓂋𓆑</span>
                </div>
              </div>
            </div>

            {/* hairline fracture across the stone */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M14 0 L18 22 L12 38 L22 61 L16 84 L24 100"
                fill="none"
                stroke="rgba(0,0,0,0.85)"
                strokeWidth="0.35"
              />
              <path
                d="M82 0 L78 18 L86 34 L79 55"
                fill="none"
                stroke="rgba(0,0,0,0.7)"
                strokeWidth="0.28"
              />
            </svg>
          </article>
        </Reveal>

        {/* ── Inscriptions column ── */}
        <div className="space-y-4">
          {about.inscriptions.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.07}>
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="stone-card group relative flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="glyph-label">{item.key}</span>
                <span className="text-right text-sm text-parchment/85">{item.value}</span>
                <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-gradient-to-b from-gold via-gold-pale to-transparent transition-transform duration-700 ease-tomb group-hover:scale-y-100" />
              </motion.div>
            </Reveal>
          ))}

          {/* availability seal */}
          <Reveal delay={0.5}>
            <div className="stone-card relative overflow-hidden p-6 text-center">
              <div
                aria-hidden
                className="absolute inset-0 opacity-45"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.24), transparent 65%)",
                }}
              />
              <div className="relative">
                <div className="animate-breathe text-glow mb-3 font-display text-3xl text-gold">
                  𓄤
                </div>
                <p className="font-serif text-base italic text-gold-pale/90">
                  {identity.availability}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
