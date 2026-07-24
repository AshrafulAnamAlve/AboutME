import * as THREE from "three";
import { seeded } from "@/lib/utils";

/**
 * Draws an antique world map onto a canvas and returns it as a texture.
 *
 * Generated rather than downloaded: a parchment scan detailed enough to
 * survive a full-screen camera push would be several megabytes, and this way
 * the ink, burns and palette are tuned against the site's colours exactly.
 *
 * Coastlines are hand-simplified outlines in degrees (lon, lat), projected
 * equirectangularly. They are deliberately coarse — this is a 16th-century
 * chart, not an atlas — but every landmass is recognisable.
 */

type Ring = [number, number][];

/* ── Coastlines (lon, lat) ─────────────────────────────────── */

const NORTH_AMERICA: Ring = [
  [-168, 66], [-156, 71], [-140, 70], [-125, 70], [-110, 73], [-95, 74],
  [-82, 73], [-70, 67], [-64, 60], [-56, 52], [-66, 45], [-71, 42],
  [-76, 35], [-81, 25], [-88, 30], [-94, 29], [-97, 26], [-105, 20],
  [-110, 24], [-115, 32], [-124, 42], [-130, 54], [-142, 60], [-158, 57],
  [-168, 66],
];

const SOUTH_AMERICA: Ring = [
  [-81, 8], [-74, 11], [-62, 11], [-52, 5], [-44, -2], [-35, -8],
  [-39, -18], [-48, -25], [-58, -34], [-62, -41], [-66, -50], [-71, -55],
  [-75, -49], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5],
  [-81, 8],
];

const EURASIA: Ring = [
  [-10, 36], [-9, 43], [-2, 48], [3, 51], [5, 58], [11, 58], [8, 63],
  [16, 69], [26, 71], [36, 70], [50, 69], [60, 70], [70, 72], [80, 74],
  [95, 78], [106, 77], [116, 74], [130, 72], [142, 70], [160, 68],
  [172, 66], [180, 64], [175, 61], [162, 58], [150, 50], [140, 45],
  [133, 38], [126, 35], [122, 30], [118, 22], [110, 18], [105, 10],
  [100, 5], [95, 12], [90, 21], [83, 18], [77, 8], [72, 20], [67, 25],
  [61, 25], [56, 22], [50, 28], [43, 38], [35, 36], [28, 36], [20, 40],
  [12, 44], [3, 42], [-6, 36], [-10, 36],
];

const AFRICA: Ring = [
  [-17, 15], [-10, 28], [0, 36], [10, 37], [20, 32], [32, 31], [35, 23],
  [38, 15], [43, 11], [51, 12], [48, 2], [41, -5], [40, -15], [35, -24],
  [32, -29], [25, -34], [18, -35], [12, -18], [9, -2], [3, 5], [-8, 5],
  [-13, 10], [-17, 15],
];

const AUSTRALIA: Ring = [
  [113, -22], [115, -33], [120, -34], [130, -32], [137, -35], [145, -38],
  [151, -37], [153, -28], [145, -15], [137, -12], [130, -12], [125, -14],
  [118, -20], [113, -22],
];

const GREENLAND: Ring = [
  [-45, 60], [-53, 65], [-56, 71], [-50, 77], [-40, 82], [-25, 82],
  [-20, 76], [-26, 70], [-36, 65], [-45, 60],
];

const ISLANDS: Ring[] = [
  // British Isles
  [[-6, 50], [-5, 55], [-3, 58], [0, 55], [1, 51], [-6, 50]],
  // Japan
  [[130, 32], [136, 35], [141, 40], [145, 44], [142, 43], [138, 37], [132, 33], [130, 32]],
  // Madagascar
  [[43, -12], [50, -16], [48, -25], [44, -23], [43, -12]],
  // New Zealand
  [[166, -46], [172, -43], [175, -39], [178, -37], [174, -41], [170, -45], [166, -46]],
  // Iceland
  [[-24, 64], [-18, 66], [-14, 65], [-19, 63], [-24, 64]],
  // Borneo / Indonesia cluster
  [[109, 2], [117, 4], [119, -2], [114, -4], [109, 2]],
  [[95, 5], [104, -2], [106, -6], [98, 1], [95, 5]],
  // Sri Lanka
  [[80, 9], [82, 7], [81, 6], [80, 9]],
];

