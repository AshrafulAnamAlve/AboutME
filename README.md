# Ashraful Anam Alve — Portfolio
link-about-me-xi-five.vercel.app

A cinematic, Ancient-Egypt themed portfolio. The site opens as a sealed tomb: the
visitor breaks the seal, the doors part, ambient music rises, and each section
below is a further chamber of the dig.

Built with Next.js 16 (App Router), TypeScript, Tailwind, Framer Motion, GSAP +
ScrollTrigger, Lenis smooth scroll, and React Three Fiber.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

---

## Before you publish — things only you can fill in

These are marked `TODO` in `src/lib/data.ts`:

1. **Your two jobs need real dates and details.** You told me about
   *.NET Developer at Touch and Solve* and *QA Engineer at Avian BPO & IT*, but
   neither is in your CV, so I had to write them with placeholder date labels
   (`"Current"` / `"Previous"`) and deliberately general descriptions. Replace the
   `era` values with real date ranges and rewrite each `detail` with two or three
   specific things you actually shipped or owned. This is the single highest-value
   edit on the whole site — it is the part recruiters read hardest.

2. **Your CV PDF is out of date.** `public/documents/Ashraful_Anam_Alve_CV.pdf`
   is the file from your old repo and does not mention either job. The site links
   to it from four places. Replace the file (keep the filename) once you've
   updated it.

3. **Project links.** `Employee Portal` points at
   `github.com/AshrafulAnamAlve/EmployeePortal` — confirm that repo is public.
   None of the three projects have a live URL; add `live: "https://…"` to any
   entry in `treasures` and a **View Live** button appears automatically.

4. **Deployment URL.** `SITE_URL` in `src/app/layout.tsx` is set to your old
   GitHub Pages address. Point it at wherever this lands — it drives the
   canonical URL, OpenGraph tags and structured data.

---

## The intro sequence

The site opens on a six-scene ritual before the portfolio itself. Nothing below
the intro was changed — every existing section renders exactly as before.

1. **The sealed door** (`intro/SealedDoor.tsx`) — carved stone, hieroglyph
   columns, torches, fog, drifting dust, and a glowing seal. The page is frozen
   here.
2. **The break** — the seal fractures, golden light bursts out, sparks and
   stone fall, a synthesised rumble plays, and two leaves swing outward. The
   leaves stay mounted for the whole swing so the map is revealed through the
   widening gap.
3. **The chart** (`lib/parchment.ts`) — an antique world map drawn onto a
   canvas at runtime: real coastlines, ocean labels, compass rose, ships, sea
   serpents, rhumb lines, fold creases, burnt edges and a rope border.
4. **The descent** (`intro/JourneyScene.tsx`) — scroll drives a camera push
   *into* the parchment. Not a CSS zoom; a real perspective camera over ~620vh
   of runway.
5. **The desert** — the parchment dissolves, a dusk sky and dunes resolve, fog
   thickens, dust travels with the camera.
6. **The pyramid** — rises out of the sand, turns roughly 26° left-to-right
   across the whole reveal (never a continuous spin), and the camera closes on
   it before handing over to the homepage.

Afterwards a pyramid **watermark** (`ui/PyramidWatermark.tsx`) stays at ~7%
opacity for the rest of the session, drifting a few pixels with the cursor.

**Tuning it:** `TRACK_VH` in `intro/IntroExperience.tsx` sets how much scroll
the journey takes. The scene beats live in one place — the band comments at the
top of `JourneyScene.tsx` map progress 0→1 onto each scene.

**Sound** is synthesised in `lib/audio-fx.ts` (rumble, crack, dust) — no audio
files beyond your music track.

**Reduced motion** skips scenes 2–6 entirely and goes straight from the door to
the homepage. A scroll-driven camera push is exactly what triggers vestibular
symptoms, so it is not offered as an option there.

## Decisions worth knowing about

