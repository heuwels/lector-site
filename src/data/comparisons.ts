// Comparison / "alternative" landing pages: Lector vs <competitor>, at /vs/<slug>.
// High-commercial-intent SEO ("LingQ alternative", "Lector vs Clozemaster").
//
// These are PUBLIC pages making factual claims about competitors, so every value
// must be accurate, dated, and defensible — pricing carries an "as of" note and
// each page has an honest "where they're better" section. Competitor facts below
// were verified against official pricing pages + reputable reviews (July 2026);
// re-confirm live prices before editing, and keep claims fair.

import { languages } from "./languages";

// Shipped language packs — computed so comparison copy never goes stale when
// a new pack lands (matches the homepage's status filter).
const completeLanguageCount = languages.filter(
  (language) => language.status === "complete",
).length;

export interface CompareRow {
  feature: string;
  /** Lector's value. */
  lector: string;
  /** The competitor's value. */
  them: string;
  /** Who this row favours — drives a subtle highlight, not a score. */
  advantage?: "lector" | "them" | "even";
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Point {
  title: string;
  body: string;
}

export interface Comparison {
  slug: string;
  name: string;
  url: string;
  /** One-line, quotable verdict shown under the H1 (written to be lifted by AI answers). */
  verdict: string;
  intro: string;
  /** Feature-by-feature table. */
  rows: CompareRow[];
  /** Honest — where the competitor genuinely wins. Builds trust (E-E-A-T). */
  theirStrengths: Point[];
  /** Where Lector wins. */
  ourStrengths: Point[];
  /** Who should pick which. */
  pickThem: string;
  pickLector: string;
  faqs: Faq[];
  /** Pricing "as of" date, shown as a disclaimer under the table. */
  asOf: string;
}

// Lector's side of the table — one source of truth reused across comparisons.
const LECTOR = {
  price: "Self-host free, or cloud from $5/mo",
  reading: "EPUB, web articles, paste",
  translate: "On-device dictionary + LLM",
  cloze: "Frequency-ordered, with SRS",
  anki: "Two-way (beta): push cards, Anki reviews update Lector",
  tutor: "LLM tutor + writing correction",
  data: "Your server (one SQLite file)",
  offline: "Reader, cloze & vocab work offline",
  open: "Open source (AGPL-3.0)",
  languages: `${completeLanguageCount} packs; reader works with any language`,
  audio: "Text-to-speech (Google, optional)",
};

export const comparisons: Record<string, Comparison> = {
  lingq: {
    slug: "lingq",
    name: "LingQ",
    url: "https://www.lingq.com",
    verdict:
      "Lector is a self-hosted, one-time-free alternative to LingQ: the same import-anything, click-to-translate reading workflow, plus frequency cloze and two-way Anki sync — but your library and progress live on your own hardware, with no subscription.",
    intro:
      "LingQ pioneered learning by reading imported content, and it's a polished, mature product with a big library and native apps. Lector takes the same reading-first idea and makes it self-hostable and open source, joins it with Clozemaster-style cloze and a first-party two-way Anki integration, and lets you bring your own LLM. Here's an honest side-by-side.",
    rows: [
      { feature: "Price", lector: LECTOR.price, them: "$14.99/mo, or ~$10/mo billed annually", advantage: "lector" },
      { feature: "Free tier", lector: "Full app, self-hosted", them: "Limited: ~20 saved words, 5 imports", advantage: "lector" },
      { feature: "Reading imported content", lector: LECTOR.reading, them: "EPUB, articles, video, browser-extension import", advantage: "them" },
      { feature: "Click-to-translate", lector: LECTOR.translate, them: "Yes, with a built-in dictionary", advantage: "even" },
      { feature: "Word-state tracking", lector: "New / learning / known", them: "Yes (its core mechanic)", advantage: "even" },
      { feature: "Audio & listening", lector: LECTOR.audio, them: "Per-lesson audio + TTS on imports", advantage: "them" },
      { feature: "Cloze / sentence practice", lector: LECTOR.cloze, them: "No dedicated cloze mode", advantage: "lector" },
      { feature: "Anki integration", lector: LECTOR.anki, them: "CSV / Anki-file export (emailed)", advantage: "lector" },
      { feature: "AI tutor & writing correction", lector: LECTOR.tutor, them: "Limited (Premium Plus AI add-ons)", advantage: "lector" },
      { feature: "Bring your own LLM", lector: "Yes — Claude or a local model", them: "No", advantage: "lector" },
      { feature: "Data ownership", lector: LECTOR.data, them: "Cloud account (CSV/Anki export available)", advantage: "lector" },
      { feature: "Open source", lector: LECTOR.open, them: "Closed source", advantage: "lector" },
      { feature: "Languages", lector: LECTOR.languages, them: "50+ (some in beta)", advantage: "them" },
      { feature: "Mobile apps", lector: "Web (installable PWA)", them: "Native iOS & Android apps", advantage: "them" },
    ],
    theirStrengths: [
      { title: "A huge content library + one-click import", body: "LingQ ships thousands of graded lessons with audio, and its browser extension imports from YouTube, Netflix, podcasts, ebooks, and any web page — you can start reading immediately without sourcing material." },
      { title: "Mature native apps", body: "Well-rated iOS and Android apps (LingQ advertises ~4.7 stars) with offline lesson downloads and sync. Lector is a self-hostable web app (installable as a PWA) rather than a native app." },
      { title: "50+ languages", body: `LingQ supports far more languages out of the box, including many beta ones. Lector's reader works with any language, but its frequency cloze packs currently cover ${completeLanguageCount}.` },
      { title: "An established community", body: "A large user base (LingQ claims 5M+ learners), shared user-imported lessons, and busy forums — a network a newer self-hosted tool can't match yet." },
    ],
    ourStrengths: [
      { title: "Free to self-host, no subscription", body: "Run the Docker image on your own hardware for free forever, or use Lector Cloud from $5/mo. No recurring fee to keep reading your own library." },
      { title: "Your data, your server", body: "Reading history, vocabulary, and progress live in a single SQLite file you control — no cloud account required, and backups are one file copy." },
      { title: "Reading + cloze + Anki, joined up", body: "LingQ-style reading, Clozemaster-style frequency cloze, and two-way Anki sync in one app — plus an LLM tutor and a writing journal. Push words and cloze phrases to Anki, and grades from your Anki reviews update mastery back in Lector (beta)." },
      { title: "Bring your own AI", body: "Point translation and the tutor at the Claude API or a local model (Ollama, LM Studio) — your text stays on your hardware, and quality is your choice." },
    ],
    pickThem:
      "Pick LingQ if you want polished native mobile apps, a big ready-made library with one-click import from video and podcasts, or one of its 50+ languages — and a subscription is fine.",
    pickLector:
      "Pick Lector if you want to own your data, avoid a subscription, and have reading, cloze, two-way Anki sync, and an LLM tutor in one self-hostable app.",
    faqs: [
      {
        question: "Is there a free LingQ alternative?",
        answer:
          "Yes. Lector is open source and free to self-host — run the Docker image on your own hardware and there's no subscription. It combines LingQ-style reading with cloze practice and two-way Anki sync. A managed Lector Cloud is also available from $5/mo if you'd rather not run a server.",
      },
      {
        question: "Can I self-host a LingQ-style reader?",
        answer:
          "Lector is a self-hostable, LingQ-style reader: import EPUBs and articles, click any word to translate, track word states, and mine vocabulary — all running on your own hardware with your data in a local SQLite file.",
      },
      {
        question: "How is Lector different from LingQ?",
        answer:
          "Both are reading-first. Lector is open source and self-hostable with no subscription, keeps your data on your server, adds frequency cloze practice and a first-party two-way Anki integration, and lets you bring your own LLM. LingQ has a larger content library, one-click import from video and podcasts, native mobile apps, and more languages.",
      },
      {
        question: "How much does LingQ cost?",
        answer:
          "As of July 2026, LingQ Premium is around $14.99/mo, or about $10/mo billed annually, with a limited free tier. Lector is free to self-host with no subscription, or from $5/mo on the managed cloud. Check LingQ's site for current pricing.",
      },
    ],
    asOf: "July 2026",
  },

  clozemaster: {
    slug: "clozemaster",
    name: "Clozemaster",
    url: "https://www.clozemaster.com",
    verdict:
      "Lector is a self-hosted, one-time-free alternative to Clozemaster: the same frequency-ordered cloze practice, but paired with a full reading experience and two-way Anki sync, with your data on your own hardware and no subscription.",
    intro:
      "Clozemaster is a gamified way to drill vocabulary through fill-in-the-blank sentences ordered by frequency, over large sentence banks. Lector includes the same frequency cloze practice, then wraps it in a reading-first workflow (import anything, click to translate, mine cards to Anki) — self-hosted and open source. Here's an honest side-by-side.",
    rows: [
      { feature: "Price", lector: LECTOR.price, them: "Free (30/day); Pro $12.99/mo, ~$70/yr, or ~$199 lifetime", advantage: "lector" },
      { feature: "Frequency cloze practice", lector: LECTOR.cloze, them: "Yes — its core feature", advantage: "even" },
      { feature: "Sentence bank size", lector: "Thousands per language (Tatoeba)", them: "Very large banks (also Tatoeba)", advantage: "them" },
      { feature: "Reading imported content", lector: LECTOR.reading, them: "No — sentences only, not full texts", advantage: "lector" },
      { feature: "Click-to-translate", lector: LECTOR.translate, them: "Per-sentence, in practice", advantage: "lector" },
      { feature: "Audio & listening", lector: LECTOR.audio, them: "Native-speaker audio (Pro)", advantage: "them" },
      { feature: "SRS scheduling", lector: "Yes", them: "Yes", advantage: "even" },
      { feature: "Anki integration", lector: LECTOR.anki, them: "No documented Anki export", advantage: "lector" },
      { feature: "AI tutor & writing correction", lector: LECTOR.tutor, them: "No", advantage: "lector" },
      { feature: "Gamification", lector: "Minimal — progress stats", them: "Points, streaks, leaderboards", advantage: "them" },
      { feature: "Data ownership", lector: LECTOR.data, them: "Cloud account; no data export", advantage: "lector" },
      { feature: "Open source", lector: LECTOR.open, them: "Closed source", advantage: "lector" },
      { feature: "Languages", lector: LECTOR.languages, them: "50+ languages, 100+ pairs", advantage: "them" },
      { feature: "Mobile apps", lector: "Web (installable PWA)", them: "Native iOS & Android apps", advantage: "them" },
    ],
    theirStrengths: [
      { title: "Massive sentence banks", body: "Clozemaster offers enormous collections of sentences per language — far more cloze volume than Lector's Tatoeba-sourced banks — across 50+ languages and 100+ pairings." },
      { title: "Gamified and sticky", body: "Points, streaks, levels, and leaderboards make daily practice a habit. Lector keeps progress stats but is deliberately light on game mechanics." },
      { title: "Native apps + real-speaker audio", body: "Polished iOS and Android apps, and for Pro, real-speaker Cloze-Listening audio plus TTS. Lector is a self-hostable web app with optional Google TTS." },
      { title: "Cheap, with a lifetime option", body: "Clozemaster is inexpensive next to most apps, and offers a one-time lifetime purchase (around $199) that avoids recurring fees — though it's still closed and cloud-hosted." },
    ],
    ourStrengths: [
      { title: "Reading, not just sentences", body: "Clozemaster drills isolated sentences; Lector adds a full reading workflow — import books and articles, read in context, and mine the words you actually meet." },
      { title: "Free to self-host", body: "Open source and free on your own hardware, or Lector Cloud from $5/mo — versus a recurring Pro subscription (or a one-time lifetime fee) to lift the free tier's 30-a-day limit." },
      { title: "Your data, your server", body: "Progress lives in a local SQLite file you own and can back up in one copy — no cloud account, and no documented export to get your data out of Clozemaster." },
      { title: "Two-way Anki sync + LLM tutor", body: "Push mined words and cloze phrases to Anki; reviews sync back into Lector (beta). Plus context-aware translation, a tutor, and writing correction from Claude or a local model." },
    ],
    pickThem:
      "Pick Clozemaster if you want the biggest sentence banks, heavy gamification to keep a streak, native mobile apps, or one of its 50+ languages — and you like the lifetime option.",
    pickLector:
      "Pick Lector if you want cloze practice plus real reading and two-way Anki sync in one self-hostable app, and you'd rather own your data than pay a subscription.",
    faqs: [
      {
        question: "Is there a free Clozemaster alternative?",
        answer:
          "Yes. Lector is open source and free to self-host, with frequency-ordered cloze practice built in — plus reading and two-way Anki sync, and no 30-a-day limit. A managed Lector Cloud is available from $5/mo if you'd prefer not to run a server.",
      },
      {
        question: "Does Lector have cloze practice like Clozemaster?",
        answer:
          "Yes — Lector ships frequency-ordered cloze sentence banks (from Tatoeba) with multiple-choice and typing modes and spaced-repetition scheduling, the same fill-in-the-blank practice Clozemaster is built around.",
      },
      {
        question: "Clozemaster vs Lector — what's the difference?",
        answer:
          "Clozemaster focuses on gamified cloze over very large sentence banks. Lector includes frequency cloze too, but pairs it with a full reading experience, a first-party two-way Anki integration, and an LLM tutor — and it's open source, self-hostable, and keeps your data on your hardware.",
      },
      {
        question: "How much does Clozemaster cost?",
        answer:
          "As of July 2026, Clozemaster has a free tier capped at about 30 sentences a day; Pro is around $12.99/mo, ~$70/yr, or a one-time lifetime purchase near $199. Lector is free to self-host, or from $5/mo on the managed cloud. Check Clozemaster's site for current pricing.",
      },
    ],
    asOf: "July 2026",
  },
};
