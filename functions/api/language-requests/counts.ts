/**
 * GET /api/language-requests/counts
 *
 * Returns how many people wait for each language, as
 * { counts: { "mandarin": 214, ... } }.
 *
 * Only languages at or above MIN_PUBLIC_COUNT appear. The pages read this
 * after they render, so a language with no entry simply shows no number.
 */

interface Env {
  DB: D1Database;
}

// Keep this equal to the threshold in ./index.ts.
const MIN_PUBLIC_COUNT = 25;

// Cached at the edge. A count that lags by five minutes is not a problem, and
// the cache keeps a popular page off the database.
const CACHE_SECONDS = 300;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
  };

  if (!env.DB) {
    // An empty result keeps the pages working when the binding is absent.
    return new Response(JSON.stringify({ counts: {} }), { headers });
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT language, count(*) AS n FROM language_requests
       WHERE unsubscribed_at IS NULL
       GROUP BY language
       HAVING n >= ?
       ORDER BY n DESC`,
    )
      .bind(MIN_PUBLIC_COUNT)
      .all<{ language: string; n: number }>();

    const counts: Record<string, number> = {};
    for (const row of results ?? []) counts[row.language] = row.n;

    return new Response(JSON.stringify({ counts }), { headers });
  } catch (err) {
    console.error("language_requests counts failed", err);
    return new Response(JSON.stringify({ counts: {} }), { headers });
  }
};
