"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile, useReducedMotion } from "@/hooks/useMediaQuery";

/**
 * A WebGL loop that keeps drawing after the hero has scrolled away burns
 * battery and steals main-thread time from every scroll animation below it.
 * This reports whether the canvas is anywhere near the viewport.
 */
function useOnScreen<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  return onScreen;
}

/* ── The great pyramid, hewn from gold-lit stone ──────────── */
function Pyramid({
  position,
  scale,
  opacity = 1,
}: {
  position: [number, number, number];
  scale: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Barely-there breathing so it never feels like a static image
    const t = clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.055) * 0.045;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <coneGeometry args={[1, 1.28, 4, 1]} />
      <meshStandardMaterial
        color="#6b5231"
        emissive="#a97142"
        emissiveIntensity={0.06}
        roughness={0.96}
        metalness={0.1}
        flatShading
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

/* ── An obelisk, catching the last of the light ───────────── */
function Obelisk({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.06;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 2.4, 0.3]} />
        <meshStandardMaterial
          color="#33271a"
          emissive="#a97142"
          emissiveIntensity={0.05}
          roughness={0.94}
          metalness={0.16}
          flatShading
        />
      </mesh>
      {/* The capstone still catches gold — it's the one bright note out there */}
      <mesh position={[0, 1.36, 0]}>
        <coneGeometry args={[0.235, 0.34, 4, 1]} />
        <meshStandardMaterial
          color="#8a6a30"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          roughness={0.45}
          metalness={0.7}
          flatShading
        />
      </mesh>
    </group>
  );
}

/* ── Dust suspended in the shaft of light ─────────────────── */
function DustMotes({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = Math.random() * 14 - 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      speeds[i] = 0.1 + Math.random() * 0.32;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 0.55;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.28 + i) * delta * 0.06;
      if (arr[i * 3 + 1] > 11) {
        arr[i * 3 + 1] = -3;
        arr[i * 3] = (Math.random() - 0.5) * 26;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#f5e6b3"
        transparent
        opacity={0.62}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── The dunes ────────────────────────────────────────────── */
function Dunes() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(70, 44, 64, 40);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h =
        Math.sin(x * 0.16) * 0.85 +
        Math.cos(y * 0.2) * 0.6 +
        Math.sin(x * 0.06 + y * 0.09) * 1.35;
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <meshStandardMaterial
        color="#4a3922"
        emissive="#a97142"
        emissiveIntensity={0.035}
        roughness={1}
        metalness={0.04}
        flatShading
      />
    </mesh>
  );
}

/* ── Camera drifts with the cursor — depth without nausea ─── */
function CameraRig({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ pointer }, delta) => {
    if (!enabled) return;
    target.current.x = pointer.x * 1.15;
    target.current.y = pointer.y * 0.55;

    const k = 1 - Math.pow(0.001, delta); // frame-rate independent easing
    camera.position.x += (target.current.x - camera.position.x) * k;
    camera.position.y += (1.1 + target.current.y - camera.position.y) * k;
    camera.lookAt(0, 0.2, 0);
  });

  return null;
}

/* ── The whole vista ──────────────────────────────────────── */
export default function DesertScene({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(hostRef);

  // A still, painted fallback if WebGL is unavailable or motion is unwanted.
  if (failed || reduced) {
    return (
      <div
        aria-hidden
        className={`absolute inset-0 ${className}`}
        style={{
          background:
            "radial-gradient(70% 52% at 50% 62%, rgba(212,175,55,0.2), transparent 68%), linear-gradient(180deg, #0a0907 0%, #16130f 46%, #2c251b 100%)",
        }}
      />
    );
  }

  return (
    <div ref={hostRef} aria-hidden className={`absolute inset-0 ${className}`}>
      <Canvas
        /* Stops drawing entirely once the hero leaves the viewport. */
        frameloop={onScreen ? "always" : "never"}
        dpr={[1, isMobile ? 1.4 : 1.9]}
        camera={{ position: [0, 1.1, 9.2], fov: 46 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={() => setFailed(true)}
      >
        {/* Heavy, close fog is what turns geometry into atmosphere — the
            monuments should read as silhouettes in haze, never as lit shapes. */}
        <fog attach="fog" args={["#100e0a", 9, 30]} />

        {/* Low ambient — the tomb is dark by default */}
        <ambientLight intensity={0.2} color="#a97142" />

        {/* The sun, low and raking. No shadow map — flat-shaded geometry already
            reads as carved stone, and the shadow pass costs more than it adds. */}
        <directionalLight position={[6.5, 5, 2]} intensity={1.35} color="#f5e6b3" />

        {/* A cold counter-light so the far faces don't go pure black */}
        <directionalLight position={[-6, 3, -4]} intensity={0.16} color="#6a7ea0" />

        {/* Torch bounce from below */}
        <pointLight position={[-4, -1.2, 4]} intensity={3.2} distance={13} color="#c0492e" />
        <pointLight position={[3.6, 0.4, 5]} intensity={2.4} distance={12} color="#d4af37" />

        <Dunes />
        {/* Pushed back into the haze rather than looming over the copy */}
        <Pyramid position={[1.4, -1.1, -9]} scale={4.6} />
        <Pyramid position={[-6.2, -1.6, -12]} scale={3.2} opacity={0.6} />
        <Pyramid position={[7.4, -1.8, -13.5]} scale={2.6} opacity={0.42} />
        <Obelisk position={[-3.4, -1.9, -3]} scale={0.78} />
        <Obelisk position={[4.2, -2, -4.5]} scale={0.6} />

        <DustMotes count={isMobile ? 200 : 460} />
        <CameraRig enabled={!isMobile} />
      </Canvas>
    </div>
  );
}
