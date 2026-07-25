import type { Config } from "tailwindcss";

/**
 * "Blush Atelier" design tokens — a premium, minimal-yet-modern system that sits
 * between glassmorphism and minimalism.
 *
 * The site was originally built on three ramps (`brand` / `sage` / `cream`). To
 * re-skin the whole surface safely we KEEP those names but repurpose their values:
 *   brand → deep plum-rose accent
 *   sage  → warm ink / greige neutral (headings, body, hairline borders)
 *   cream → ivory paper (page + raised surfaces)
 * `gold` is a new token, reserved for thin hairlines and small flourishes only.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Accent — deep plum-rose. Warm, feminine, boutique-luxe.
        brand: {
          50: "#fbf1f4",
          100: "#f5dbe3",
          200: "#ebbacb",
          300: "#db93ac",
          400: "#c56a8b",
          500: "#9e3b5f",
          600: "#85304f",
          700: "#6e2841",
          800: "#571f34",
          900: "#3e1626",
        },
        // Neutral ink — warm greige/taupe. Used for text + borders.
        sage: {
          50: "#f6f3f0",
          100: "#ede8e3",
          200: "#ded7cf",
          300: "#c3b9ae",
          400: "#9a8f84",
          500: "#766c62",
          600: "#574f47",
          700: "#3d372f",
          800: "#2e2925",
          900: "#2a2024",
        },
        // Ivory paper — page background + soft raised surfaces.
        cream: {
          50: "#fbf8f5",
          100: "#f6f1ea",
          200: "#efe7db",
        },
        // Brushed gold — hairlines & small flourishes only. Use sparingly.
        gold: {
          300: "#d8c39a",
          400: "#c6aa78",
          500: "#b08d57",
          600: "#96774a",
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
        // Soft, plum-tinted, layered — quiet depth on ivory.
        card: "0 1px 2px rgba(42,32,36,0.04), 0 10px 26px -14px rgba(158,59,95,0.12)",
        soft: "0 2px 8px rgba(42,32,36,0.05), 0 20px 44px -20px rgba(158,59,95,0.18)",
        glass:
          "0 8px 32px -10px rgba(42,32,36,0.14), inset 0 1px 0 rgba(255,255,255,0.65)",
        lift: "0 4px 12px rgba(42,32,36,0.06), 0 24px 50px -22px rgba(158,59,95,0.22)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
