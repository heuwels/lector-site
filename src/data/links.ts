// External destinations used across the site — the single place to change the
// cloud app URL or the social links. Auth paths match the app's routes
// (src/app/(auth)/{login,register}) at app.lector.dev.

export const APP_URL = "https://app.lector.dev";
export const STAGING_APP_URL = "https://staging.lector.dev";
export const SIGNUP_URL = `${APP_URL}/register`;
export const LOGIN_URL = `${APP_URL}/login`;

export const GITHUB = "https://github.com/heuwels/lector";
export const DISCORD = "https://discord.gg/PD3GAh2Rj";
// Support is handled on-site via Paddle (/support), not GitHub Sponsors.
