"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ScrollText, X } from "lucide-react";
import { treasures, type Treasure } from "@/lib/data";
import { Reveal, Section, SectionHeading } from "@/components/ui/Primitives";
import { DustField, GlyphWall } from "@/components/ui/Atmosphere";

function TreasureCase({
  treasure,
  index,
  onOpen,
}: {
  treasure: Treasure;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const flipped = index % 2 === 1;

  // Parallax on the artefact image
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <article
      ref={ref}
      className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
        flipped ? "lg:[direction:rtl]" : ""
      }`}
    >
      {/* ── The artefact ── */}
      <motion.div
        initial={{ opacity: 0, x: flipped ? 44 : -44 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        className="group relative [direction:ltr]"
      >
        <div className="relative overflow-hidden border border-gold/20 bg-void-900">
          {/* The scroll unrolls to reveal it */}
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div style={{ y: imgY }} className="relative aspect-[4/3] w-full">
              <Image
                src={treasure.image}
                alt={`${treasure.name} — ${treasure.epithet}`}
                fill
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="scale-110 object-cover transition-all duration-[1.4s] ease-tomb group-hover:scale-[1.16]"
                style={{ filter: "sepia(0.32) saturate(1.15) contrast(1.06) brightness(1.02)" }}
              />
            </motion.div>
          </motion.div>

          {/* torchlight wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-50"
            style={{
              background:
                "linear-gradient(to top, rgba(10,9,7,0.82) 2%, rgba(15,14,11,0.16) 34%, transparent 60%), radial-gradient(60% 50% at 74% 10%, rgba(212,175,55,0.16), transparent 68%)",
            }}
          />

          {/* gold seam that traces the case on hover */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-1000 ease-tomb group-hover:scale-x-100" />

          {/* year plate */}
          <div className="absolute right-4 top-4 border border-gold/30 bg-void-900/85 px-3 py-1 backdrop-blur-sm">
            <span className="font-display text-[0.62rem] tracking-rune text-gold">
              {treasure.year}
            </span>
          </div>

          {/* corner rivets */}
          {["left-2 top-2", "right-2 top-2", "bottom-2 left-2", "bottom-2 right-2"].map((p) => (
            <span key={p} className={`absolute ${p} h-1 w-1 rounded-full bg-gold/50`} />
          ))}
        </div>

        <div
          aria-hidden
          className="absolute -inset-6 -z-10 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.2), transparent 66%)",
            filter: "blur(30px)",
          }}
        />
      </motion.div>

      {/* ── The plaque ── */}
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.05, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="[direction:ltr]"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="font-display text-xs tabular-nums text-gold/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-10 bg-gold/40" />
          <span className="glyph-label">{treasure.epithet}</span>
        </div>

        <h3 className="heading-md text-gilded mb-4">{treasure.name}</h3>

        <p className="body-lg mb-6">{treasure.summary}</p>

        <div className="mb-7 flex flex-wrap gap-2">
          {treasure.stack.map((s) => (
            <span
              key={s}
              className="border border-gold/18 bg-gold/[0.06] px-3 py-1.5 text-[0.65rem] uppercase tracking-wider text-gold-pale/85 transition-colors duration-400 hover:border-gold/50 hover:bg-gold/10"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button onClick={onOpen} className="btn-relic btn-relic-solid !px-6 !py-3">
            <ScrollText size={14} strokeWidth={1.6} /> Case Study
          </button>
          {treasure.github && (
            <a
              href={treasure.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-relic !px-6 !py-3"
            >
              <Github size={14} strokeWidth={1.6} /> Source
            </a>
          )}
          {treasure.live && (
            <a
              href={treasure.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-relic !px-6 !py-3"
            >
              <ExternalLink size={14} strokeWidth={1.6} /> View Live
            </a>
          )}
        </div>
      </motion.div>
    </article>
  );
}

/* ── The opened scroll ────────────────────────────────────── */
function Chronicle({ treasure, onClose }: { treasure: Treasure; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${treasure.name} case study`}
    >
      <div
        className="absolute inset-0 bg-void-900/92 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        initial={{ scaleY: 0.02, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 0.02, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
        className="tablet relative max-h-[86vh] w-full max-w-2xl overflow-y-auto p-6 sm:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-4 top-4 border border-gold/25 p-2 text-gold/70 transition-colors hover:border-gold/60 hover:text-gold"
        >
          <X size={15} strokeWidth={1.6} />
        </button>

        <div className="glyph-label mb-3">{treasure.epithet}</div>
        <h3 className="heading-md text-gilded mb-2">{treasure.name}</h3>
        <div className="rule-gold mb-7 mt-5" />

        <div className="space-y-4">
          {treasure.chronicle.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.7 }}
              className="body-lg"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-gold/15 pt-6">
          {treasure.stack.map((s) => (
            <span
              key={s}
              className="border border-gold/20 px-3 py-1.5 text-[0.65rem] uppercase tracking-wider text-gold-pale/80"
            >
              {s}
            </span>
          ))}
        </div>

        {treasure.github && (
          <a
            href={treasure.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-relic mt-7 !px-6 !py-3"
          >
            <Github size={14} strokeWidth={1.6} /> Open the Source
          </a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<Treasure | null>(null);

  return (
    <Section id="projects" className="overflow-hidden">
      <GlyphWall />
      <DustField count={20} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(56% 42% at 22% 30%, rgba(212,175,55,0.09), transparent 68%)",
        }}
      />

      <SectionHeading
        glyph="𓂀"
        eyebrow="Chamber III"
        title="The Treasury"
        intro="Three structures raised from nothing. Each one still standing."
        className="mb-16 sm:mb-24"
      />

      <div className="space-y-24 sm:space-y-32">
        {treasures.map((t, i) => (
          <TreasureCase key={t.slug} treasure={t} index={i} onOpen={() => setOpen(t)} />
        ))}
      </div>

      <Reveal className="mt-20">
        <div className="rule-gold mb-8" />
        <p className="text-center font-serif text-lg italic text-parchment/50">
          More is being excavated. The dig continues on{" "}
          <a
            href="https://github.com/AshrafulAnamAlve"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-pale underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
          >
            GitHub
          </a>
          .
        </p>
      </Reveal>

      <AnimatePresence>
        {open && <Chronicle treasure={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </Section>
  );
}
