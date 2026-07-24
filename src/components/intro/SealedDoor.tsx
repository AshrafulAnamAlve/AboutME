"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { seeded } from "@/lib/utils";
import { playCrack, playDust, playRumble } from "@/lib/audio-fx";

/* Door timings — the sound is scheduled against these exact numbers. */
const CRACK_MS = 1500; // seal splitting, light bleeding through
const SWING_MS = 4200; // the doors themselves moving

const GLYPH_COLUMNS = [
  ["𓉴", "𓈖", "𓏛", "𓆓", "𓇋", "𓉔"],
  ["𓋴", "𓄤", "𓏏", "𓅓", "𓎛", "𓃀"],
  ["𓉐", "𓊃", "𓆑", "𓎼", "𓈗", "𓁷"],
];

/** One half of the door — mirrored for the other side. */
function DoorLeaf({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const rand = seeded(isLeft ? 91 : 47);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* quarried stone — lifted well above the page black so the carving,
          grain and cracks actually read as rock rather than a dark panel */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? "linear-gradient(96deg, #241d13 0%, #4a3c26 40%, #574834 64%, #2b2318 100%)"
            : "linear-gradient(264deg, #241d13 0%, #4a3c26 40%, #574834 64%, #2b2318 100%)",
        }}
      />
      {/* torchlight falling across the face from the outer edge */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? "radial-gradient(70% 55% at 6% 28%, rgba(255,196,110,0.42), transparent 62%)"
            : "radial-gradient(70% 55% at 94% 28%, rgba(255,196,110,0.42), transparent 62%)",
        }}
      />
      {/* coarse rock grain */}
      <div
        className="absolute inset-0 opacity-[0.75] mix-blend-overlay"
        style={{ backgroundImage: "var(--tex-stone)", backgroundSize: "260px" }}
      />
      {/* fine pitting */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{ backgroundImage: "var(--tex-grain)", backgroundSize: "180px" }}
      />

      {/* recessed border panel */}
      <div
        className="absolute inset-[3.5%] border"
        style={{
          borderColor: "rgba(212,175,55,0.22)",
          boxShadow:
            "inset 0 0 60px rgba(0,0,0,0.9), inset 0 2px 0 rgba(245,230,179,0.06)",
        }}
      />
      <div
        className="absolute inset-[6%] border"
        style={{ borderColor: "rgba(169,113,66,0.18)" }}
      />

      {/* engraved hieroglyph columns */}
      <div
        className={`absolute inset-y-[11%] flex gap-[3.5vw] ${
          isLeft ? "right-[9%]" : "left-[9%]"
        }`}
      >
        {GLYPH_COLUMNS.map((col, ci) => (
          <div
            key={ci}
            className="flex flex-col items-center justify-around"
            style={{ opacity: 0.42 - ci * 0.08 }}
          >
            {col.map((g, gi) => (
              <span
                key={gi}
                className="font-display leading-none"
                style={{
                  fontSize: "clamp(0.85rem, 1.9vw, 1.9rem)",
                  color: "rgba(212,175,55,0.75)",
                  // carved, not printed: a dark bevel under a light top edge
                  textShadow:
                    "0 1px 0 rgba(245,230,179,0.16), 0 -1px 2px rgba(0,0,0,0.95)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* golden inlay banding */}
      <div
        className={`absolute inset-y-[8%] w-[3px] ${isLeft ? "right-[6.5%]" : "left-[6.5%]"}`}
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(212,175,55,0.55) 18%, rgba(245,230,179,0.75) 50%, rgba(212,175,55,0.55) 82%, transparent)",
          boxShadow: "0 0 14px rgba(212,175,55,0.5)",
        }}
      />

      {/* age cracks */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="0.28">
          {isLeft ? (
            <>
              <path d="M6 0 L11 19 L4 34 L14 58 L7 79 L16 100" />
              <path d="M38 0 L34 14 L41 27" />
              <path d="M20 44 L31 52 L26 68" />
              <path d="M62 12 L58 30 L67 46 L60 70" />
            </>
          ) : (
            <>
              <path d="M94 0 L88 21 L96 38 L86 61 L93 82 L84 100" />
              <path d="M62 0 L67 16 L59 29" />
              <path d="M78 40 L69 50 L74 66" />
              <path d="M38 10 L43 28 L34 47 L42 72" />
            </>
          )}
        </g>
      </svg>

      {/* rivets */}
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            top: `${8 + i * 13}%`,
            [isLeft ? "left" : "right"]: `${5 + rand() * 2}%`,
            background:
              "radial-gradient(circle at 35% 30%, #f5e6b3, #a97142 55%, #3a2c1c 100%)",
            boxShadow: "0 0 10px rgba(212,175,55,0.45), inset 0 -1px 2px rgba(0,0,0,0.8)",
          }}
        />
      ))}

      {/* the meeting edge catches torchlight */}
      <div
        className={`absolute inset-y-0 w-[6px] ${isLeft ? "right-0" : "left-0"}`}
        style={{
          background: isLeft
            ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.95))"
            : "linear-gradient(270deg, transparent, rgba(0,0,0,0.95))",
        }}
      />
    </div>
  );
}

