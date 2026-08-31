// External destinations used across the site — the single place to change the
// cloud app URL or the social links. Auth paths match the app's routes
// (src/app/(auth)/{login,register}) at app.lector.dev.

export const APP_URL = "https://app.lector.dev";
export const STAGING_APP_URL = "https://staging.lector.dev";
export const SIGNUP_URL = `${APP_URL}/register`;
export const LOGIN_URL = `${APP_URL}/login`;

/**
 * The campaign code word the paid CTAs carry (heuwels/lector#516). Set it
 * while a campaign runs, and set it back to "" when the campaign ends. That
 * one constant is the whole switch.
 *
 * This is a code WORD, never a Paddle discount id. The app maps the word to a
 * `dsc_…` id server-side, from its own PADDLE_DISCOUNT_CODES parameter, and
 * attaches the discount when it creates the transaction. So nothing here is
 * redeemable on its own, and this repository never holds a Paddle id.
 *
 * Letters and numbers only, 32 characters maximum. That is Paddle's rule for a
 * code, and both the app's `next` allowlist and its checkout route reject
 * anything else — a code with a space or a hyphen silently drops out.
 *
 * Create the Paddle discount and set the app's parameter FIRST. A code word
 * the app cannot resolve makes the subscribe screen say the code is unknown.
 */
export const ACTIVE_PROMO = "";

// Paid pricing CTAs enter through registration, then preserve the selected
// tier until the authenticated /subscribe screen creates the Paddle checkout.
// The app allowlists these exact internal destinations; never link the public
// site straight to /checkout, which requires a server-created transaction id.
// Parameter order matches what the app canonicalises to (plan, then promo), so
// the link it stores is the link written here.
function paidCheckoutUrl(plan: "cloud" | "plus"): string {
  const params = new URLSearchParams({ plan });
  if (ACTIVE_PROMO) params.set("promo", ACTIVE_PROMO);
  return `${SIGNUP_URL}?next=${encodeURIComponent(`/subscribe?${params}`)}`;
}

export const CLOUD_CHECKOUT_URL = paidCheckoutUrl("cloud");
export const CLOUD_PLUS_CHECKOUT_URL = paidCheckoutUrl("plus");

export const GITHUB = "https://github.com/heuwels/lector";
export const DISCORD = "https://discord.gg/XBEnx2ZWd5";
export const SUPPORT_EMAIL = "support@lector.dev";
// Support is handled on-site via Paddle (/support), not GitHub Sponsors.
