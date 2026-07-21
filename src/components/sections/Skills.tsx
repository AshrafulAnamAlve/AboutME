"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { relics, relicTiers, type Relic } from "@/lib/data";
import { Reveal, Section, SectionHeading, TiltCard } from "@/components/ui/Primitives";
import { DustField, GlyphWall } from "@/components/ui/Atmosphere";

function RelicStone({ relic, index }: { relic: Relic; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, rotateX: -12 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.85, delay: (index % 8) * 0.055, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <TiltCard intensity={11}>
        <div className="stone-card group relative overflow-hidden p-5 sm:p-6">
          {/* excavation glow behind the relic */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 0%, rgba(212,175,55,0.22), transparent 70%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* the glyph, struck in gold */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center border border-gold/25 bg-void-900/70 transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_22px_-6px_rgba(212,175,55,0.8)]">
                <span className="text-glow font-display text-xl text-gold transition-transform duration-500 group-hover:scale-110">
                  {relic.glyph}
                </span>
              </div>

              <h3 className="font-display text-base text-parchment sm:text-lg">{relic.name}</h3>

              {/* the note surfaces on approach */}
              <motion.p
                initial={false}
                animate={{
                  height: hovered ? "auto" : 0,
                  opacity: hovered ? 1 : 0,
                  marginTop: hovered ? 8 : 0,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden text-xs leading-relaxed text-parchment/55"
              >
                {relic.note}
              </motion.p>
            </div>

            <span className="font-display text-[0.65rem] tabular-nums text-gold/45">
              {relic.mastery}
            </span>
          </div>

          {/* mastery seam */}
          <div className="relative mt-5 h-px w-full bg-gold/12">
            <motion.span
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-bronze via-gold to-gold-leaf"
              initial={{ width: 0 }}
              animate={inView ? { width: `${relic.mastery}%` } : {}}
              transition={{
                duration: 1.4,
                delay: 0.35 + (index % 8) * 0.055,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Skills() {
  const tiers = ["core", "forged", "tooled"] as const;

  return (
    <Section id="skills" className="overflow-hidden">
      <GlyphWall />
      <DustField count={18} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 40% at 78% 20%, rgba(140,58,40,0.1), transparent 68%)",
        }}
      />

      <SectionHeading
        glyph="𓏛"
        eyebrow="Chamber II"
        title="The Relic Vault"
        intro="Every instrument in this vault has been used to raise something real. Hover to read the inscription."
        className="mb-16 sm:mb-20"
      />

      <div className="space-y-14">
        {tiers.map((tier) => {
          const group = relics.filter((r) => r.tier === tier);
          const meta = relicTiers[tier];
          return (
            <div key={tier}>
              <Reveal>
                <div className="mb-6 flex items-center gap-4">
                  <h3 className="font-display text-sm uppercase tracking-rune text-gold-pale/80">
                    {meta.label}
                  </h3>
                  <span className="rule-gold flex-1" />
                  <span className="hidden text-[0.62rem] uppercase tracking-rune text-parchment/35 sm:block">
                    {meta.desc}
                  </span>
                </div>
              </Reveal>

              <div className="perspective grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.map((relic, i) => (
                  <RelicStone key={relic.name} relic={relic} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
