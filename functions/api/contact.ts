/**
 * POST /api/contact
 *
 * Sends one contact message to support@lector.dev through Resend. The form on
 * /contact/ posts here.
 *
 * Body:
 *   name           Required.
 *   email          Required. Used as the Reply-To address.
 *   topic          Required. A key from TOPICS below.
 *   message        Required.
 *   turnstileToken Required when TURNSTILE_SECRET is set on the project.
 *
 * Bindings:
 *   TURNSTILE_SECRET      Bot check. Skipped when unset, so local `pnpm
 *                         dev:api` still reaches the handler.
 *   TURNSTILE_HOSTNAMES   Optional comma list. Defaults to the production
 *                         hostnames on the Turnstile widget. Do not add
 *                         localhost to a production value.
 *   RESEND_API_KEY        Required to send. If unset and CONTACT_DRY_RUN=1,
 *                         the handler logs the topic and returns ok.
 *   CONTACT_FROM          Optional. Default Lector <no-reply@lector.dev>.
 *   CONTACT_TO            Optional. Default support@lector.dev.
 *
 * Keep TOPICS in sync with src/data/contact.ts.
 */

interface Env {
  TURNSTILE_SECRET?: string;
  TURNSTILE_HOSTNAMES?: string;
  RESEND_API_KEY?: string;
  CONTACT_DRY_RUN?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
}

const DEFAULT_FROM = "Lector <no-reply@lector.dev>";
const DEFAULT_TO = "support@lector.dev";

// Widget domains minus localhost. See src/data/turnstile.ts.
const DEFAULT_TURNSTILE_HOSTNAMES = [
  "lector.dev",
  "www.lector.dev",
  "lector-site-staging.pages.dev",
  "lector-site-avb.pages.dev",
];

const TOPICS: Record<string, string> = {
  product: "The product",
  billing: "Cloud account or billing",
  "self-hosting": "Self-hosted install",
  language: "Language pack",
  other: "Other",
};

const TURNSTILE_ACTION = "contact";
const MAX_TOKEN = 2048;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const MIN_MESSAGE = 20;

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const str = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const oneLine = (value: string): string =>
  value.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();

const messageText = (value: string): string =>
  value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

const isEmail = (value: string): boolean =>
  value.length >= 6 &&
  value.length <= MAX_EMAIL &&
  /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function hostnamesFromEnv(value: string | undefined): Set<string> {
  const fromEnv = (value ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (fromEnv.length > 0) return new Set(fromEnv);
  return new Set(DEFAULT_TURNSTILE_HOSTNAMES);
}

function actionMatches(action: unknown, hostname: string): boolean {
  if (action === TURNSTILE_ACTION) return true;
  // Dummy Turnstile keys always return action "test".
  return (
    action === "test" &&
    (hostname === "localhost" || hostname === "127.0.0.1")
  );
}

async function verifyTurnstile(
  secret: string,
  token: string,
  request: Request,
  hostnames: Set<string>,
): Promise<boolean> {
  if (!token || token.length > MAX_TOKEN) return false;
  if (hostnames.size === 0) return false;

  let result: {
    success?: boolean;
    action?: string;
    hostname?: string;
  };
  try {
    const params = new URLSearchParams({ secret, response: token });
    const ip = request.headers.get("CF-Connecting-IP");
    if (ip) params.set("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
        body: params,
      },
    );
    if (!res.ok) return false;
    result = (await res.json()) as typeof result;
  } catch (err) {
    console.error("Turnstile verify error", err);
    return false;
  }

  const hostname =
    typeof result.hostname === "string" ? result.hostname : "";
  return (
    result.success === true &&
    hostnames.has(hostname) &&
    actionMatches(result.action, hostname)
  );
}

async function sendResend(
  apiKey: string,
  payload: {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    html: string;
  },
): Promise<{ ok: true } | { ok: false; status: number }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      from: payload.from,
      to: [payload.to],
      reply_to: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Resend rejected contact email", res.status, body.slice(0, 300));
    return { ok: false, status: res.status };
  }
  return { ok: true };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const token = str(body.turnstileToken, MAX_TOKEN);
    const hostnames = hostnamesFromEnv(env.TURNSTILE_HOSTNAMES);
    const ok = await verifyTurnstile(
      env.TURNSTILE_SECRET,
      token,
      request,
      hostnames,
    );
    if (!ok) {
      return json(
        { error: "We cannot verify your submission. Try again." },
        403,
      );
    }
  }

  const name = oneLine(str(body.name, MAX_NAME));
  if (!name) {
    return json({ error: "Enter your name." }, 400);
  }

  const email = str(body.email, MAX_EMAIL).toLowerCase();
  if (!isEmail(email)) {
    return json({ error: "Enter an email address we can reach you at." }, 400);
  }

  const topicKey = str(body.topic, 32);
  const topicLabel = TOPICS[topicKey];
  if (!topicLabel) {
    return json({ error: "Choose a topic." }, 400);
  }

  const message = messageText(str(body.message, MAX_MESSAGE));
  if (message.length < MIN_MESSAGE) {
    return json(
      { error: "Write a message of at least 20 characters." },
      400,
    );
  }

  const country = oneLine(str(request.headers.get("CF-IPCountry"), 2)).toUpperCase();
  const userAgent = oneLine(str(request.headers.get("user-agent"), 300));

  const subject = `Contact: ${topicLabel}. ${name}`.slice(0, 120);
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topicLabel}`,
    "",
    message,
    "",
    `Country: ${country || "unknown"}`,
    `User agent: ${userAgent || "unknown"}`,
  ].join("\n");
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Topic:</strong> ${escapeHtml(topicLabel)}</p>`,
    `<p><strong>Message:</strong></p>`,
    `<pre style="white-space:pre-wrap;font-family:sans-serif">${escapeHtml(message)}</pre>`,
    `<p style="color:#666;font-size:12px">Country: ${escapeHtml(country || "unknown")}<br>User agent: ${escapeHtml(userAgent || "unknown")}</p>`,
  ].join("");

  if (!env.RESEND_API_KEY) {
    if (env.CONTACT_DRY_RUN === "1") {
      console.log("contact dry-run", { topic: topicKey, country });
      return json({ ok: true });
    }
    console.error("RESEND_API_KEY missing on this Pages project");
    return json({ error: "This form is not available right now." }, 503);
  }

  try {
    const sent = await sendResend(env.RESEND_API_KEY, {
      from: env.CONTACT_FROM?.trim() || DEFAULT_FROM,
      to: env.CONTACT_TO?.trim() || DEFAULT_TO,
      replyTo: email,
      subject,
      text,
      html,
    });
    if (!sent.ok) {
      return json({ error: "An error occurred. Try again." }, 502);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("contact send failed", err);
    return json({ error: "An error occurred. Try again." }, 502);
  }
};
