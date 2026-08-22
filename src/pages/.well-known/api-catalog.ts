/**
 * Serves the RFC 9727 API catalog at /.well-known/api-catalog.
 *
 * Prerendered, so the static build writes dist/.well-known/api-catalog.
 * That file has no extension. `public/_headers` sets the Content-Type
 * that Cloudflare Pages serves.
 */
import type { APIRoute } from "astro";

import { API_CATALOG_CONTENT_TYPE, buildApiCatalog } from "../../lib/api-catalog";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(buildApiCatalog(), null, 2)}\n`, {
    headers: {
      "Content-Type": API_CATALOG_CONTENT_TYPE,
      Link: '</.well-known/api-catalog>; rel="api-catalog"',
      "Cache-Control": "public, max-age=3600",
    },
  });
