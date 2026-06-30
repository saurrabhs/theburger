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
          800: "#0d0d0d",
          700: "#121212",
        },
        accent: {
          orange: "#FF6B35",
          amber: "#FFB627",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1400px",
      },
      spacing: {
        section: "120px",
      },
    },
  },
  plugins: [],
};

export default config;
