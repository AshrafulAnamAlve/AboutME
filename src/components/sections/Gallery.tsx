"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { treasures } from "@/lib/data";
import { SectionHeading } from "@/components/ui/Primitives";
import { DustField, GlyphWall } from "@/components/ui/Atmosphere";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";

/** Panels: real artefacts interleaved with carved glyph reliefs. */
const panels = [
  { kind: "glyph" as const, glyph: "𓉔", caption: "The Threshold" },
  { kind: "image" as const, src: treasures[0].image, caption: treasures[0].name, sub: treasures[0].epithet },
  { kind: "glyph" as const, glyph: "𓂀", caption: "The Watching Eye" },
  { kind: "image" as const, src: treasures[1].image, caption: treasures[1].name, sub: treasures[1].epithet },
  { kind: "glyph" as const, glyph: "𓋹", caption: "The Breath of Life" },
  { kind: "image" as const, src: treasures[2].image, caption: treasures[2].name, sub: treasures[2].epithet },
  { kind: "glyph" as const, glyph: "𓆓", caption: "The Sealed Word" },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    // On small screens and reduced-motion, the frieze scrolls natively.
    if (isMobile || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile, reduced]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative overflow-hidden py-24 sm:py-28"
    >
      <GlyphWall />
      <DustField count={14} />

      <div className="mx-auto mb-14 max-w-chamber px-5 sm:px-8 lg:px-12">
        <SectionHeading
          glyph="𓏏"
          eyebrow="Chamber VI"
          title="The Frieze"
          intro="A wall of carvings — the work, and the marks between it."
        />
      </div>

      {/* The frieze itself */}
      <div
        ref={trackRef}
        className={
          isMobile || reduced
            ? "flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8"
            : "flex gap-6 px-[6vw] will-change-transform"
        }
      >
        {panels.map((p, i) => (
          <div
            key={i}
            className={`relative shrink-0 snap-center ${
              p.kind === "image"
                ? "h-[52vh] w-[80vw] sm:h-[58vh] sm:w-[62vw] lg:w-[38vw]"
                : "h-[52vh] w-[62vw] sm:h-[58vh] sm:w-[38vw] lg:w-[20vw]"
            }`}
          >
            {p.kind === "image" ? (
              <figure className="group relative h-full w-full overflow-hidden border border-gold/20 bg-void-900">
                <Image
                  src={p.src}
                  alt={`${p.caption} — ${p.sub}`}
                  fill
                  sizes="(max-width: 768px) 80vw, 40vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-[1.6s] ease-tomb group-hover:scale-105"
                  style={{ filter: "sepia(0.34) saturate(1.12) contrast(1.05) brightness(0.98)" }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,9,7,0.9) 4%, rgba(10,9,7,0.25) 30%, transparent 62%), radial-gradient(60% 50% at 70% 12%, rgba(212,175,55,0.14), transparent 66%)",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="glyph-label mb-1.5">{p.sub}</div>
                  <div className="font-display text-xl text-gilded sm:text-2xl">{p.caption}</div>
                </figcaption>
                <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-700 group-hover:border-gold/40" />
              </figure>
            ) : (
              <div
                className="group relative grid h-full w-full place-items-center overflow-hidden border border-gold/15"
                style={{
                  background:
                    "linear-gradient(165deg, rgba(44,37,27,0.75), rgba(15,14,11,0.92))",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{ backgroundImage: "var(--tex-stone)", backgroundSize: "200px" }}
                />
                <div className="relative text-center">
                  <div className="text-glow-strong mb-5 animate-breathe font-display text-6xl text-gold sm:text-7xl">
                    {p.glyph}
                  </div>
                  <div className="glyph-label">{p.caption}</div>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-4 border border-gold/10"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {!isMobile && !reduced && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.58rem] uppercase tracking-glyph text-gold/35">
          Keep descending — the wall moves
        </div>
      )}
    </section>
  );
}
