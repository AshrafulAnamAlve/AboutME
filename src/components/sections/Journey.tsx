"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { Compass } from "lucide-react";
import { expedition, atlas } from "@/lib/data";
import { Reveal, Section, SectionHeading } from "@/components/ui/Primitives";
import { DustField, GlyphWall } from "@/components/ui/Atmosphere";

/* A milestone on the route */
function Waypoint({
  glyph,
  era,
  title,
  place,
  detail,
  tags,
  side,
  index,
}: {
  glyph: string;
  era: string;
  title: string;
  place: string;
  detail: string;
  tags?: readonly string[];
  side: "left" | "right";
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });

  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-5 md:flex-row md:items-center md:gap-0 ${
        side === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* card */}
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full pl-14 md:w-[calc(50%-2.5rem)] md:pl-0 ${
          side === "left" ? "md:pr-10 md:text-right" : "md:pl-10"
        }`}
      >
        <div className="stone-card group relative p-6 sm:p-7">
          <div
            className={`mb-3 flex items-center gap-3 ${
              side === "left" ? "md:justify-end" : ""
            }`}
          >
            <span className="border border-gold/30 px-2.5 py-1 font-display text-[0.6rem] uppercase tracking-rune text-gold">
              {era}
            </span>
          </div>

          <h3 className="mb-1.5 font-display text-lg text-parchment sm:text-xl">{title}</h3>
          <p className="mb-4 font-serif text-sm italic text-gold-pale/75">{place}</p>
          <p className="text-sm leading-relaxed text-parchment/60">{detail}</p>

          {tags && (
            <div
              className={`mt-5 flex flex-wrap gap-1.5 ${
                side === "left" ? "md:justify-end" : ""
              }`}
            >
              {tags.map((t) => (
                <span
                  key={t}
                  className="border border-gold/15 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-gold-pale/70"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold/70 to-transparent transition-transform duration-700 ease-tomb group-hover:scale-x-100" />
        </div>
      </motion.div>

      {/* the pin on the route */}
      <div className="absolute left-[18px] top-7 z-10 md:static md:flex md:w-20 md:shrink-0 md:justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/45 bg-void-900 sm:h-11 sm:w-11">
            <span className="text-glow font-display text-sm text-gold sm:text-base">{glyph}</span>
            <motion.span
              className="absolute inset-0 rounded-full border border-gold/40"
              animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: index * 0.4,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* spacer for the other half */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </div>
  );
}

export default function Journey() {
  const routeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: routeRef,
    offset: ["start 78%", "end 55%"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 60, damping: 22, restDelta: 0.001 });
  const compassRotate = useTransform(scrollYProgress, [0, 1], [0, 540]);

  const glyphs = ["𓉔", "𓉴", "𓋴", "𓈖", "𓆓"];

  return (
    <Section id="journey" className="overflow-hidden">
      <GlyphWall />
      <DustField count={16} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 10%, rgba(169,113,66,0.1), transparent 70%)",
        }}
      />

      <SectionHeading
        glyph="𓈖"
        eyebrow="Chamber IV"
        title="The Route Travelled"
        intro="Training, study and practice — plotted the way a cartographer would."
        className="mb-16 sm:mb-24"
      />

      {/* the compass that turns as you descend */}
      <Reveal className="mb-16 flex justify-center">
        <motion.div style={{ rotate: compassRotate }} className="relative">
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/30 bg-void-800/60 backdrop-blur-sm sm:h-24 sm:w-24">
            <Compass size={30} strokeWidth={1} className="text-gold" />
            {["N", "E", "S", "W"].map((d, i) => (
              <span
                key={d}
                className="absolute font-display text-[0.55rem] text-gold/60"
                style={{
                  transform: `rotate(${i * 90}deg) translateY(-${34}px) rotate(-${i * 90}deg)`,
                }}
              >
                {d}
              </span>
            ))}
          </div>
          <div
            aria-hidden
            className="absolute -inset-5 -z-10"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.24), transparent 68%)",
              filter: "blur(18px)",
            }}
          />
        </motion.div>
      </Reveal>

      <div ref={routeRef} className="relative">
        {/* the route line */}
        <div className="absolute left-[34px] top-0 h-full w-px bg-gold/10 md:left-1/2 md:-translate-x-1/2">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-gold-leaf via-gold to-gold-bronze"
            style={{ scaleY: drawn, height: "100%" }}
          />
        </div>

        <div className="space-y-14 md:space-y-20">
          {expedition.map((e, i) => (
            <Waypoint
              key={e.title}
              glyph={glyphs[i % glyphs.length]}
              era={e.era}
              title={e.title}
              place={e.place}
              detail={e.detail}
              tags={e.focus}
              side={i % 2 === 0 ? "left" : "right"}
              index={i}
            />
          ))}

          {/* Education continues the same route */}
          <Reveal>
            <div className="relative flex items-center justify-center py-2">
              <span className="border border-gold/25 bg-void-800 px-4 py-1.5 font-display text-[0.6rem] uppercase tracking-glyph text-gold/70">
                The Atlas · Education
              </span>
            </div>
          </Reveal>

          {atlas.map((a, i) => (
            <Waypoint
              key={a.degree}
              glyph={a.status === "current" ? "𓇋" : "𓎛"}
              era={a.period}
              title={a.degree}
              place={a.institute}
              detail={`${a.result} · Charted at ${a.coords}`}
              side={(i + expedition.length) % 2 === 0 ? "left" : "right"}
              index={i + expedition.length}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
