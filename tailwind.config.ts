import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#050505",
          800: "#080808",
          700: "#101010",
          600: "#161616",
        },
        accent: {
          orange: "#FF6B35",
          amber:  "#FFB627",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      maxWidth: { container: "1440px" },
      letterSpacing: { tightest: "-0.04em" },
      animation: {
        "fade-up":   "fadeUp 0.8s cubic-bezier(0.23,1,0.32,1) forwards",
        "fade-in":   "fadeIn 0.6s ease forwards",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(30px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
      },
    },
  },
  plugins: [],
};

export default config;
