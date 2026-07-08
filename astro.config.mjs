// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static site (default), built to dist/ and deployed to Cloudflare Pages.
// Tailwind CSS v4 is wired in via the official Vite plugin; the theme lives in
// src/styles/global.css (@theme), imported by layouts/Base.astro.
export default defineConfig({
  output: "static",
  site: "https://lector.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
