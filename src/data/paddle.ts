// Paddle Billing — public client-side token + sponsorship price IDs used by the
// /support checkout (Paddle.js overlay).
//
// PADDLE_CLIENT_TOKEN is a *client-side* token (safe to ship publicly), NOT the
// secret API key. Create one in Paddle → Developer tools → Authentication →
// Client-side tokens, then paste it below. Until it's set, the support page's
// buttons fall back to a friendly "not live yet" message.

export const PADDLE_CLIENT_TOKEN = "REPLACE_WITH_PADDLE_CLIENT_TOKEN";

// Live sponsorship prices (created in Paddle 2026-07-08).
export const SPONSOR_PRICES = {
  supporter: "pri_01kx03wgpjztp9714sybybzawp", // Lector Supporter — $3/mo
  patron: "pri_01kx03whxpwcahd111paajyb67", // Lector Patron — $9/mo
  tip5: "pri_01kx03wjpvkwgkfjdfhybvv55y", // Lector Tip — $5 one-time
  tip20: "pri_01kx03wk38anjkgk9s2my6e8az", // Lector Tip — $20 one-time
  tip50: "pri_01kx03wkf7pmb65pe9bgmfh12c", // Lector Tip — $50 one-time
};
