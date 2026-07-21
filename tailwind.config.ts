import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Soft, warm palette suited to a gynecology clinic — calm, not clinical.
        brand: {
          50: "#fdf3f5",
          100: "#fbe6ea",
          200: "#f6cdd6",
          300: "#eea6b6",
          400: "#e17690",
          500: "#d1506f",
          600: "#b83758",
          700: "#992a48",
          800: "#7f253f",
          900: "#6c2239",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#cedccd",
          300: "#a9c3a7",
          400: "#7fa27d",
          500: "#5f8560",
          600: "#4a6b4c",
          700: "#3d563f",
          800: "#334636",
          900: "#2b3a2e",
        },
        cream: {
          50: "#fffdf9",
          100: "#fdf8ef",
          200: "#f9eeda",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(107, 47, 66, 0.08)",
        card: "0 2px 12px -2px rgba(107, 47, 66, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
