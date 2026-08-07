/// <reference types="astro/client" />

// Globals added by third-party scripts the site loads.
interface Window {
  // Plausible analytics. Absent until analytics.js loads, and absent entirely
  // for readers who block it, so always call it with `?.`.
  plausible?: (
    event: string,
    options?: { props?: Record<string, string | number | boolean> },
  ) => void;

  // Cloudflare Turnstile, from challenges.cloudflare.com/turnstile/v0/api.js.
  turnstile?: {
    reset: (container?: string | HTMLElement) => void;
    render: (container: string | HTMLElement, options: unknown) => string;
    getResponse: (container?: string | HTMLElement) => string | undefined;
  };
}

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PADDLE_SANDBOX_CLIENT_TOKEN?: string;
}
