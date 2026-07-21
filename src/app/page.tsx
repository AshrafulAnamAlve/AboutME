"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";

import AudioProvider from "@/components/providers/AudioProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import Navigation from "@/components/ui/Navigation";
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
  const [entered, setEntered] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  /**
   * The seal button unmounts with the preloader, which leaves keyboard focus
   * orphaned on <body>. Hand it to the content so tabbing continues sensibly.
   */
  const handleEnter = useCallback(() => {
    setEntered(true);
    requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <AudioProvider>
      <SmoothScroll>
        <Preloader onEnter={handleEnter} />
        <TorchCursor />
        <Navigation visible={entered} />

        <main ref={mainRef} tabIndex={-1} className="outline-none">
          <Hero started={entered} />
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
