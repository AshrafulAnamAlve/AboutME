"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeParchmentTexture } from "@/lib/parchment";
import { makePyramidStoneTextures, makeDesertSandTextures } from "@/lib/stone";
import { clamp, lerp } from "@/lib/utils";

/**
 * Scenes 2–5, as one continuous camera move driven by `progressRef`.
 *
 *   0.00 – 0.10   the map, held still
 *   0.10 – 0.48   camera pushes into the parchment
 *   0.40 – 0.66   parchment dissolves, desert resolves underneath
 *   0.60 – 0.92   the pyramid rises; the camera closes on it
 *   0.92 – 1.00   the world dims out and hands over to the homepage
 *
 * Progress is read from a ref inside useFrame rather than passed as a prop —
 * React state at scroll frequency would re-render the whole tree 60×/second.
 */

const band = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* ── The parchment ── */
function MapPlane({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => makeParchmentTexture(), []);
  const { camera, size } = useThree();

  // A CanvasTexture holds a full bitmap — release it when the intro unmounts.
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    const p = progressRef.current;
    if (mat.current) {
      // Fades as the desert takes over
      mat.current.opacity = 1 - band(p, 0.4, 0.64);
    }
    if (mesh.current) {
      // Fill the whole viewport like a chart laid flat on the table — sized to
      // *cover* the frame (never letterboxed), while keeping the chart's 1.9:1
      // aspect so the map is cropped at the edges rather than stretched. Sized
      // for the held-still start distance; as the camera pushes in it only
      // overfills further.
      const dist = 20; // camera z (14) → map z (-6) at the opening beat
      const fov = (camera as THREE.PerspectiveCamera).fov;
      const screenH = 2 * dist * Math.tan((fov * Math.PI) / 360);
      const screenW = screenH * (size.width / Math.max(1, size.height));
      const k = Math.max(screenW / 1.9, screenH) * 1.08;
      // The sheet breathes very slightly, like paper under moving air
      const t = performance.now() * 0.00012;
      mesh.current.scale.set(k, k, 1);
      mesh.current.rotation.z = Math.sin(t) * 0.006;
      mesh.current.position.y = Math.sin(t * 1.7) * 0.05;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, -6]}>
      {/* Unit 1.9:1 sheet, scaled each frame to cover the viewport */}
      <planeGeometry args={[1.9, 1, 24, 16]} />
      <meshBasicMaterial
        ref={mat}
        map={texture}
        transparent
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Sky ──
   The night the source file is lit for: a deep navy dome scattered with stars.
   One draw call, and it gives the moonlit desert something to sit under. */
