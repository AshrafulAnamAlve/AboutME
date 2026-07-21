import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /* Gold — the light of the tomb */
        gold: {
          DEFAULT: "#D4AF37",
          deep: "#C89B3C",
          bronze: "#A97142",
          pale: "#EBCB8B",
          leaf: "#F5E6B3",
        },
        /* Sand & stone */
        sand: {
          DEFAULT: "#C8A97E",
          light: "#E3CDA4",
          dark: "#8B6F47",
        },
        /* Void — the depths */
        void: {
          DEFAULT: "#0F0E0B",
          900: "#0A0907",
          800: "#0F0E0B",
          700: "#16130F",
          600: "#201B14",
          500: "#2C251B",
          400: "#3A3126",
        },
        /* Blood-ochre — the curse */
        ochre: {
          DEFAULT: "#8C3A28",
          dark: "#5A2418",
          glow: "#C0492E",
        },
        parchment: "#F7F3EA",
      },
      fontFamily: {
        /* The hieroglyph face trails each stack — per-character fallback means
           Latin keeps its intended face and only glyphs reach for Noto. */
        display: ["var(--font-cinzel)", "var(--font-glyph)", "serif"],
        serif: ["var(--font-cormorant)", "var(--font-glyph)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "var(--font-glyph)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        glyph: "0.42em",
        rune: "0.28em",
      },
      screens: {
        xs: "420px",
      },
      maxWidth: {
        chamber: "84rem",
      },
      keyframes: {
        "torch-flicker": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "12%": { opacity: "0.72", transform: "scale(0.97)" },
          "24%": { opacity: "1", transform: "scale(1.02)" },
          "37%": { opacity: "0.85", transform: "scale(0.99)" },
          "58%": { opacity: "1", transform: "scale(1.01)" },
          "71%": { opacity: "0.68", transform: "scale(0.96)" },
          "84%": { opacity: "0.95", transform: "scale(1)" },
        },
        "dust-rise": {
          "0%": { transform: "translate3d(0,0,0)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.4" },
          "100%": {
            transform: "translate3d(var(--drift, 20px), -105vh, 0)",
            opacity: "0",
          },
        },
        "slow-drift": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-3%,-1.5%,0)" },
        },
        "glyph-breathe": {
          "0%,100%": { opacity: "0.16" },
          "50%": { opacity: "0.42" },
        },
        "seal-crack": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "40%": { transform: "scale(1.16) rotate(-4deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        torch: "torch-flicker 3.1s ease-in-out infinite",
        "torch-slow": "torch-flicker 4.7s ease-in-out infinite",
        dust: "dust-rise linear infinite",
        drift: "slow-drift 34s ease-in-out infinite",
        breathe: "glyph-breathe 6s ease-in-out infinite",
        shimmer: "shimmer 7s linear infinite",
      },
      transitionTimingFunction: {
        tomb: "cubic-bezier(0.16, 1, 0.3, 1)",
        souls: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
