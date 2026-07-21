"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const TRACK = "/music/ancient-egypt.mp3";
const TARGET_VOLUME = 0.38; // ambient, never overpowering
const STORAGE_KEY = "tomb-audio-muted";

type AudioCtx = {
  playing: boolean;
  unlocked: boolean;
  toggle: () => void;
  unlock: () => void;
};

const Ctx = createContext<AudioCtx>({
  playing: false,
  unlocked: false,
  toggle: () => {},
  unlock: () => {},
});

export const useAudio = () => useContext(Ctx);

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  /* Create the element once. */
  useEffect(() => {
    const el = new Audio(TRACK);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    audioRef.current = el;

    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
      el.pause();
      el.src = "";
      audioRef.current = null;
    };
  }, []);

  /** Ramp volume smoothly — abrupt audio changes feel cheap. */
  const fadeTo = useCallback((target: number, ms = 1400, onDone?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);

    const from = el.volume;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min((now - start) / ms, 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      el.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        fadeRef.current = null;
        onDone?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  /**
   * Browsers block autoplaying audio until the user interacts with the page.
   * The preloader's "Enter" button is that interaction — this is called from there.
   */
  const unlock = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setUnlocked(true);

    if (localStorage.getItem(STORAGE_KEY) === "true") return;

    el.play()
      .then(() => {
        setPlaying(true);
        fadeTo(TARGET_VOLUME, 3200);
      })
      .catch(() => {
        // Autoplay still refused (rare after a gesture) — leave it to the toggle.
        setPlaying(false);
      });
  }, [fadeTo]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;

    if (playing) {
      fadeTo(0, 700, () => el.pause());
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      el.play()
        .then(() => {
          setPlaying(true);
          fadeTo(TARGET_VOLUME, 1500);
          localStorage.setItem(STORAGE_KEY, "false");
        })
        .catch(() => setPlaying(false));
    }
  }, [playing, fadeTo]);

  /* Duck the music when the explorer leaves the tab. */
  useEffect(() => {
    const onVisibility = () => {
      const el = audioRef.current;
      if (!el || !playing) return;
      if (document.hidden) {
        fadeTo(0, 500, () => el.pause());
      } else {
        el.play().then(() => fadeTo(TARGET_VOLUME, 1200)).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing, fadeTo]);

  return (
    <Ctx.Provider value={{ playing, unlocked, toggle, unlock }}>
      {children}
    </Ctx.Provider>
  );
}