function Sky({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#060a18"); // deepest overhead
    grad.addColorStop(0.45, "#0d1630");
    grad.addColorStop(0.75, "#1b2a4a");
    grad.addColorStop(1, "#2b3f60"); // navy toward the horizon
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
    // stars scattered across the upper sky
    for (let i = 0; i < 520; i++) {
      const sx = Math.random() * 1024;
      const sy = Math.random() * 380;
      const sr = Math.random() * 1.1 + 0.2;
      g.fillStyle = "rgba(255,255,255," + (0.25 + Math.random() * 0.7) + ")";
      g.beginPath();
      g.arc(sx, sy, sr, 0, Math.PI * 2);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (mat.current) mat.current.opacity = band(progressRef.current, 0.42, 0.7);
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[300, 24, 16]} />
      <meshBasicMaterial
        ref={mat}
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

/* ── The moon ──
   The file's crescent: a bright disc with a bite carved out, a soft halo behind
   it and a few craters. Hung high and to the right, far behind the monument. */
function Moon({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mat = useRef<THREE.SpriteMaterial>(null);

  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const m = c.getContext("2d")!;
    m.fillStyle = "#dce6f8";
    m.beginPath();
    m.arc(64, 64, 32, 0, Math.PI * 2);
    m.fill();
    m.globalCompositeOperation = "destination-out";
    m.beginPath();
    m.arc(46, 58, 30, 0, Math.PI * 2);
    m.fill();
    // halo painted behind so the carve doesn't punch through it
    m.globalCompositeOperation = "destination-over";
    const halo = m.createRadialGradient(72, 66, 18, 72, 66, 60);
    halo.addColorStop(0, "rgba(190,205,235,0.3)");
    halo.addColorStop(1, "rgba(150,175,220,0)");
    m.fillStyle = halo;
    m.fillRect(0, 0, 128, 128);
    m.globalCompositeOperation = "source-over";
    m.fillStyle = "rgba(150,165,195,0.5)";
    m.beginPath(); m.arc(78, 52, 4, 0, Math.PI * 2); m.fill();
    m.beginPath(); m.arc(84, 72, 3, 0, Math.PI * 2); m.fill();
    m.beginPath(); m.arc(72, 86, 2.5, 0, Math.PI * 2); m.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (mat.current) mat.current.opacity = band(progressRef.current, 0.5, 0.75);
  });

  return (
    // Hung high and to the right, inside the sky dome and clear of the monument
    // — sits squarely in frame once the camera settles, the way the source file
    // frames its moon behind the pyramid.
    <sprite position={[46, 60, -190]} scale={[44, 44, 1]}>
      <spriteMaterial
        ref={mat}
        map={texture}
        transparent
        opacity={0}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}

/* ── The desert floor ──
   The source file's terrain, dropped in exactly: a large plane displaced into
   rolling dunes — flat around the monument, swelling toward the fogged horizon
   — carrying a tiling sand map + ripple bump and catching the moon's shadow.
   Built in the design's units and scaled up with the pyramid so the proportion
   between sand grain, dunes and stone is kept true to the file. */
function Desert({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const sand = useMemo(() => makeDesertSandTextures(96), []);

  const groundGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(420, 420, 120, 120);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const d = Math.sqrt(x * x + y * y);
      const far = Math.max(0, Math.min(1, (d - 26) / 55));
      const dune =
        (Math.sin(x * 0.07) * 1.6 +
          Math.cos(y * 0.09) * 1.2 +
          Math.sin((x - y) * 0.028) * 2.6) *
        far;
      const ripple =
        Math.sin(x * 0.8 + y * 0.35) * 0.06 + Math.sin(x * 2.1 - y * 0.9) * 0.02;
      pos.setZ(i, dune + ripple);
    }
    g.computeVertexNormals();
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  useEffect(
    () => () => {
      groundGeo.dispose();
      sand.map.dispose();
      sand.bump.dispose();
    },
    [groundGeo, sand]
  );

  useFrame(() => {
    const p = progressRef.current;
    const reveal = band(p, 0.42, 0.68);
    if (group.current) {
      group.current.visible = reveal > 0.001;
      group.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m && "opacity" in m) (m as THREE.MeshStandardMaterial).opacity = reveal;
      });
    }
  });

  return (
    <group ref={group} position={[0, GROUND_Y, -92]} scale={PY_SCALE}>
      <mesh geometry={groundGeo} receiveShadow>
        <meshStandardMaterial
          map={sand.map}
          bumpMap={sand.bump}
          bumpScale={0.06}
          roughness={1}
          metalness={0}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

/* ── The pyramid ──
   Built from stacked masonry courses, not a single cone. A smooth 4-sided
   cone reads as CG geometry however it is lit; the stepped silhouette, the
   shadow each course casts on the one below, and the eroded upper courses
   are what make it read as quarried stone. */

const BASE_HALF = 32; // half-width of the base

/* Height the monument settles at, so its base rests on the flattened sand and
   the whole pyramid stands clear of it — nothing buried. */
const PY_REST_Y = 13;
// The design pyramid is authored at half-base 9 / height 11.4; the whole thing
// is scaled up to this scene and dropped so its base sits on the group floor.
const DES_S = 9;
const DES_H = 11.4;
const PY_SCALE = BASE_HALF / DES_S;
/* World height the sand sits at — exactly the pyramid's base, so the monument
   rests on the floor the way the source file has it (base on ground, y≈0). */
const GROUND_Y = PY_REST_Y - (DES_H * PY_SCALE) / 2;
const ENTRANCE_SLOPE = Math.atan2(DES_S, DES_H);
const ENTRANCE_DY = 2.6;
const ENTRANCE_Z = DES_S * (1 - ENTRANCE_DY / DES_H);
const RUBBLE_TONES = [0x6e6350, 0x5f5644, 0x7a6e58, 0x554c3c];

/**
 * The monument — the "3D Pyramid Reveal" pyramid dropped in exactly as the
 * source file builds it: a smooth stone-textured pyramid with a recessed Giza
 * entrance (dark opening + chevron lintel + sill) and collapsed casing stones
 * round the base. It rises out of the sand and turns a full revolution as the
 * journey plays, and the camera stays back to watch it — the file's behaviour,
 * not the old fly-through.
 */
function Pyramid({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);

  const stone = useMemo(() => makePyramidStoneTextures(), []);
  const bodyGeo = useMemo(() => {
    const s = DES_S;
    const h = DES_H;
    const corners = [
      new THREE.Vector3(-s, 0, -s),
      new THREE.Vector3(s, 0, -s),
      new THREE.Vector3(s, 0, s),
      new THREE.Vector3(-s, 0, s),
    ];
    const apex = new THREE.Vector3(0, h, 0);
    const positions: number[] = [];
    const uvs: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = corners[i];
      const bb = corners[(i + 1) % 4];
      positions.push(bb.x, bb.y, bb.z, a.x, a.y, a.z, apex.x, apex.y, apex.z);
      uvs.push(0, 0, 1, 0, 0.5, 1);
    }
    positions.push(-s, 0, -s, s, 0, -s, s, 0, s, -s, 0, -s, s, 0, s, -s, 0, s);
    uvs.push(0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    g.computeVertexNormals();
    return g;
  }, []);

  // Collapsed casing stones scattered round the base, exactly per the file.
  const rubble = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => {
      const bw = 0.15 + Math.random() * 0.35;
      const box = Math.random() < 0.5;
      const dims: [number, number, number] = [
        bw * (0.8 + Math.random() * 0.8),
        bw * 0.6,
        bw * (0.8 + Math.random() * 0.6),
      ];
      const ang = Math.random() * Math.PI * 2;
      const dist = DES_S * 1.1 + Math.random() * 3.2;
      return {
        box,
        dims,
        radius: bw * 0.6,
        color: RUBBLE_TONES[i % 4],
        pos: [Math.cos(ang) * dist, bw * 0.1, Math.sin(ang) * dist] as [number, number, number],
        rot: [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5] as [number, number, number],
      };
    });
  }, []);

  useEffect(
    () => () => {
      stone.map.dispose();
      stone.bump.dispose();
      bodyGeo.dispose();
    },
    [stone, bodyGeo]
  );

  useFrame(() => {
    const p = progressRef.current;
    const reveal = band(p, 0.55, 0.82);
    if (!group.current) return;

    group.current.visible = reveal > 0.001;
    // Rises out of the sand...
    group.current.position.y = lerp(-38, PY_REST_Y, easeInOut(reveal));
    // ...and turns a full revolution as it rises, settling square by the end.
    group.current.rotation.y = 0.45 + easeInOut(reveal) * Math.PI * 2;

    // Fade every part up together as the monument emerges.
    const op = reveal;
    group.current.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && "opacity" in m) (m as THREE.MeshStandardMaterial).opacity = op;
    });

    // An uneasy red glow breathes and flickers at the tomb mouth.
    if (glow.current) {
      const t = performance.now() * 0.001;
      const flick = 0.72 + Math.sin(t * 8.3) * 0.17 + Math.sin(t * 21.7) * 0.11;
      glow.current.intensity = reveal * 20 * Math.max(0.25, flick);
    }
  });

  return (
    <group ref={group} position={[0, -38, -92]}>
      {/* design units → this scene's scale, dropped so the base sits on the floor */}
      <group scale={PY_SCALE} position={[0, -(DES_H * PY_SCALE) / 2, 0]}>
        {/* body — the design's stone map, colours kept exactly as the file.
            Casts onto the sand but does not receive its own shadow: over this
            scene's large, scaled-up shadow map that self-shadow only speckles
            the stone dark. */}
        <mesh geometry={bodyGeo} castShadow>
          <meshStandardMaterial
            map={stone.map}
            bumpMap={stone.bump}
            bumpScale={0.14}
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Giza-style entrance: recessed dark opening + chevron lintel + sill */}
        <group position={[0, ENTRANCE_DY, ENTRANCE_Z]} rotation={[-ENTRANCE_SLOPE, 0, 0]}>
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.3, 1.5]} />
            <meshBasicMaterial color="#060402" transparent opacity={0} />
          </mesh>
          <mesh position={[-0.5, 0.95, 0.05]} rotation={[0, 0, 0.55]}>
            <boxGeometry args={[1.2, 0.32, 0.32]} />
            <meshStandardMaterial color="#6e6350" roughness={0.95} transparent opacity={0} />
          </mesh>
          <mesh position={[0.5, 0.95, 0.05]} rotation={[0, 0, -0.55]}>
            <boxGeometry args={[1.2, 0.32, 0.32]} />
            <meshStandardMaterial color="#6e6350" roughness={0.95} transparent opacity={0} />
          </mesh>
          <mesh position={[0, -0.82, 0.05]}>
            <boxGeometry args={[1.8, 0.22, 0.4]} />
            <meshStandardMaterial color="#6e6350" roughness={0.95} transparent opacity={0} />
          </mesh>
        </group>

        {/* collapsed casing stones + rubble */}
        {rubble.map((r, i) => (
          <mesh key={i} position={r.pos} rotation={r.rot} castShadow>
            {r.box ? (
              <boxGeometry args={r.dims} />
            ) : (
              <dodecahedronGeometry args={[r.radius, 0]} />
            )}
            <meshStandardMaterial color={r.color} roughness={1} transparent opacity={0} />
          </mesh>
        ))}
      </group>

      {/* horror: an uneasy red glow bleeding out of the tomb mouth */}
      <pointLight ref={glow} position={[0, -10.5, 26]} color="#7a1608" intensity={0} distance={16} decay={2} />
    </group>
  );
}

