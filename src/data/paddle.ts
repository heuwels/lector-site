// Paddle Billing — public client-side token + sponsorship price IDs used by the
// /support checkout (Paddle.js overlay).
//
// PADDLE_CLIENT_TOKEN is a *client-side* token (safe to ship publicly), NOT the
// secret API key. Created in Paddle → Developer tools → Authentication →
// Client-side tokens. Checkout also requires the site's domain to be approved
// in Paddle → Checkout settings.

export const PADDLE_CLIENT_TOKEN = "live_a3a63d5d54f8af501effa61bbc9";

// Live sponsorship prices (created in Paddle 2026-07-08).
export const SPONSOR_PRICES = {
  supporter: "pri_01kx03wgpjztp9714sybybzawp", // Lector Supporter — $3/mo
  patron: "pri_01kx03whxpwcahd111paajyb67", // Lector Patron — $9/mo
  tip5: "pri_01kx03wjpvkwgkfjdfhybvv55y", // Lector Tip — $5 one-time
  tip20: "pri_01kx03wk38anjkgk9s2my6e8az", // Lector Tip — $20 one-time
  tip50: "pri_01kx03wkf7pmb65pe9bgmfh12c", // Lector Tip — $50 one-time
};
