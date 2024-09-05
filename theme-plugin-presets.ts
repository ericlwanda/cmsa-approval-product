import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { themePlugin } from "./theme-plugin";
export const themePreset = {
  darkMode: ["class"],
  content: [],
  plugins: [animatePlugin, themePlugin],
} satisfies Config;