**Skills are your real stack, not an aspirational one.** Your prompt asked for
Python, React, Node.js, Computer Vision, Machine Learning, Image Processing,
Docker and Linux, plus an "AI Explorer" title. None of that appears in your CV or
GitHub, and you confirmed you wanted your real stack. Everything listed under
*The Relic Vault* is drawn from your CV and your actual repositories. If you do
pick up new skills, add them to `relics` in `src/lib/data.ts`.

**Music cannot auto-play on page load — no site can do this.** Every modern
browser blocks audio until the user interacts with the page. That is exactly why
the entry gate exists: "Break the Seal" is the click that unlocks playback, and
the track fades in over ~3 seconds from there. The preference is remembered in
`localStorage`, the track pauses when the tab is hidden, and the nav toggle mutes
it. This is the standard solution, not a workaround.

**No religious symbols are used anywhere.** The first build leaned on the Eye of
Horus (𓂀), the ankh (𓋹) and *netjer* (𓊹, the sign meaning "god") — all
ancient Egyptian religious iconography, and the single eye in particular carries
associations many Muslims object to. Every one has been removed. The glyphs now
in use are ordinary hieroglyphs: phonetic letters, tools, water, reeds, buildings
and the pyramid sign (𓉴). The atmosphere is unchanged — pyramids, obelisks,
torches, scrolls, stone and gold were always doing that work.

If you add glyphs later, stick to mundane signs. Avoid the eye (𓂀 𓁹), the ankh
(𓋹), *netjer* (𓊹), the scarab (𓆣) and the feather of Ma'at (𓆄) — all are
sacred symbols rather than decorative ones.

**Your referees are not on the site.** Your CV lists two people with their phone
numbers and personal emails. Publishing another person's contact details without
their consent exposes them to spam and worse, so I left them out. Share
references privately when asked — that is what employers expect anyway.

**The contact form opens the visitor's mail client.** There is no backend here,
so rather than pretend to send a message and silently drop it, the form composes
a `mailto:` with the fields filled in. If you want real submissions, wire it to
Formspree, Resend, or your own API and replace `handleSubmit` in
`src/components/sections/Contact.tsx`.

---

## Structure

```
src/
  app/
    layout.tsx          fonts, SEO metadata, JSON-LD Person schema
    page.tsx            composes the chambers, code-splits everything below the fold
    globals.css         design tokens, stone/glass surfaces, generated textures
  components/
    providers/
      SmoothScroll.tsx  Lenis + GSAP ScrollTrigger wiring
      AudioProvider.tsx playback, fades, tab-visibility ducking, persistence
    sections/           Hero, About, Skills, Projects, Journey, Gallery,
                        Certificates, Contact, HiddenChamber, Footer
    three/
      DesertScene.tsx   pyramids, dunes, obelisks, dust, cursor-driven camera
    ui/
      Preloader.tsx     the seal, the excavation counter, the parting doors
      Navigation.tsx    nav, scroll progress, audio toggle, mobile map
      Atmosphere.tsx    dust, god-rays, fog, torches, glyph wall, torch cursor
      Primitives.tsx    Reveal, RevealText, SectionHeading, TiltCard, Magnetic
  lib/data.ts           ALL content lives here — edit this, not the components
```

**To change any text on the site, edit `src/lib/data.ts`.** No copy is hardcoded
in the components.

---

## Performance & accessibility notes

- Everything below the hero is `next/dynamic` code-split; first load JS is ~225 kB.
- Textures (grain, stone, the glyph wall) are generated as inline SVG — zero
  image requests for atmosphere.
- The WebGL scene stops rendering entirely once the hero scrolls out of view
  (`frameloop="never"`), and never mounts at all until the seal is broken.
- `prefers-reduced-motion` disables Lenis, the 3D scene, the custom cursor, and
  the pinned horizontal gallery, falling back to a static painted background and
  native scrolling.
- Hieroglyphs use a real embedded font (Noto Sans Egyptian Hieroglyphs). Without
  it they render as empty boxes on virtually every machine.
- Full keyboard access, visible focus rings, a skip link, labelled form fields,
  and `aria-label`s on every icon-only control.

---

## Credits

Music: `smstudios93 — Ancient Egypt` (502872), in `public/music/`.
Make sure the licence covers public web use before you deploy.
