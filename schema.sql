-- Language interest list (Cloudflare D1 / SQLite).
--
-- One row per (person, language) pair. A person can ask for more than one
-- language. The unique index below makes a repeat submission a no-op, so the
-- API can accept the same form twice without a duplicate row.
--
-- Apply with:
--   pnpm db:local    (local wrangler state, for `pnpm dev:api`)
--   pnpm db:remote   (the real database)

CREATE TABLE IF NOT EXISTS language_requests (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),

  -- Canonical language key. Either a slug from src/data/languages.ts
  -- (for example "mandarin"), or the literal "other".
  language        TEXT    NOT NULL,

  -- The raw language name the person typed. Set only when language = "other".
  requested_name  TEXT,

  email           TEXT    NOT NULL,

  -- Optional free text: what they want to read, their level, why it matters.
  note            TEXT,

  -- Two-letter country code from CF-IPCountry. Coarse geography helps to
  -- rank languages by audience. No IP address is stored.
  country         TEXT,
  user_agent      TEXT,

  -- Set when the launch email for this language goes out. A NULL value means
  -- this person still waits to hear about the language.
  notified_at     TEXT,

  -- Set when the person asks to come off the list. Excluded from counts and
  -- from any send.
  unsubscribed_at TEXT
);

-- Makes a repeat submission idempotent. The expressions match the values the
-- API normalises before it inserts, so "Luke@x.com" and "luke@x.com" collide.
CREATE UNIQUE INDEX IF NOT EXISTS idx_language_requests_unique
  ON language_requests (lower(email), language, lower(coalesce(requested_name, '')));

-- Drives the public per-language counts.
CREATE INDEX IF NOT EXISTS idx_language_requests_language
  ON language_requests (language);

CREATE INDEX IF NOT EXISTS idx_language_requests_created_at
  ON language_requests (created_at);
