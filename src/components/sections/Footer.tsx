"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { identity, navLinks, footerQuote } from "@/lib/data";
import { scrollToSection } from "@/components/providers/SmoothScroll";
import { GlyphWall } from "@/components/ui/Atmosphere";

const socialLinks = [
  { icon: Github, href: "https://github.com/AshrafulAnamAlve", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/asraful-anam-alve/", label: "LinkedIn" },
  { icon: Mail, href: `mailto:${identity.email}`, label: "Email" },
];

export default function Footer() {
  const { scrollYProgress } = useScroll();
  const needle = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <footer className="relative overflow-hidden border-t border-gold/12 bg-void-900 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <GlyphWall />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(212,175,55,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-chamber">
        {/* ── The compass ── */}
        <div className="mb-14 flex justify-center">
          <div className="relative">
            <div className="relative grid h-28 w-28 place-items-center rounded-full border border-gold/25 bg-void-800/50 backdrop-blur-sm sm:h-32 sm:w-32">
              {/* cardinal marks */}
              {["N", "E", "S", "W"].map((d, i) => (
                <span
                  key={d}
                  className="absolute font-display text-[0.6rem] tracking-wider text-gold/55"
                  style={{
                    transform: `rotate(${i * 90}deg) translateY(-46px) rotate(-${i * 90}deg)`,
                  }}
                >
                  {d}
                </span>
              ))}
              {/* tick ring */}
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-1.5 w-px bg-gold/25"
                  style={{
                    transform: `rotate(${i * 15}deg) translateY(-53px)`,
                  }}
                />
              ))}

              {/* the needle tracks your descent */}
              <motion.div style={{ rotate: needle }} className="absolute inset-0 grid place-items-center">
                <div className="relative h-20 w-1 sm:h-24">
                  <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-gold-leaf to-gold" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-gradient-to-b from-void-500 to-void-600" />
                </div>
              </motion.div>

              <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_14px_rgba(212,175,55,0.9)]" />
            </div>

            <div
              aria-hidden
              className="absolute -inset-6 -z-10"
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent 68%)",
                filter: "blur(22px)",
              }}
            />
          </div>
        </div>

        {/* ── The quote ── */}
        <p className="mx-auto mb-14 max-w-xl text-center font-serif text-xl italic leading-relaxed text-parchment/55 sm:text-2xl">
          &ldquo;{footerQuote}&rdquo;
        </p>

        <div className="rule-gold mb-12" />

        {/* ── Columns ── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-gold/30 font-display text-xs text-gold">
                {identity.initials}
              </span>
              <div>
                <div className="font-display text-sm text-parchment">{identity.name}</div>
                <div className="text-[0.62rem] uppercase tracking-rune text-parchment/40">
                  {identity.role}
                </div>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-parchment/40">
              {identity.intro}
            </p>
          </div>

          <div>
            <div className="glyph-label mb-4">Chambers</div>
            <ul className="grid grid-cols-2 gap-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollToSection(l.href)}
                    className="group flex items-center gap-2 text-xs text-parchment/50 transition-colors hover:text-gold-pale"
                  >
                    <span className="font-display text-gold/40 transition-colors group-hover:text-gold">
                      {l.glyph}
                    </span>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="glyph-label mb-4">Send word</div>
            <a
              href={`mailto:${identity.email}`}
              className="mb-2 block break-all text-xs text-parchment/50 transition-colors hover:text-gold-pale"
            >
              {identity.email}
            </a>
            <div className="mb-5 text-xs text-parchment/40">{identity.location}</div>
            <div className="flex gap-2.5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center border border-gold/20 text-gold/70 transition-all duration-400 hover:border-gold/60 hover:text-gold hover:shadow-[0_0_16px_-6px_rgba(212,175,55,0.9)]"
                >
                  <s.icon size={14} strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Base ── */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-7 sm:flex-row">
          <p className="text-[0.65rem] tracking-wide text-parchment/30">
            © {new Date().getFullYear()} {identity.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-gold/30">
            {["𓂀", "𓋹", "𓊹", "𓆓", "𓈖"].map((g, i) => (
              <span
                key={i}
                className="animate-breathe font-display text-xs"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {g}
              </span>
            ))}
          </div>

          <button
            onClick={() => scrollToSection("#hero")}
            className="group flex items-center gap-2 text-[0.65rem] uppercase tracking-rune text-parchment/35 transition-colors hover:text-gold-pale"
          >
            <ArrowUp
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:-translate-y-1"
            />
            Return to the surface
          </button>
        </div>
      </div>
    </footer>
  );
}
