"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Volume2, VolumeX, Menu, X, Download } from "lucide-react";
import { navLinks, identity } from "@/lib/data";
import { useAudio } from "@/components/providers/AudioProvider";
import { scrollToSection } from "@/components/providers/SmoothScroll";

export default function Navigation({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  const { playing, toggle } = useAudio();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });

  /* Condense the bar once the descent begins. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Track which chamber the explorer is standing in. */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Lock the body while the mobile menu is open. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (href: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollToSection(href), menuOpen ? 340 : 0);
  };

  return (
    <>
      {/* progress seam */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-gold-bronze via-gold-leaf to-gold"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[110] transition-all duration-700 ${
          scrolled
            ? "border-b border-gold/12 bg-void-900/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-chamber items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
          {/* seal / logo */}
          <button
            onClick={() => go("#hero")}
            className="group flex items-center gap-3"
            aria-label="Return to the threshold"
          >
            <span className="relative grid h-9 w-9 place-items-center border border-gold/35 transition-colors duration-500 group-hover:border-gold">
              <span className="font-display text-[0.7rem] tracking-wider text-gold">
                {identity.initials}
              </span>
              <span className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:shadow-[0_0_18px_-4px_rgba(212,175,55,0.9)]" />
            </span>
            <span className="hidden flex-col items-start sm:flex">
              <span className="font-display text-xs tracking-rune text-parchment/90">
                {identity.shortName}
              </span>
              <span className="text-[0.55rem] uppercase tracking-rune text-gold/50">
                {identity.role}
              </span>
            </span>
          </button>

          {/* desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className={`group relative px-3.5 py-2 text-[0.68rem] uppercase tracking-rune transition-colors duration-400 ${
                  active === l.href ? "text-gold" : "text-parchment/55 hover:text-gold-pale"
                }`}
              >
                <span className="mr-1.5 font-display text-gold/40 transition-colors group-hover:text-gold/80">
                  {l.glyph}
                </span>
                {l.label}
                {active === l.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2.5 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* controls */}
          <div className="flex items-center gap-2">
            {/* audio */}
            <button
              onClick={toggle}
              aria-label={playing ? "Silence the tomb" : "Wake the tomb"}
              aria-pressed={playing}
              className="group relative grid h-9 w-9 place-items-center border border-gold/25 transition-colors duration-500 hover:border-gold/70"
            >
              {playing ? (
                <Volume2 size={14} strokeWidth={1.5} className="text-gold" />
              ) : (
                <VolumeX size={14} strokeWidth={1.5} className="text-parchment/45" />
              )}
              {/* equaliser bars while playing */}
              {playing && (
                <span className="absolute -bottom-3 flex items-end gap-[2px]" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[2px] bg-gold/70"
                      animate={{ height: [3, 8, 3] }}
                      transition={{
                        duration: 0.9 + i * 0.22,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.12,
                      }}
                    />
                  ))}
                </span>
              )}
            </button>

            <a
              href={identity.cv}
              download
              className="hidden items-center gap-2 border border-gold/30 px-4 py-2.5 font-display text-[0.62rem] uppercase tracking-rune text-gold-pale transition-all duration-500 hover:border-gold/70 hover:shadow-[0_0_20px_-8px_rgba(212,175,55,0.9)] sm:flex"
            >
              <Download size={12} strokeWidth={1.6} /> CV
            </a>

            {/* mobile trigger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open the map"
              className="grid h-9 w-9 place-items-center border border-gold/25 text-gold transition-colors hover:border-gold/70 lg:hidden"
            >
              <Menu size={15} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile map ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[130] lg:hidden"
          >
            <div className="absolute inset-0 bg-void-900/96 backdrop-blur-xl" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              className="hieroglyph-wall absolute inset-0"
            />

            <div className="relative flex h-full flex-col px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="glyph-label">The Map</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close the map"
                  className="grid h-10 w-10 place-items-center border border-gold/25 text-gold"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col justify-center gap-1">
                {navLinks.map((l, i) => (
                  <motion.button
                    key={l.href}
                    initial={{ opacity: 0, x: -28 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => go(l.href)}
                    className="group flex items-center gap-4 border-b border-gold/10 py-4 text-left"
                  >
                    <span className="font-display text-xl text-gold/50 transition-colors group-hover:text-gold">
                      {l.glyph}
                    </span>
                    <span className="font-display text-xl text-parchment/85 transition-colors group-hover:text-gold-pale">
                      {l.label}
                    </span>
                    <span className="ml-auto font-display text-[0.6rem] text-gold/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-3 pb-4"
              >
                <a href={identity.cv} download className="btn-relic btn-relic-solid w-full">
                  <Download size={14} strokeWidth={1.6} /> Take the Scroll
                </a>
                <a
                  href={`mailto:${identity.email}`}
                  className="block text-center text-xs text-parchment/40"
                >
                  {identity.email}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
