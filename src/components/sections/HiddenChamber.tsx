"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { identity, footerQuote } from "@/lib/data";
import { DustField } from "@/components/ui/Atmosphere";

/**
 * The last chamber. It stays sealed until the explorer actually reaches
 * the bottom — then the artefact rises out of the dark.
 */
export default function HiddenChamber() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setOpened(true), 500);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section
      ref={ref}
      aria-label="The hidden chamber"
      className="relative flex min-h-[86svh] items-center justify-center overflow-hidden bg-void-900 px-5"
    >
      {/* the chamber darkens then ignites */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 2.6, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(46% 44% at 50% 48%, rgba(212,175,55,0.24), rgba(140,58,40,0.09) 42%, transparent 72%)",
        }}
      />

      <DustField count={40} />

      {/* light shafts converging on the artefact */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0.5 : 0 }}
        transition={{ duration: 3, delay: 0.6 }}
      >
        {[-26, -12, 0, 12, 26].map((rot, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-[130%] w-24 origin-top"
            style={{
              transform: `translateX(-50%) rotate(${rot}deg)`,
              background:
                "linear-gradient(to bottom, rgba(245,230,179,0.5), transparent 70%)",
              filter: "blur(30px)",
              opacity: 0.32,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 text-center">
        {/* The artefact */}
        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.7 }}
          animate={opened ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex justify-center"
        >
          <div className="relative">
            {/* slow rotating outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              className="absolute -inset-12 rounded-full border border-gold/20 sm:-inset-16"
            >
              {["𓂀", "𓋹", "𓊹", "𓆓", "𓈖", "𓉔"].map((g, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const r = 104;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 font-display text-sm text-gold/45"
                    style={{
                      transform: `translate(-50%,-50%) translate(${Math.cos(angle) * r}px, ${
                        Math.sin(angle) * r
                      }px)`,
                    }}
                  >
                    {g}
                  </span>
                );
              })}
            </motion.div>

            {/* counter-rotating inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 38, ease: "linear", repeat: Infinity }}
              className="absolute -inset-4 rounded-full border border-gold/25 sm:-inset-6"
            />

            {/* the eye itself */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                filter: [
                  "drop-shadow(0 0 26px rgba(212,175,55,0.6))",
                  "drop-shadow(0 0 62px rgba(212,175,55,0.95))",
                  "drop-shadow(0 0 26px rgba(212,175,55,0.6))",
                ],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid h-32 w-32 place-items-center rounded-full sm:h-40 sm:w-40"
              style={{
                background:
                  "radial-gradient(circle at 42% 34%, rgba(245,230,179,0.28), rgba(15,14,11,0.9) 62%)",
                border: "1px solid rgba(212,175,55,0.5)",
              }}
            >
              <span className="text-glow-strong font-display text-6xl text-gold sm:text-7xl">
                𓂀
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={opened ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="glyph-label mb-6">The chamber opens</div>

          <h2 className="heading-lg text-gilded-live mb-7">Thank you, Explorer.</h2>

          <p className="mx-auto mb-2 max-w-lg font-serif text-lg italic leading-relaxed text-parchment/60 sm:text-xl">
            &ldquo;{footerQuote}&rdquo;
          </p>

          <div className="mx-auto my-9 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <p className="mx-auto max-w-md text-sm leading-relaxed text-parchment/45">
            You reached the end of the dig. If something here is worth building on,{" "}
            <a
              href={`mailto:${identity.email}`}
              className="text-gold-pale underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
            >
              send word
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
