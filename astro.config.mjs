// @ts-check
import { defineConfig } from "astro/config";

// Static site (default), built to dist/ and deployed to Cloudflare Pages.
export default defineConfig({
  output: "static",
});
