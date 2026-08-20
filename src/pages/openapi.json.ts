/**
 * Serves the OpenAPI document at /openapi.json, from the same copy that
 * /docs/api/ renders. `scripts/sync-openapi.mjs` refreshes that copy.
 *
 * Prerendered, so the static build writes dist/openapi.json.
 */
import type { APIRoute } from "astro";

import spec from "../data/openapi.json";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(spec, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
