import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#070912",
        cyan: "#36f4ff",
        magenta: "#ff4dff",
        lime: "#b8ff65",
        violet: "#8d6bff"
      },
      boxShadow: {
        neon: "0 0 24px rgba(54,244,255,.35), 0 0 72px rgba(255,77,255,.16)",
        glass: "inset 0 1px 0 rgba(255,255,255,.18), 0 24px 80px rgba(0,0,0,.28)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-16px,0)" }
        },
        scan: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        scan: "scan 2.8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
