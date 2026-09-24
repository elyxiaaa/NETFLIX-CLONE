/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          dark: "#141414",
          gray: "#2a2a2a",
          gold: "#E5B80B",
          "gold-hover": "#f4cb3a",
        },
        // "Match %" accent green
        match: "#46d369",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        // Cinematic display face for the logotype + hero/modal titles.
        display: ['"Bebas Neue"', "Impact", '"Arial Narrow"', "sans-serif"],
      },
      // Semantic z-index scale (see DESIGN.md) — no arbitrary 9999.
      zIndex: {
        dropdown: "10",
        nav: "40",
        "modal-backdrop": "50",
        modal: "60",
        toast: "70",
        player: "80",
      },
      keyframes: {
        // Skeleton shimmer sweep
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        // Modal entrance
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        // Top-anchored dropdown/menu entrance (pair with `origin-top`).
        "menu-in": {
          from: { opacity: "0", transform: "scale(0.98) translateY(-8px)" },
          to: { opacity: "1", transform: "none" },
        },
        // Small upward fade for staggering a menu's columns.
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        // Right-edge drawer sliding in.
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "none" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite linear",
        "fade-in": "fade-in 200ms ease-out both",
        "scale-in": "scale-in 240ms cubic-bezier(0.22,1,0.36,1) both",
        "menu-in": "menu-in 200ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-up": "fade-up 260ms cubic-bezier(0.22,1,0.36,1) both",
        "drawer-in": "drawer-in 320ms cubic-bezier(0.22,1,0.36,1) both",
      },
      transitionTimingFunction: {
        // ease-out-quint — premium deceleration, no bounce
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
