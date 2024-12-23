import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)",
          },
          "60%": {
            transform: "translateY(-10px) scale(1.02)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 3s cubic-bezier(0.23, 1, 0.32, 1) forwards",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
