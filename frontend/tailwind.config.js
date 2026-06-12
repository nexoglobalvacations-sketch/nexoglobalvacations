/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A1D37", // Deep Luxury Navy
          light: "#134074",   // Premium Classic Blue
          dark: "#050F1D",
        },
        gold: {
          DEFAULT: "#C5A880", // Soft Gold / Champagne Gold Accent
          light: "#DFCEB6",
          dark: "#A3855E",
        },
        ocean: {
          DEFAULT: "#8DA9C4", // Calm ocean blue
          light: "#EEF4F8",   // Platinum ice blue
          dark: "#5E81AC",
        },
        pearl: "#FAF9F6",     // Off-white pearl background
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(10, 29, 55, 0.08)",
        goldGlow: "0 10px 30px -10px rgba(197, 168, 128, 0.2)",
      },
    },
  },
  plugins: [],
}
