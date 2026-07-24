"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";

import AudioProvider from "@/components/providers/AudioProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import IntroExperience from "@/components/intro/IntroExperience";
import Navigation from "@/components/ui/Navigation";
import PyramidWatermark from "@/components/ui/PyramidWatermark";
import { TorchCursor } from "@/components/ui/Atmosphere";
import Hero from "@/components/sections/Hero";

/* Everything below the fold is split out — the first paint stays light. */
const About = dynamic(() => import("@/components/sections/About"));
const Skills = dynamic(() => import("@/components/sections/Skills"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Journey = dynamic(() => import("@/components/sections/Journey"));
const Gallery = dynamic(() => import("@/components/sections/Gallery"));
const Certificates = dynamic(() => import("@/components/sections/Certificates"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const HiddenChamber = dynamic(() => import("@/components/sections/HiddenChamber"));
const Footer = dynamic(() => import("@/components/sections/Footer"));

export default function Page() {
  const [arrived, setArrived] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const focused = useRef(false);

  /**
   * Called as the intro hands over. Focus moves into the content once, so the
   * keyboard tab order continues sensibly after the overlay disappears.
   */
  const handleArrive = useCallback((isArrived: boolean) => {
    setArrived(isArrived);
    if (isArrived && !focused.current) {
      focused.current = true;
      requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
    }
  }, []);

  return (
    <AudioProvider>
      <SmoothScroll>
        {/* Scenes 1–6. Renders its own scroll runway above <main>. */}
        <IntroExperience onArrive={handleArrive} />

        <TorchCursor />
        <Navigation visible={arrived} />

        {/* What the pyramid leaves behind, for the rest of the session */}
        <PyramidWatermark active={arrived} />

        <main ref={mainRef} tabIndex={-1} className="outline-none">
          <Hero started={arrived} />
          <About />
          <Skills />
          <Projects />
          <Journey />
          <Gallery />
          <Certificates />
          <Contact />
          <HiddenChamber />
        </main>

        <Footer />
      </SmoothScroll>
    </AudioProvider>
  );
}
