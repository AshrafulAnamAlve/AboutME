# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A cinematic, Ancient-Egypt-themed single-page portfolio for Ashraful Anam Alve. Next.js 16 (App Router) + TypeScript + Tailwind, with two three.js / react-three-fiber scenes, Lenis + GSAP ScrollTrigger, and Framer Motion. The site opens as a sealed tomb; breaking the seal plays a scroll-driven intro that hands over to the homepage.

## Commands

- `npm run dev` — dev server (Turbopack) on http://localhost:3000
- `npm run build` — production build; **also runs the TypeScript typecheck** and is the real correctness gate
- `npm start` — serve the production build
- `npx tsc --noEmit` — fast typecheck on its own
- **`npm run lint` is broken** — the repo has no ESLint 9 flat config (`eslint.config.*`), so ESLint errors out instead of linting. Don't rely on it; gate on `npx tsc --noEmit` / `npm run build`.
- No test framework is set up.

## Deploy

`main` is the Vercel **production** branch — pushing to `main` auto-deploys the live site. Run `npx next build` locally before pushing. GitHub remote: `AshrafulAnamAlve/AboutME`.

## Architecture

### Composition
`src/app/page.tsx` composes everything under `AudioProvider → SmoothScroll`: `IntroExperience`, then `<main>` with the section components (Hero, About, Skills, Projects, Journey, Gallery, Certificates, Contact, HiddenChamber) and Footer. Everything below the hero is `next/dynamic` code-split so first paint stays light. Path alias: `@/*` → `src/*`.

### Content is data-driven — edit `src/lib/data.ts`, not components
All site copy lives in typed exports in `src/lib/data.ts` (`identity`, `stats`, `about`, `relics`, `treasures`, `expedition`, `atlas`, `scrolls`, `achievements`, …). Components render from these; there is essentially no hardcoded copy. To change text or add a project/skill, edit data.ts.

### Two WebGL scenes — only one alive at a time
- `components/intro/JourneyScene.tsx` — the intro's scroll-driven camera journey (parchment map → desert → pyramid rise).
- `components/three/DesertScene.tsx` — the hero background scene; stops rendering (`frameloop="never"`) once the hero scrolls out, and never mounts until the seal is broken.
- **Invariant:** `IntroExperience` tears down the intro's WebGL context after the handover. Leaving a second live WebGL context alive tanks scroll performance of every section below — keep this teardown.

### The intro (scroll ritual)
`components/intro/IntroExperience.tsx` owns the flow: `SealedDoor` → scroll-driven journey → handover. Scroll progress 0→1 comes from a GSAP ScrollTrigger over a `TRACK_VH`-tall runway, written into a **ref** (`progressRef`) and read inside `useFrame`. The band comments at the top of `JourneyScene.tsx` map progress ranges onto each beat (map / desert / pyramid / close-in). Tune journey length via `TRACK_VH`.

### Scroll-frequency values use refs, never React state
Anything that changes at scroll/animation frequency (intro progress, camera position, pointer parallax) is a `useRef` read inside `useFrame`. Do not lift these into React state — it would re-render the tree ~60×/second.

### Runtime-generated textures (no atmosphere image assets)
`lib/parchment.ts` (antique world map), `lib/stone.ts` (`makePyramidStoneTextures`, `makeDesertSandTextures`, `makeSandstoneTextures`), and `lib/audio-fx.ts` (synthesized rumble/crack/dust) build `CanvasTexture`s / audio at runtime. Dispose any CanvasTexture you add in a `useEffect` cleanup (existing code does). The intro pyramid + floor were ported from the reference design at `public/design/Pyramid-standalone.html` (a bundled artifact — note it is served publicly).

### Scroll + audio providers
- `components/providers/SmoothScroll.tsx` wires Lenis + GSAP ScrollTrigger and exports `lockScroll` / `unlockScroll` / `scrollToSection` / `scrollToTop`. The Lenis instance lives on `window.__lenis`. Use `scrollToSection("#id")` for in-page nav.
- `components/providers/AudioProvider.tsx` handles playback: browsers block autoplay, so audio is unlocked by the "break the seal" click, then fades in, ducks on tab-hide, and persists the mute preference in `localStorage`.

### `prefers-reduced-motion` is a first-class path — keep it intact
Under reduced motion, Lenis, both WebGL scenes, the custom cursor, and the scroll-driven intro are all disabled; the visitor goes straight from the door to the homepage with native scrolling. Never make a scroll-hijacking camera the only route through the site.

## Design system

The Tailwind theme (`tailwind.config.ts`) defines the palette — `gold` (+ deep/bronze/pale/leaf), `void` (900–400), `sand`, `ochre`, `parchment` — and font families `display` (Cinzel), `serif` (Cormorant), `sans` (Inter), each trailing `var(--font-glyph)` (Noto Egyptian Hieroglyphs) so per-character fallback renders real hieroglyphs while Latin keeps its intended face. Design tokens and the grain/vignette/stone surfaces live in `src/app/globals.css`. Reuse these tokens rather than introducing new colors or fonts.

## Content rules

- **No sacred/religious hieroglyphs.** Avoid the eye (𓂀 𓁹), ankh (𓋹), *netjer* (𓊹), scarab (𓆣), and feather of Ma'at (𓆄). Use only mundane signs (letters, tools, water, reeds, buildings, the pyramid sign 𓉴).
- Skills and experience reflect the real stack in `data.ts`, not aspirational ones. There are `TODO`s in `data.ts` for job dates/details, the CV PDF, project links, and `SITE_URL` — see README.

## Verifying the 3D / intro visually

The intro is scroll-driven inside a full-screen overlay, so a specific frame is hard to inspect. To check a settled frame: render `JourneyScene` at a fixed `progressRef` (e.g. `0.995`) on a temporary route, run the dev server, and screenshot it with Playwright. Headless WebGL runs on SwiftShader, so allow ~15s of wait so the eased camera fully settles. Delete the temp route afterward.
