// External destinations used across the site — the single place to change the
// cloud app URL or the social links. Auth paths match the app's routes
// (src/app/(auth)/{login,register}) at app.lector.dev.

export const APP_URL = "https://app.lector.dev";
export const STAGING_APP_URL = "https://staging.lector.dev";
export const SIGNUP_URL = `${APP_URL}/register`;
export const LOGIN_URL = `${APP_URL}/login`;

// Paid pricing CTAs enter through registration, then preserve the selected
// tier until the authenticated /subscribe screen creates the Paddle checkout.
// The app allowlists these exact internal destinations; never link the public
// site straight to /checkout, which requires a server-created transaction id.
export const CLOUD_CHECKOUT_URL = `${SIGNUP_URL}?next=${encodeURIComponent(
  "/subscribe?plan=cloud",
)}`;
export const CLOUD_PLUS_CHECKOUT_URL = `${SIGNUP_URL}?next=${encodeURIComponent(
  "/subscribe?plan=plus",
)}`;

export const GITHUB = "https://github.com/heuwels/lector";
export const DISCORD = "https://discord.gg/PD3GAh2Rj";
export const SUPPORT_EMAIL = "support@lector.dev";
// Support is handled on-site via Paddle (/support), not GitHub Sponsors.
