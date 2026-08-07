/**
 * POST /api/language-requests
 *
 * Records one person's interest in one language. The form on /reference-data/
 * and /roadmap/ posts here.
 *
 * Body:
 *   language       Required. A slug from src/data/languages.ts, or "other".
 *   requestedName  The language name the person typed. Used when language is "other".
 *   email          Required.
 *   note           Optional free text.
 *   turnstileToken Required when TURNSTILE_SECRET is set on the project.
 *
 * The response never says whether the address was already on the list. That
 * keeps the endpoint from becoming a way to test if an address subscribed.
 */

interface Env {
  DB: D1Database;
  // The bot check runs only when this is set. See README.
  TURNSTILE_SECRET?: string;
}

// A language needs this many people before the site shows its count in public.
// A small number next to every language reads as an abandoned project.
const MIN_PUBLIC_COUNT = 25;

// One person cannot register interest in more languages than this.
const MAX_LANGUAGES_PER_EMAIL = 20;

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

// Deliberately permissive. A stricter pattern rejects valid addresses, and the
// real test of an address is whether the launch email reaches it.
const isEmail = (value: string): boolean =>
  value.length >= 6 &&
  value.length <= 254 &&
  /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value);

// Accepts the slug shape only. An unknown slug is stored but never displayed,
// because each page looks up counts by the slugs it already knows.
const isLanguageKey = (value: string): boolean =>
  value.length >= 2 && value.length <= 32 && /^[a-z][a-z0-9-]*$/.test(value);

// Verifies a Turnstile token. Returns false on any error, so a failure to
// reach Cloudflare rejects the submission instead of letting it through.
async function verifyTurnstile(
  secret: string,
  token: string,
  request: Request,
): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verify error", err);
    return false;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) {
    console.error("DB binding missing on this Pages project");
    return json({ error: "This form is not available right now." }, 503);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const token = str(body.turnstileToken, 2048);
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, token, request);
    if (!ok) {
      return json(
        { error: "We cannot verify your submission. Try again." },
        403,
      );
    }
  }

  const email = str(body.email, 254).toLowerCase();
  if (!isEmail(email)) {
    return json({ error: "Enter an email address we can reach you at." }, 400);
  }

  const language = str(body.language, 32).toLowerCase();
  if (!isLanguageKey(language)) {
    return json({ error: "Choose a language." }, 400);
  }

  // Only "other" carries a typed language name.
  const requestedName =
    language === "other" ? str(body.requestedName, 60) : "";
  if (language === "other" && !requestedName) {
    return json({ error: "Tell us which language you want." }, 400);
  }

  const note = str(body.note, 500);
  const country = str(request.headers.get("CF-IPCountry"), 2).toUpperCase();
  const userAgent = str(request.headers.get("user-agent"), 300);

  try {
    const existing = await env.DB.prepare(
      `SELECT count(*) AS n FROM language_requests
       WHERE lower(email) = ? AND unsubscribed_at IS NULL`,
    )
      .bind(email)
      .first<{ n: number }>();

    if ((existing?.n ?? 0) >= MAX_LANGUAGES_PER_EMAIL) {
      return json(
        { error: "That address is on the list for too many languages." },
        429,
      );
    }

    // A repeat submission hits the unique index and changes nothing.
    await env.DB.prepare(
      `INSERT OR IGNORE INTO language_requests
         (language, requested_name, email, note, country, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        language,
        requestedName || null,
        email,
        note || null,
        country || null,
        userAgent || null,
      )
      .run();

    const total = await env.DB.prepare(
      `SELECT count(*) AS n FROM language_requests
       WHERE language = ? AND unsubscribed_at IS NULL`,
    )
      .bind(language)
      .first<{ n: number }>();

    const count = total?.n ?? 0;

    return json({
      ok: true,
      // Present only above the threshold, so the page can show the count it
      // just contributed to without ever showing a discouraging number.
      count: count >= MIN_PUBLIC_COUNT ? count : null,
    });
  } catch (err) {
    console.error("language_requests insert failed", err);
    return json({ error: "An error occurred. Try again." }, 500);
  }
};