/* 1.9:1 — wider than any common viewport, so fitting the plane to the screen
   height always overfills horizontally and the chart is genuinely full-bleed. */
export function makeParchmentTexture(width = 2048, height = 1078): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  const g = c.getContext("2d")!;
  const rand = seeded(8821);
  const W = width;
  const H = height;

  /* Inner map field, inside the decorative border. Latitude is clipped to
     +85/−58 so the frame is filled the way old charts crop the poles. */
  const M = Math.round(Math.min(W, H) * 0.055);
  const mx = M;
  const my = M;
  const mw = W - M * 2;
  const mh = H - M * 2;
  const LAT_TOP = 85;
  const LAT_BOT = -58;

  const px = (lon: number) => mx + ((lon + 180) / 360) * mw;
  const py = (lat: number) => my + ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT)) * mh;

  /* ── Parchment ── */
  const base = g.createLinearGradient(0, 0, W, H);
  base.addColorStop(0, "#efdcae");
  base.addColorStop(0.3, "#f5e7c2");
  base.addColorStop(0.6, "#ecd9a6");
  base.addColorStop(1, "#dcc286");
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  /* Fibre mottling and age spots */
  for (let i = 0; i < 3000; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = 5 + rand() * 95;
    g.globalAlpha = 0.01 + rand() * 0.03;
    g.fillStyle = rand() > 0.45 ? "#b98f4e" : "#fdf3d4";
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  /* ── Fold creases ── */
  [W * 0.335, W * 0.665].forEach((x) => {
    const grad = g.createLinearGradient(x - 24, 0, x + 24, 0);
    grad.addColorStop(0, "rgba(150,116,64,0)");
    grad.addColorStop(0.44, "rgba(139,104,54,0.26)");
    grad.addColorStop(0.52, "rgba(255,248,224,0.34)");
    grad.addColorStop(1, "rgba(150,116,64,0)");
    g.fillStyle = grad;
    g.fillRect(x - 24, 0, 48, H);
  });
  {
    const y = H * 0.5;
    const grad = g.createLinearGradient(0, y - 20, 0, y + 20);
    grad.addColorStop(0, "rgba(150,116,64,0)");
    grad.addColorStop(0.46, "rgba(139,104,54,0.22)");
    grad.addColorStop(0.55, "rgba(255,248,224,0.3)");
    grad.addColorStop(1, "rgba(150,116,64,0)");
    g.fillStyle = grad;
    g.fillRect(0, y - 20, W, 40);
  }

  /* ── Graticule ── */
  g.strokeStyle = "rgba(150,110,58,0.22)";
  g.lineWidth = 1.2;
  for (let lon = -150; lon <= 150; lon += 30) {
    g.beginPath();
    g.moveTo(px(lon), my);
    g.lineTo(px(lon), my + mh);
    g.stroke();
  }
  for (let lat = 60; lat >= -30; lat -= 30) {
    g.beginPath();
    g.moveTo(mx, py(lat));
    g.lineTo(mx + mw, py(lat));
    g.stroke();
  }
  /* Equator, drawn heavier */
  g.strokeStyle = "rgba(150,90,44,0.4)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(mx, py(0));
  g.lineTo(mx + mw, py(0));
  g.stroke();

  /* ── Rhumb lines ── */
  const nodes = [
    { lon: -30, lat: 20 },
    { lon: 90, lat: -10 },
  ];
  g.strokeStyle = "rgba(168,116,60,0.16)";
  g.lineWidth = 1;
  nodes.forEach((n) => {
    const nx = px(n.lon);
    const ny = py(n.lat);
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      g.beginPath();
      g.moveTo(nx, ny);
      g.lineTo(nx + Math.cos(a) * W, ny + Math.sin(a) * W);
      g.stroke();
    }
  });

  /* ── Landmasses ── */
  function drawRing(ring: Ring, fill: string, stroke: string, lw: number) {
    g.beginPath();
    ring.forEach(([lon, lat], i) => {
      const x = px(lon);
      const y = py(lat);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.closePath();
    g.fillStyle = fill;
    g.fill();
    g.strokeStyle = stroke;
    g.lineWidth = lw;
    g.lineJoin = "round";
    g.stroke();
  }

  const LAND_FILL = "rgba(246,236,205,0.92)";
  const LAND_INK = "rgba(146,96,42,0.9)";

  /* Soft shadow under each landmass so they lift off the sea */
  g.save();
  g.shadowColor = "rgba(120,84,40,0.35)";
  g.shadowBlur = 18;
  g.shadowOffsetY = 5;
  [NORTH_AMERICA, SOUTH_AMERICA, EURASIA, AFRICA, AUSTRALIA, GREENLAND].forEach((r) =>
    drawRing(r, LAND_FILL, LAND_INK, 3)
  );
  ISLANDS.forEach((r) => drawRing(r, LAND_FILL, LAND_INK, 2));
  g.restore();

  /* Interior relief hatching */
  g.strokeStyle = "rgba(178,132,72,0.34)";
  g.lineWidth = 1;
  [NORTH_AMERICA, SOUTH_AMERICA, EURASIA, AFRICA, AUSTRALIA].forEach((ring) => {
    for (let i = 0; i < ring.length - 1; i += 1) {
      const [lo, la] = ring[i];
      const x = px(lo);
      const y = py(la);
      for (let k = 0; k < 3; k++) {
        const ox = (rand() - 0.5) * 34;
        const oy = (rand() - 0.5) * 26;
        g.beginPath();
        g.moveTo(x + ox, y + oy);
        g.lineTo(x + ox + 9, y + oy - 5);
        g.stroke();
      }
    }
  });

  /* ── Labels ── */
  function label(
    text: string,
    lon: number,
    lat: number,
    size: number,
    opts: { italic?: boolean; rotate?: number; colour?: string; caps?: boolean } = {}
  ) {
    g.save();
    g.translate(px(lon), py(lat));
    if (opts.rotate) g.rotate((opts.rotate * Math.PI) / 180);
    g.fillStyle = opts.colour ?? "rgba(120,74,32,0.92)";
    g.font = `${opts.italic ? "italic " : ""}600 ${size}px Georgia, "Times New Roman", serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const t = opts.caps ? text.toUpperCase() : text;
    if (opts.caps) g.letterSpacing = `${size * 0.16}px`;
    g.fillText(t, 0, 0);
    g.restore();
  }

  const LAND_LABEL = Math.round(mh * 0.036);
  const SEA_LABEL = Math.round(mh * 0.03);
  const SEA_INK = "rgba(150,104,52,0.78)";

  label("North America", -100, 48, LAND_LABEL);
  label("South America", -62, -18, LAND_LABEL, { rotate: -8 });
  label("Africa", 20, 4, LAND_LABEL);
  label("Europe", 18, 54, LAND_LABEL * 0.85);
  label("Asia", 95, 50, LAND_LABEL);
  label("Australia", 134, -25, LAND_LABEL * 0.85);
  label("Greenland", -38, 74, LAND_LABEL * 0.72);

  label("Arctic Ocean", 10, 80, SEA_LABEL, { italic: true, colour: SEA_INK });
  label("Pacific Ocean", -145, 12, SEA_LABEL, { italic: true, colour: SEA_INK });
  label("Pacific Ocean", 165, 10, SEA_LABEL, { italic: true, colour: SEA_INK });
  label("North Atlantic Ocean", -42, 30, SEA_LABEL, {
    italic: true, rotate: -22, colour: SEA_INK,
  });
  label("South Atlantic Ocean", -22, -30, SEA_LABEL, {
    italic: true, rotate: -10, colour: SEA_INK,
  });
  label("Indian Ocean", 78, -28, SEA_LABEL, { italic: true, rotate: -8, colour: SEA_INK });

  /* ── Compass rose (bottom-left, as on the reference) ── */
  {
    const cx = px(-140);
    const cy = py(-30);
    const R = mh * 0.115;
    g.save();
    g.translate(cx, cy);

    g.fillStyle = "rgba(252,244,216,0.5)";
    g.beginPath();
    g.arc(0, 0, R * 1.16, 0, Math.PI * 2);
    g.fill();

    g.strokeStyle = "rgba(150,104,52,0.85)";
    g.lineWidth = 2.2;
    [R * 1.16, R, R * 0.82, R * 0.3].forEach((r) => {
      g.beginPath();
      g.arc(0, 0, r, 0, Math.PI * 2);
      g.stroke();
    });

    /* tick marks */
    g.lineWidth = 1.4;
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const inner = i % 6 === 0 ? R * 0.86 : R * 0.94;
      g.beginPath();
      g.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      g.lineTo(Math.cos(a) * R, Math.sin(a) * R);
      g.stroke();
    }

    /* eight points, cardinals filled darker */
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const cardinal = i % 2 === 0;
      const len = cardinal ? R * 0.82 : R * 0.5;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(Math.cos(a - 0.09) * len * 0.3, Math.sin(a - 0.09) * len * 0.3);
      g.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      g.lineTo(Math.cos(a + 0.09) * len * 0.3, Math.sin(a + 0.09) * len * 0.3);
      g.closePath();
      g.fillStyle = cardinal ? "rgba(146,72,36,0.85)" : "rgba(178,132,72,0.7)";
      g.fill();
      g.strokeStyle = "rgba(120,74,32,0.8)";
      g.lineWidth = 1.2;
      g.stroke();
    }

    g.fillStyle = "rgba(120,74,32,0.95)";
    g.font = `700 ${R * 0.26}px Georgia, serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    ["N", "E", "S", "W"].forEach((d, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
      g.fillText(d, Math.cos(a) * R * 1.36, Math.sin(a) * R * 1.36);
    });
    g.restore();
  }

  /* ── Ships ── */
  function ship(lon: number, lat: number, s: number, flip = false) {
    g.save();
    g.translate(px(lon), py(lat));
    g.scale(flip ? -s : s, s);
    const ink = "rgba(126,80,36,0.9)";

    // hull
    g.beginPath();
    g.moveTo(-30, 10);
    g.quadraticCurveTo(0, 26, 30, 10);
    g.closePath();
    g.fillStyle = "rgba(196,150,88,0.75)";
    g.fill();
    g.strokeStyle = ink;
    g.lineWidth = 2.4;
    g.stroke();

    // masts
    g.lineWidth = 2;
    [-12, 6].forEach((mxp) => {
      g.beginPath();
      g.moveTo(mxp, 10);
      g.lineTo(mxp, -30);
      g.stroke();
    });

    // sails
    g.fillStyle = "rgba(252,244,216,0.9)";
    [[-12, -28, 16], [6, -26, 14]].forEach(([sx, sy, sw]) => {
      g.beginPath();
      g.moveTo(sx + 1, sy);
      g.quadraticCurveTo(sx + sw + 8, sy + 12, sx + 1, sy + 24);
      g.closePath();
      g.fill();
      g.stroke();
    });

    // waves
    g.strokeStyle = "rgba(150,104,52,0.7)";
    g.lineWidth = 2;
    g.beginPath();
    for (let i = -3; i <= 3; i++) {
      g.moveTo(i * 10 - 5, 15);
      g.quadraticCurveTo(i * 10, 20, i * 10 + 5, 15);
    }
    g.stroke();
    g.restore();
  }

  ship(-150, 34, 1.05);
  ship(-30, 44, 0.95, true);
  ship(-30, -8, 1.1);
  ship(60, -12, 0.95);
  ship(140, 22, 1.05, true);

  /* ── Sea serpents ── */
  function serpent(lon: number, lat: number, s: number, flip = false) {
    g.save();
    g.translate(px(lon), py(lat));
    g.scale(flip ? -s : s, s);
    g.strokeStyle = "rgba(126,80,36,0.85)";
    g.fillStyle = "rgba(196,150,88,0.6)";
    g.lineWidth = 3;

    g.beginPath();
    g.moveTo(-40, 0);
    g.quadraticCurveTo(-26, -18, -12, 0);
    g.quadraticCurveTo(2, 18, 16, 0);
    g.quadraticCurveTo(26, -12, 36, -4);
    g.stroke();

    // head
    g.beginPath();
    g.ellipse(40, -6, 10, 7, -0.3, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.beginPath();
    g.arc(43, -8, 1.6, 0, Math.PI * 2);
    g.fillStyle = "rgba(90,52,20,0.95)";
    g.fill();
    g.restore();
  }

  serpent(-158, 74, 1.1);
  serpent(150, 72, 1.05, true);

  /* ── Decorative border ── */
  {
    const b = M;
    // outer band
    g.fillStyle = "rgba(168,120,62,0.9)";
    g.fillRect(0, 0, W, b * 0.42);
    g.fillRect(0, H - b * 0.42, W, b * 0.42);
    g.fillRect(0, 0, b * 0.42, H);
    g.fillRect(W - b * 0.42, 0, b * 0.42, H);

    // inner keyline
    g.strokeStyle = "rgba(110,70,30,0.9)";
    g.lineWidth = 3;
    g.strokeRect(b * 0.55, b * 0.55, W - b * 1.1, H - b * 1.1);
    g.lineWidth = 1.4;
    g.strokeRect(b * 0.75, b * 0.75, W - b * 1.5, H - b * 1.5);

    // rope hatching along the outer band
    g.strokeStyle = "rgba(90,56,24,0.55)";
    g.lineWidth = 2;
    const step = 26;
    for (let x = 0; x < W; x += step) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + step * 0.5, b * 0.42);
      g.stroke();
      g.beginPath();
      g.moveTo(x, H - b * 0.42);
      g.lineTo(x + step * 0.5, H);
      g.stroke();
    }
    for (let y = 0; y < H; y += step) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(b * 0.42, y + step * 0.5);
      g.stroke();
      g.beginPath();
      g.moveTo(W - b * 0.42, y);
      g.lineTo(W, y + step * 0.5);
      g.stroke();
    }

    // corner blocks
    g.fillStyle = "rgba(126,80,36,0.95)";
    const cs = b * 0.72;
    [[0, 0], [W - cs, 0], [0, H - cs], [W - cs, H - cs]].forEach(([x, y]) => {
      g.fillRect(x, y, cs, cs);
      g.strokeStyle = "rgba(246,236,205,0.55)";
      g.lineWidth = 2;
      g.strokeRect(x + cs * 0.22, y + cs * 0.22, cs * 0.56, cs * 0.56);
    });
  }

  /* ── Age: burnt edges, kept light so the chart stays readable ── */
  const burn = g.createRadialGradient(
    W / 2, H / 2, Math.min(W, H) * 0.34,
    W / 2, H / 2, Math.max(W, H) * 0.72
  );
  burn.addColorStop(0, "rgba(90,58,24,0)");
  burn.addColorStop(0.7, "rgba(96,62,26,0.16)");
  burn.addColorStop(0.92, "rgba(70,42,16,0.42)");
  burn.addColorStop(1, "rgba(42,24,8,0.72)");
  g.fillStyle = burn;
  g.fillRect(0, 0, W, H);

  /* Scorched bites out of the very edge */
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 150; i++) {
    const edge = Math.floor(rand() * 4);
    let x = 0;
    let y = 0;
    if (edge === 0) [x, y] = [rand() * W, rand() * H * 0.03];
    if (edge === 1) [x, y] = [rand() * W, H - rand() * H * 0.03];
    if (edge === 2) [x, y] = [rand() * W * 0.03, rand() * H];
    if (edge === 3) [x, y] = [W - rand() * W * 0.03, rand() * H];
    g.beginPath();
    g.arc(x, y, 6 + rand() * 30, 0, Math.PI * 2);
    g.fill();
  }
  g.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}
