"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send, Download } from "lucide-react";
import { identity } from "@/lib/data";
import { Reveal, Section, SectionHeading, MagneticButton } from "@/components/ui/Primitives";
import { DustField, GlyphWall, Torch } from "@/components/ui/Atmosphere";

const channels = [
  { icon: Mail, label: "Email", value: identity.email, href: `mailto:${identity.email}` },
  { icon: Phone, label: "Call", value: identity.phone, href: "tel:+8801876935462" },
  { icon: MapPin, label: "Found at", value: identity.location, href: null },
];

const links = [
  { icon: Github, label: "GitHub", href: "https://github.com/AshrafulAnamAlve" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/asraful-anam-alve/" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  /**
   * No backend exists for this site, so the form hands off to the visitor's own
   * mail client rather than pretending to send. An honest failure mode beats a
   * silent one — a message that vanishes is worse than no form at all.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `A message from ${form.name || "an explorer"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? `\n${form.email}` : ""}`
    );
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full border border-gold/18 bg-void-900/60 px-4 py-3.5 text-sm text-parchment placeholder:text-parchment/30 outline-none transition-all duration-400 focus:border-gold/60 focus:bg-void-900/85 focus:shadow-[0_0_22px_-10px_rgba(212,175,55,0.8)]";

  return (
    <Section id="contact" className="overflow-hidden">
      <GlyphWall />
      <DustField count={26} />
      <Torch side="left" />
      <Torch side="right" />

      {/* the temple mouth glows from within */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 52% at 50% 42%, rgba(212,175,55,0.16), transparent 66%), radial-gradient(70% 40% at 50% 100%, rgba(140,58,40,0.14), transparent 70%)",
        }}
      />

      <SectionHeading
        glyph="𓁹"
        eyebrow="The Final Chamber"
        title="Enter the Temple"
        intro="The door is open. Say what brought you here."
        className="mb-16 sm:mb-20"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
        {/* ── The offering form ── */}
        <Reveal>
          <div className="tablet tablet-notch relative p-6 sm:p-9">
            <div className="glyph-label mb-6">Leave your inscription</div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="c-name"
                    required
                    className={field}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="sr-only">
                    Your email
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    required
                    className={field}
                    placeholder="Your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="c-subject" className="sr-only">
                  Subject
                </label>
                <input
                  id="c-subject"
                  className={field}
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="c-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="c-message"
                  required
                  rows={5}
                  className={`${field} resize-none`}
                  placeholder="What are you building?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="btn-relic btn-relic-solid">
                  <Send size={14} strokeWidth={1.6} /> Send the Message
                </button>
                <a href={identity.cv} download className="btn-relic">
                  <Download size={14} strokeWidth={1.6} /> Take the Scroll
                </a>
              </div>

              <p className="pt-2 text-[0.68rem] leading-relaxed text-parchment/35">
                This opens your own mail app with the message ready to send — nothing is
                stored on this site.
              </p>
            </form>
          </div>
        </Reveal>

        {/* ── The channels ── */}
        <div className="space-y-4">
          {channels.map((c, i) => {
            const Inner = (
              <div className="stone-card group flex items-center gap-4 p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center border border-gold/25 bg-void-900/60 transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_20px_-8px_rgba(212,175,55,0.9)]">
                  <c.icon size={16} strokeWidth={1.4} className="text-gold" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="glyph-label mb-1">{c.label}</div>
                  <div className="truncate text-sm text-parchment/85">{c.value}</div>
                </div>
              </div>
            );

            return (
              <Reveal key={c.label} delay={i * 0.08}>
                {c.href ? (
                  <a href={c.href} className="block">
                    {Inner}
                  </a>
                ) : (
                  Inner
                )}
              </Reveal>
            );
          })}

          {/* social torches */}
          <Reveal delay={0.28}>
            <div className="stone-card p-6">
              <div className="glyph-label mb-5">Follow the trail</div>
              <div className="flex gap-3">
                {links.map((l) => (
                  <motion.a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative grid h-12 w-12 place-items-center border border-gold/25 transition-colors duration-500 hover:border-gold/70"
                  >
                    <l.icon size={17} strokeWidth={1.4} className="text-gold/80 group-hover:text-gold" />
                    <span className="pointer-events-none absolute -inset-2 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span
                        className="block h-full w-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(212,175,55,0.35), transparent 68%)",
                          filter: "blur(10px)",
                        }}
                      />
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* availability */}
          <Reveal delay={0.36}>
            <div className="stone-card relative overflow-hidden p-6 text-center">
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 50% 100%, rgba(212,175,55,0.22), transparent 68%)",
                }}
              />
              <div className="relative">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <span className="glyph-label !text-gold/80">Open for work</span>
                </div>
                <p className="font-serif text-base italic text-parchment/70">
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
