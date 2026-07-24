import * as THREE from "three";
import { seeded } from "@/lib/utils";

/**
 * Weathered limestone, generated at runtime.
 *
 * Returns a colour map and a matching height map. The height map is fed to the
 * material as a bump map so the block faces catch the low sun with real relief
 * rather than reading as flat shaded polygons.
 */
export function makeSandstoneTextures(size = 1024): {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const rand = seeded(4471);

  /* ── Colour ── */
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;

  // Kept bright: the material tints this, and a mid-tone base multiplied by a
  // mid-tone colour lands somewhere near mud.
  g.fillStyle = "#e0c99a";
  g.fillRect(0, 0, size, size);

  // Broad tonal drift — sun-bleached patches against shadowed, dirtier stone
  for (let i = 0; i < 260; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = size * (0.04 + rand() * 0.22);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const warm = rand() > 0.5;
    grad.addColorStop(0, warm ? "rgba(226,199,150,0.30)" : "rgba(122,96,60,0.26)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  // Fine grit
  for (let i = 0; i < 26000; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const s = 0.6 + rand() * 2.2;
    g.fillStyle =
      rand() > 0.5 ? `rgba(240,222,182,${0.05 + rand() * 0.12})` : `rgba(96,74,44,${0.05 + rand() * 0.14})`;
    g.fillRect(x, y, s, s);
  }

  // Vertical weathering streaks, as rain and wind leave on old stone
  for (let i = 0; i < 90; i++) {
    const x = rand() * size;
    const w = 1 + rand() * 5;
    const h = size * (0.15 + rand() * 0.5);
    const y = rand() * size;
    g.fillStyle = `rgba(88,66,38,${0.03 + rand() * 0.07})`;
    g.fillRect(x, y, w, h);
  }

  // Chips and pits
  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 5;
    g.fillStyle = `rgba(74,56,32,${0.14 + rand() * 0.3})`;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  /* ── Height ── */
  const h = document.createElement("canvas");
  h.width = size;
  h.height = size;
  const hg = h.getContext("2d")!;
  const rand2 = seeded(9013);

  hg.fillStyle = "#808080";
  hg.fillRect(0, 0, size, size);

  // Lumpy surface
  for (let i = 0; i < 1400; i++) {
    const x = rand2() * size;
    const y = rand2() * size;
    const r = 3 + rand2() * 26;
    const up = rand2() > 0.5;
    const grad = hg.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, up ? "rgba(255,255,255,0.26)" : "rgba(0,0,0,0.26)");
    grad.addColorStop(1, "rgba(128,128,128,0)");
    hg.fillStyle = grad;
    hg.beginPath();
    hg.arc(x, y, r, 0, Math.PI * 2);
    hg.fill();
  }

  // Pits punched into the relief
  for (let i = 0; i < 700; i++) {
    const x = rand2() * size;
    const y = rand2() * size;
    const r = 1 + rand2() * 4;
    hg.fillStyle = `rgba(0,0,0,${0.2 + rand2() * 0.4})`;
    hg.beginPath();
    hg.arc(x, y, r, 0, Math.PI * 2);
    hg.fill();
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;

  const bump = new THREE.CanvasTexture(h);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;

  return { map, bump };
}

/**
 * The "3D Pyramid Reveal" stone — ported verbatim from the supplied design so
 * the monument keeps that file's exact colouring.
 *
 * One 2048px NON-tiling map covering a whole face: unique block courses with
 * bevelled edges, chipped corners, cracks, large-scale mottling and dust drift
 * pooled at the base. Returns a colour map and a matching bump (height) map.
 */
export function makePyramidStoneTextures(): {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const size = 2048;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const b = document.createElement("canvas");
  b.width = b.height = size;
  const bctx = b.getContext("2d")!;
  bctx.fillStyle = "#7a7a7a";
  bctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#8a795c";
  ctx.fillRect(0, 0, size, size);

  const rows = 110;
  const rowH = size / rows;
  for (let r = 0; r < rows; r++) {
    const rowTone = 148 + Math.sin(r * 1.9) * 7 + (Math.random() - 0.5) * 10;
    let x = -Math.random() * 30;
    while (x < size) {
      const w = 22 + Math.random() * 34;
      const t = rowTone + (Math.random() - 0.5) * 24;
      const y0 = r * rowH;
      ctx.fillStyle = "rgb(" + Math.round(t + 12) + "," + Math.round(t) + "," + Math.round(t - 34) + ")";
      ctx.fillRect(x, y0, w - 1.2, rowH - 1.2);
      // bevel: light top edge, dark bottom edge
      ctx.fillStyle = "rgba(255,240,210,0.28)";
      ctx.fillRect(x, y0, w - 1.2, 1.6);
      ctx.fillStyle = "rgba(70,52,30,0.4)";
      ctx.fillRect(x, y0 + rowH - 3, w - 1.2, 1.8);
      // occasional chipped corner
      if (Math.random() < 0.08) {
        ctx.fillStyle = "rgba(88,68,42,0.5)";
        ctx.beginPath();
        const cx = Math.random() < 0.5 ? x : x + w - 4;
        ctx.moveTo(cx, y0);
        ctx.lineTo(cx + (Math.random() * 6 - 3), y0 + rowH * 0.6);
        ctx.lineTo(cx + (Math.random() * 8 - 4), y0);
        ctx.fill();
      }
      const bt = 118 + (Math.random() - 0.5) * 55;
      bctx.fillStyle = "rgb(" + Math.round(bt) + "," + Math.round(bt) + "," + Math.round(bt) + ")";
      bctx.fillRect(x, y0, w - 1.2, rowH - 1.2);
      x += w;
    }
    ctx.fillStyle = "rgba(84,64,38,0.4)";
    ctx.fillRect(0, (r + 1) * rowH - 1.6, size, 1.6);
    bctx.fillStyle = "#1a1a1a";
    bctx.fillRect(0, (r + 1) * rowH - 1.6, size, 1.6);
  }
  // large-scale mottling to kill repetition
  for (let i = 0; i < 46; i++) {
    const gx = Math.random() * size, gy = Math.random() * size, gr = 120 + Math.random() * 380;
    const g2 = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    const warm = Math.random() < 0.5;
    g2.addColorStop(0, warm ? "rgba(210,170,110,0.10)" : "rgba(120,95,60,0.10)");
    g2.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
  }
  // thin cracks
  ctx.strokeStyle = "rgba(70,52,30,0.45)";
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 34; i++) {
    let cx = Math.random() * size, cy = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (let jj = 0; jj < 6; jj++) {
      cx += (Math.random() - 0.5) * 44;
      cy += Math.random() * 34;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }
  // dust accumulation near the base
  const dg = ctx.createLinearGradient(0, size * 0.82, 0, size);
  dg.addColorStop(0, "rgba(226,192,140,0)");
  dg.addColorStop(1, "rgba(226,192,140,0.5)");
  ctx.fillStyle = dg;
  ctx.fillRect(0, size * 0.82, size, size * 0.18);
  // grain
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n;
    img.data[i + 1] += n * 0.92;
    img.data[i + 2] += n * 0.75;
  }
  ctx.putImageData(img, 0, 0);

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(b);
  return { map, bump };
}

/**
 * The desert floor — ported verbatim from the design file's `makeSandMaps`.
 *
 * A small tiling colour map (flat sand tone with fine grain) plus a matching
 * bump map of low horizontal ripples. Meant to be repeated many times across a
 * large ground plane so the floor reads as real, weathered sand rather than a
 * flat coloured sheet — exactly as the source HTML builds its terrain.
 */
export function makeDesertSandTextures(repeat = 96): {
  map: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const size = 256;

  // colour: flat sand, then per-pixel grain
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#6e6350";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    img.data[i] += n;
    img.data[i + 1] += n * 0.88;
    img.data[i + 2] += n * 0.65;
  }
  ctx.putImageData(img, 0, 0);

  // bump: soft horizontal ripples, like wind-combed sand
  const b = document.createElement("canvas");
  b.width = b.height = size;
  const bctx = b.getContext("2d")!;
  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 5) {
    const t = 128 + Math.sin(y * 0.4) * 34;
    bctx.fillStyle = "rgb(" + Math.round(t) + "," + Math.round(t) + "," + Math.round(t) + ")";
    bctx.fillRect(0, y, size, 2.5);
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeat, repeat);
  map.anisotropy = 8;

  const bump = new THREE.CanvasTexture(b);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repeat, repeat);

  return { map, bump };
}