/* ── Dust travelling with the camera ── */
function Motes({ count, progressRef }: { count: number; progressRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 46;
      positions[i * 3 + 2] = -Math.random() * 70;
      speeds[i] = 0.3 + Math.random() * 1.2;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const d = Math.min(delta, 0.05);
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * d * 1.5;
      arr[i * 3 + 2] += speeds[i] * d * 3.2; // drifts toward the camera
      if (arr[i * 3 + 1] > 24) arr[i * 3 + 1] = -24;
      if (arr[i * 3 + 2] > 6) arr[i * 3 + 2] = -70;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    if (mat.current) {
      // Thicker in the air once we are inside the desert
      mat.current.opacity = 0.2 + band(progressRef.current, 0.3, 0.75) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.11}
        color="#f5e6b3"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── The camera move ── */
function Rig({
  progressRef,
  pointerRef,
  allowPointer,
}: {
  progressRef: React.MutableRefObject<number>;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  allowPointer: boolean;
}) {
  const { camera, scene } = useThree();
  const fog = useMemo(() => new THREE.FogExp2(0x0a1020, 0.006), []);

  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame((_, delta) => {
    const p = progressRef.current;
    const k = 1 - Math.pow(0.0015, Math.min(delta, 0.05));

    /* Two legs: into the parchment, then across the desert to the monument.
       The file keeps the camera back so the whole pyramid — and its turn —
       reads, so there is no fly-through: just a gentle close as it settles. */
    const intoMap = easeInOut(band(p, 0.05, 0.45));
    const toPyramid = easeInOut(band(p, 0.5, 0.82));
    const closeIn = easeInOut(band(p, 0.82, 1));

    // Held well back so the whole monument sits in frame with sky and moon
    // around it, rather than filling the view.
    const z = lerp(14, -4.5, intoMap) + lerp(0, -25, toPyramid);
    const y = lerp(0, 1.2, intoMap) + lerp(0, -1.6, toPyramid) + lerp(0, 4, closeIn);

    // Parallax: a small, damped drift so the world has depth under the cursor,
    // eased out as it settles on the monument.
    const settle = 1 - closeIn * 0.7;
    const px = allowPointer ? pointerRef.current.x * 1.5 * settle : 0;
    const py = allowPointer ? pointerRef.current.y * 0.9 * settle : 0;

    camera.position.x += (px - camera.position.x) * k;
    camera.position.y += (y + py - camera.position.y) * k;
    camera.position.z += (z - camera.position.z) * k;

    // Cold haze thickens across the desert, but kept light so the monument
    // itself stays crisp (the source file keeps the pyramid clear of fog) while
    // the far dune horizon still dissolves away.
    fog.density = lerp(0.0016, 0.0045, band(p, 0.35, 0.8));

    // Aim rises from the desert floor to the monument's middle as it stands up.
    const lookY = lerp(lerp(0, 6, toPyramid), 12, closeIn);
    camera.lookAt(0, lookY, -92);
  });

  return null;
}

export default function JourneyScene({
  progressRef,
  quality,
}: {
  progressRef: React.MutableRefObject<number>;
  quality: "high" | "low";
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const isHigh = quality === "high";
  // Aim for the moon key light's shadow — parked on the monument so its shadow
  // camera frames the pyramid and the sand around its base.
  const keyTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!isHigh) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isHigh]);

  return (
    <Canvas
      dpr={[1, isHigh ? 1.85 : 1.3]}
      camera={{ position: [0, 0, 14], fov: 52, near: 0.1, far: 400 }}
      gl={{ antialias: isHigh, alpha: true, powerPreference: "high-performance" }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Pinned explicitly: defaults differ across three versions and GPUs,
        // and the scene is graded by hand against this palette. Exposure held
        // at the source file's 1.0 so the moonlit stone reads exactly as it does
        // there.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      {/* Cold, moonlit night, in the source file's cool palette. The file back-
          lights its pyramid (dramatic, but the camera-facing face falls to black
          in our wider shot), so the moon key is brought round to the upper-right
          front — the faces we actually see catch the moonlight and read as pale
          stone, while still casting the monument's shadow onto the sand. A soft
          fill lifts the shadowed side, and the hemisphere gives an ambient bounce
          so nothing crushes to pure black. */}
      <hemisphereLight args={["#243349", "#12100c", 0.5]} />
      <directionalLight
        position={[58, GROUND_Y + 134, -58]}
        target={keyTarget}
        intensity={1.35}
        color="#b7cbe8"
        castShadow
        shadow-mapSize-width={isHigh ? 2048 : 1024}
        shadow-mapSize-height={isHigh ? 2048 : 1024}
        shadow-camera-near={1}
        shadow-camera-far={620}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0004}
        shadow-normalBias={1.2}
      />
      <primitive object={keyTarget} position={[0, GROUND_Y + 4, -92]} />
      <directionalLight position={[-46, 40, 34]} intensity={0.45} color="#37507a" />

      <Sky progressRef={progressRef} />
      <Moon progressRef={progressRef} />
      <MapPlane progressRef={progressRef} />
      <Desert progressRef={progressRef} />
      <Pyramid progressRef={progressRef} />
      <Motes count={isHigh ? 520 : 200} progressRef={progressRef} />
      <Rig progressRef={progressRef} pointerRef={pointerRef} allowPointer={isHigh} />
    </Canvas>
  );
}