export default function SealedDoor({
  onOpened,
  muted,
}: {
  onOpened: () => void;
  muted: boolean;
}) {
  const [phase, setPhase] = useState<"sealed" | "breaking" | "opening">("sealed");
  const rand = seeded(2024);

  const debris = Array.from({ length: 34 }, () => ({
    x: (rand() - 0.5) * 120,
    y: 20 + rand() * 90,
    size: 2 + rand() * 7,
    delay: rand() * 0.3,
    dur: 1.1 + rand() * 1.4,
    rot: (rand() - 0.5) * 720,
  }));

  const sparks = Array.from({ length: 46 }, () => {
    const a = rand() * Math.PI * 2;
    const d = 90 + rand() * 340;
    return {
      x: Math.cos(a) * d,
      y: Math.sin(a) * d,
      size: 1.5 + rand() * 4,
      delay: rand() * 0.22,
      dur: 0.9 + rand() * 1.1,
    };
  });

  const handleBreak = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("breaking");

    if (!muted) {
      playCrack();
      window.setTimeout(() => playDust(), 180);
    }

    // The seal shatters, then the leaves begin to move.
    window.setTimeout(() => {
      setPhase("opening");
      if (!muted) playRumble(SWING_MS / 1000);
      // Hand over just before the leaves finish, so the map is already
      // visible in the widening gap rather than appearing after it.
      window.setTimeout(onOpened, SWING_MS * 0.62);
    }, CRACK_MS);
  }, [phase, muted, onOpened]);

  const opening = phase === "opening";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1800px" }}>
      {/* ── LEFT LEAF ── */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 origin-left will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          opening
            ? { rotateY: -104, x: "-16%", filter: "brightness(0.35)" }
            : { rotateY: 0, x: "0%", filter: "brightness(1)" }
        }
        transition={{
          duration: SWING_MS / 1000,
          // Heavy: reluctant to start, unstoppable once moving, settles slowly
          ease: [0.72, 0.02, 0.24, 1],
        }}
      >
        <DoorLeaf side="left" />
      </motion.div>

      {/* ── RIGHT LEAF ── */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 origin-right will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
        animate={
          opening
            ? { rotateY: 104, x: "16%", filter: "brightness(0.35)" }
            : { rotateY: 0, x: "0%", filter: "brightness(1)" }
        }
        transition={{ duration: SWING_MS / 1000, ease: [0.72, 0.02, 0.24, 1] }}
      >
        <DoorLeaf side="right" />
      </motion.div>

      {/* ── Light escaping the seam as the doors part ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
        initial={{ width: 0, opacity: 0 }}
        animate={
          phase === "breaking"
            ? { width: 10, opacity: 0.9 }
            : opening
              ? { width: "62vw", opacity: [0.95, 0.75, 0] }
              : { width: 0, opacity: 0 }
        }
        transition={{
          duration: opening ? SWING_MS / 1000 : CRACK_MS / 1000,
          ease: [0.72, 0.02, 0.24, 1],
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,230,179,0.95) 35%, #fff8e0 50%, rgba(245,230,179,0.95) 65%, transparent)",
          filter: "blur(14px)",
        }}
      />

      {/* ── Torches ── */}
      {(["left", "right"] as const).map((s) => (
        <div
          key={s}
          aria-hidden
          className={`pointer-events-none absolute top-[24%] ${
            s === "left" ? "left-[4%]" : "right-[4%]"
          }`}
        >
          <div className="animate-torch">
            <div
              className="h-14 w-8 rounded-full sm:h-20 sm:w-11"
              style={{
                background:
                  "radial-gradient(50% 62% at 50% 72%, #fff8e0 0%, #f5e6b3 16%, #d4af37 40%, #c0492e 72%, transparent 88%)",
                filter: "blur(4px)",
              }}
            />
          </div>
          <div
            className="animate-torch-slow absolute -inset-28 -z-10 sm:-inset-40"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(192,73,46,0.2) 34%, transparent 68%)",
              filter: "blur(26px)",
            }}
          />
          <div className="mx-auto mt-1 h-9 w-4 rounded-b bg-gradient-to-b from-gold-bronze to-void-900 sm:h-12 sm:w-5" />
        </div>
      ))}

      {/* ── Fog drifting across the stone ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-drift opacity-[0.2]"
        style={{
          background:
            "radial-gradient(50% 36% at 26% 70%, rgba(169,113,66,0.7), transparent 72%), radial-gradient(42% 30% at 76% 40%, rgba(212,175,55,0.4), transparent 74%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── The seal ── */}
      <AnimatePresence>
        {phase !== "opening" && (
          <motion.div
            key="seal"
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleBreak}
              disabled={phase !== "sealed"}
              aria-label="Break the ancient seal to enter"
              className="group relative grid place-items-center rounded-full"
              style={{ width: "min(34vw, 15rem)", height: "min(34vw, 15rem)" }}
              animate={
                phase === "breaking"
                  ? { scale: [1, 1.18, 0.9], rotate: [0, -8, 4] }
                  : { scale: 1 }
              }
              transition={{ duration: CRACK_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
              whileHover={phase === "sealed" ? { scale: 1.05 } : undefined}
            >
              {/* outer ring */}
              <motion.span
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: "rgba(212,175,55,0.55)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
              />
              {/* inner ring, counter-turning */}
              <motion.span
                className="absolute inset-[13%] rounded-full border"
                style={{ borderColor: "rgba(169,113,66,0.5)" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
              />

              {/* the disc */}
              <span
                className="absolute inset-[20%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 36% 30%, #4a3922 0%, #2a2015 46%, #100e0a 100%)",
                  boxShadow:
                    "inset 0 3px 10px rgba(245,230,179,0.12), inset 0 -6px 18px rgba(0,0,0,0.9), 0 0 50px -8px rgba(212,175,55,0.5)",
                }}
              />

              {/* breathing glow */}
              <motion.span
                className="absolute inset-[-18%] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.35), transparent 66%)",
                  filter: "blur(22px)",
                }}
                animate={{ opacity: [0.45, 1, 0.45], scale: [0.94, 1.08, 0.94] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* the mark */}
              <span
                className="relative font-display text-gold"
                style={{
                  fontSize: "min(11vw, 4.6rem)",
                  textShadow:
                    "0 0 22px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)",
                }}
              >
                𓉴
              </span>

              {/* fracture lines, drawn on as it breaks */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                aria-hidden
              >
                <g
                  fill="none"
                  stroke="#fff8e0"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(245,230,179,0.95))" }}
                >
                  {[
                    "M50 50 L50 14",
                    "M50 50 L78 30",
                    "M50 50 L86 58",
                    "M50 50 L66 84",
                    "M50 50 L34 86",
                    "M50 50 L14 64",
                    "M50 50 L18 32",
                  ].map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        phase === "breaking"
                          ? { pathLength: 1, opacity: [0, 1, 0.7] }
                          : { pathLength: 0, opacity: 0 }
                      }
                      transition={{
                        duration: 0.65,
                        delay: i * 0.045,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  ))}
                </g>
              </svg>

              {/* golden light bursting out of the fractures */}
              <motion.span
                className="pointer-events-none absolute inset-[-40%] rounded-full"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={
                  phase === "breaking"
                    ? { opacity: [0, 1, 0], scale: [0.4, 2.4, 3.4] }
                    : { opacity: 0, scale: 0.4 }
                }
                transition={{ duration: CRACK_MS / 1000, ease: "easeOut" }}
                style={{
                  background:
                    "radial-gradient(circle, #fff8e0 0%, rgba(245,230,179,0.75) 22%, rgba(212,175,55,0.35) 45%, transparent 70%)",
                  filter: "blur(10px)",
                }}
              />
            </motion.button>

            {/* the invitation */}
            {/* Plain conditional render with a CSS fade — a nested
                AnimatePresence here left the wrapper stuck at opacity 0, and
                the call to action is not something that may fail to appear. */}
            {phase === "sealed" && (
              <div
                className="mt-10 text-center"
                style={{ animation: "cta-rise 1.1s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}
              >
                  <motion.p
                    className="font-display uppercase tracking-glyph text-gold-pale"
                    style={{ fontSize: "clamp(0.7rem, 1.6vw, 1rem)" }}
                    animate={{ opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Break the Ancient Seal
                  </motion.p>
                <p className="mt-3 text-[0.62rem] uppercase tracking-rune text-parchment/30">
                  Sound is part of this tomb
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sparks thrown out by the break ── */}
      {phase !== "sealed" &&
        sparks.map((s, i) => (
          <motion.span
            key={`spark-${i}`}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 rounded-full"
            style={{
              width: s.size,
              height: s.size,
              background: "radial-gradient(circle, #fff8e0, #d4af37 60%, transparent)",
              boxShadow: "0 0 10px rgba(245,230,179,0.9)",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0, 1, 0.3] }}
            transition={{ duration: s.dur, delay: s.delay, ease: "easeOut" }}
          />
        ))}

      {/* ── Stone shaken loose, falling ── */}
      {phase !== "sealed" &&
        debris.map((d, i) => (
          <motion.span
            key={`debris-${i}`}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-20"
            style={{
              width: d.size,
              height: d.size * 0.72,
              background: "linear-gradient(140deg, #6b5231, #2a2015)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.9)",
            }}
            initial={{ x: d.x, y: -10, opacity: 0, rotate: 0 }}
            animate={{ y: `${d.y}vh`, opacity: [0, 1, 1, 0], rotate: d.rot }}
            transition={{ duration: d.dur, delay: d.delay, ease: [0.4, 0, 0.7, 1] }}
          />
        ))}

      {/* ── Suspended dust ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => {
          const r = seeded(500 + i);
          const size = 1 + r() * 2.4;
          return (
            <span
              key={i}
              className="absolute bottom-[-8%] rounded-full bg-gold-pale"
              style={{
                left: `${r() * 100}%`,
                width: size,
                height: size,
                opacity: 0.2 + r() * 0.5,
                boxShadow: `0 0 ${size * 3}px rgba(235,203,139,0.7)`,
                animation: `dust-rise ${18 + r() * 26}s linear ${r() * 20}s infinite`,
                ["--drift" as string]: `${-30 + r() * 60}px`,
              }}
            />
          );
        })}
      </div>

      {/* vignette pulling the eye to the seal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 64% at 50% 46%, transparent 26%, rgba(6,5,4,0.5) 74%, rgba(6,5,4,0.9) 100%)",
        }}
      />
    </div>
  );
}
