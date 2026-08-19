// Cloudflare Turnstile — public site key for the language interest form and
// the contact form.
//
// TURNSTILE_SITE_KEY is a *public* key (safe to ship), NOT the secret. The
// secret lives on both Pages projects as the TURNSTILE_SECRET environment
// variable. functions/api/language-requests/index.ts and
// functions/api/contact.ts read it.
//
// Widget: "lector.dev language interest", mode "managed". Approved domains are
// lector.dev, www.lector.dev, lector-site-staging.pages.dev,
// lector-site-avb.pages.dev and localhost.
//
// Set PUBLIC_TURNSTILE_SITE_KEY to override at build time. Cloudflare's test
// keys are useful for local work:
//   1x00000000000000000000AA  always passes
//   2x00000000000000000000AB  always blocks
export const TURNSTILE_SITE_KEY =
  import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAEJYds9Qt6T4Dyp5";
