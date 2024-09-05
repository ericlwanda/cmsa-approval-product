import type { Config } from "tailwindcss";
import { themePreset } from "./theme-plugin-presets";

const config = {
  presets: [themePreset],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
} satisfies Config;

export default config;
