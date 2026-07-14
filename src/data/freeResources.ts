// Free-resource landing pages at /free/<slug> — high-intent, low-competition
// searches ("free Afrikaans Anki deck", "Afrikaans word frequency list") for the
// first-party assets we host under /reference-data/afrikaans/. These are focused
// download-and-use landings; /reference-data/ remains the provenance/methodology
// view, and each page cross-links the other (self-canonical, different intent).
//
// Facts mirror src/data/languages.ts (the reference-data registry) — keep in sync.

export interface Faq {
  question: string;
  answer: string;
}

export interface FreeResource {
  slug: string;
  /** Drives copy; both still use Dataset + FAQ schema. */
  kind: "deck" | "dataset";
  title: string;
  language: string;
  languageSlug: string;
  /** One-line, quotable summary under the H1. */
  tagline: string;
  /** Download path (served from /public). */
  file: string;
  format: string;
  /** MIME type for the Dataset DataDownload. */
  encodingFormat: string;
  size: string;
  license: string;
  licenseUrl: string;
  stats: { label: string; value: string }[];
  inside: string[];
  howTo: { title: string; body: string }[];
  faqs: Faq[];
  /** For the Dataset schema + meta description. */
  keywords: string[];
  bands?: { name: string; count: number }[];
}

const CC_BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/";

// Wiktionary-derived (kaikki.org) on-device dictionaries, published per language
// as GitHub releases on heuwels/lector. Pure Wiktionary → CC BY-SA 4.0. They're
// large, so we link the release asset rather than host it.
function wiktionaryDict(opts: {
  languageSlug: string;
  language: string;
  langCode: string;
  entries: string;
  senses: string;
  size: string;
  releaseTag: string;
}): FreeResource {
  const releases = "https://github.com/heuwels/lector/releases";
  const releaseUrl = `${releases}/tag/${opts.releaseTag}`;
  return {
    slug: `${opts.languageSlug}-dictionary`,
    kind: "dataset",
    title: `Free ${opts.language}–English dictionary`,
    language: opts.language,
    languageSlug: opts.languageSlug,
    tagline: `A free, open ${opts.language} → English dictionary as a SQLite database: ${opts.entries} entries and ${opts.senses} senses, built from Wiktionary (kaikki.org). It's the same dictionary that powers Lector's offline lookups.`,
    file: `${releases}/download/${opts.releaseTag}/dictionary-${opts.langCode}.db`,
    format: "SQLite",
    encodingFormat: "application/vnd.sqlite3",
    size: opts.size,
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    stats: [
      { label: "Entries", value: opts.entries },
      { label: "Senses", value: opts.senses },
      { label: "Format", value: "SQLite" },
      { label: "License", value: "CC BY-SA 4.0" },
    ],
    inside: [
      `${opts.entries} ${opts.language} headwords with ${opts.senses} English senses, in a single SQLite file.`,
      "Extracted from Wiktionary via kaikki.org — an open, community-built dictionary.",
      "The same dictionary Lector uses for instant, offline word lookups while you read.",
      "Query it with any SQLite client, or read it from code (Python's sqlite3, better-sqlite3, and friends).",
    ],
    howTo: [
      {
        title: "Download the database",
        body: `Grab dictionary-${opts.langCode}.db from the GitHub release below (about ${opts.size}). It's a standard SQLite file.`,
      },
      {
        title: "Open or query it",
        body: "Open it in a SQLite browser, or read it from code. Inspect the tables to see the entry and sense schema.",
      },
      {
        title: "Keep the attribution",
        body: "It's derived from Wiktionary (CC BY-SA 4.0), so preserve attribution and share-alike if you redistribute it.",
      },
    ],
    faqs: [
      {
        question: `Is the ${opts.language} dictionary free to use?`,
        answer: `Yes — it's extracted from Wiktionary and licensed CC BY-SA 4.0, so you're free to download, use, and adapt it with attribution and share-alike.`,
      },
      {
        question: `What format is the ${opts.language} dictionary in?`,
        answer: `A single SQLite database (dictionary-${opts.langCode}.db, about ${opts.size}) with ${opts.entries} entries and ${opts.senses} senses. Open it with any SQLite client, or read it from code.`,
      },
      {
        question: `Where does the ${opts.language} dictionary data come from?`,
        answer: `It's extracted from Wiktionary via kaikki.org and packaged as a lookup database. Full details are on the <a href='${releaseUrl}'>GitHub release</a>.`,
      },
    ],
    keywords: [
      `free ${opts.language} English dictionary`,
      `${opts.language} dictionary download`,
      `${opts.language} English dictionary data`,
      `open ${opts.language} dictionary`,
      `${opts.language} SQLite dictionary`,
    ],
  };
}

export const freeResources: Record<string, FreeResource> = {
  "afrikaans-anki-deck": {
    slug: "afrikaans-anki-deck",
    kind: "deck",
    title: "Free Afrikaans Anki deck",
    language: "Afrikaans",
    languageSlug: "afrikaans",
    tagline:
      "A free, frequency-banded Afrikaans → English Anki deck: 9,066 cards split into six sub-decks from Core to Marginal, so you learn the most common words first. Open data, CC BY-SA 4.0.",
    file: "/reference-data/afrikaans/afrikaans-frequency.apkg",
    format: "APKG",
    encodingFormat: "application/zip",
    size: "2.4 MB",
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    stats: [
      { label: "Cards", value: "9,066" },
      { label: "Sub-decks", value: "6 (Core → Marginal)" },
      { label: "Direction", value: "Afrikaans → English" },
      { label: "License", value: "CC BY-SA 4.0" },
    ],
    inside: [
      "9,066 Afrikaans → English recognition cards, ready to import into Anki.",
      "Split into six sub-decks by blended word frequency — Core, Very Common, Common, Mid, Rare, Marginal — so you can study the highest-value words first.",
      "English glosses sourced from Afrikaans Wiktionary (via kaikki.org).",
      "Built from open data: Afrikaans Wikipedia (37.6M tokens) blended with OpenSubtitles, Zipf-averaged so spoken words aren't under-rated.",
    ],
    howTo: [
      {
        title: "Install Anki",
        body: "Get the free desktop app from apps.ankiweb.net (Windows, macOS, Linux). New to Anki? Our getting-started guide walks through it.",
      },
      {
        title: "Import the deck",
        body: "Download the .apkg below, then double-click it or choose File → Import in Anki. The six sub-decks appear under one parent deck.",
      },
      {
        title: "Study Core first",
        body: "Start with the Core sub-deck and work down. The most common words give the fastest jump in reading comprehension.",
      },
    ],
    bands: [
      { name: "Core", count: 220 },
      { name: "Very Common", count: 1175 },
      { name: "Common", count: 2529 },
      { name: "Mid", count: 2073 },
      { name: "Rare", count: 1163 },
      { name: "Marginal", count: 1906 },
    ],
    faqs: [
      {
        question: "Is this Afrikaans Anki deck really free?",
        answer:
          "Yes — it's free to download and use under CC BY-SA 4.0. No account or payment required. Just download the .apkg and import it into Anki.",
      },
      {
        question: "How do I import the deck into Anki?",
        answer:
          "Download the .apkg file, then in Anki Desktop double-click it or choose File → Import and select the file. The six frequency sub-decks import under a single parent deck. See our Getting started with Anki guide if you're new to Anki.",
      },
      {
        question: "How many cards are in the deck?",
        answer:
          "9,066 Afrikaans → English recognition cards, split into six sub-decks by frequency band from Core (most common) to Marginal.",
      },
      {
        question: "Where does the deck's data come from?",
        answer:
          "Word frequencies come from Afrikaans Wikipedia blended with OpenSubtitles (Zipf-averaged); English glosses come from Afrikaans Wiktionary via kaikki.org. It's all open data — see the reference data page for full provenance.",
      },
    ],
    keywords: [
      "free Afrikaans Anki deck",
      "Afrikaans flashcards",
      "Afrikaans Anki deck download",
      "Afrikaans vocabulary deck",
      "learn Afrikaans flashcards",
    ],
  },

  "afrikaans-frequency-list": {
    slug: "afrikaans-frequency-list",
    kind: "dataset",
    title: "Afrikaans word frequency list",
    language: "Afrikaans",
    languageSlug: "afrikaans",
    tagline:
      "A free Afrikaans word frequency list: 443,747 words ranked by frequency, with raw counts, Zipf scores, and a proper-noun flag. CSV, open data, CC BY-SA 4.0.",
    file: "/reference-data/afrikaans/afrikaans-word-frequency.csv",
    format: "CSV",
    encodingFormat: "text/csv",
    size: "15 MB",
    license: "CC BY-SA 4.0",
    licenseUrl: CC_BY_SA,
    stats: [
      { label: "Words", value: "443,747" },
      { label: "Corpus", value: "37.6M+ tokens" },
      { label: "Format", value: "CSV" },
      { label: "License", value: "CC BY-SA 4.0" },
    ],
    inside: [
      "443,747 Afrikaans words ranked by frequency, one row each.",
      "Columns: rank, word, raw count, Zipf score, and a proper-noun flag.",
      "Frequencies blend Afrikaans Wikipedia (37.6M tokens) with OpenSubtitles (0.83M tokens), Zipf-averaged so everyday spoken vocabulary isn't under-rated by the encyclopedic register.",
      "Plain CSV — open it in a spreadsheet, or load it in Python/R for your own analysis.",
    ],
    howTo: [
      {
        title: "Download the CSV",
        body: "Grab the file below (15 MB). It opens in any spreadsheet, or read it with pandas / readr for analysis.",
      },
      {
        title: "Learn the common words first",
        body: "Sort by rank and work down — the most frequent few thousand words cover the bulk of everyday text. This is the frequency-first idea behind our methodology.",
      },
      {
        title: "Or let Lector do it for you",
        body: "Lector uses this frequency data to order its cloze practice and highlight new words as you read, so you meet common words first automatically.",
      },
    ],
    faqs: [
      {
        question: "What's in the Afrikaans frequency list?",
        answer:
          "A CSV of 443,747 Afrikaans words, each with its frequency rank, raw count, Zipf score, and a proper-noun flag. It's ordered most-common first.",
      },
      {
        question: "How is the frequency computed?",
        answer:
          "It blends Afrikaans Wikipedia (37.6M tokens, written register) with OpenSubtitles (0.83M tokens, spoken), Zipf-averaged so spoken vocabulary isn't under-rated. Full provenance is on the reference data page.",
      },
      {
        question: "How many words does it contain?",
        answer:
          "443,747 words. In practice the most frequent few thousand cover the vast majority of everyday text, which is why studying in frequency order is so efficient.",
      },
      {
        question: "Can I use the list in my own project?",
        answer:
          "Yes — it's licensed CC BY-SA 4.0, so you're free to use and adapt it with attribution and share-alike. It's compiled from open corpora.",
      },
    ],
    keywords: [
      "Afrikaans word frequency list",
      "most common Afrikaans words",
      "Afrikaans frequency list",
      "Afrikaans word list",
      "Afrikaans vocabulary frequency",
    ],
  },

  "afrikaans-dictionary": {
    slug: "afrikaans-dictionary",
    kind: "dataset",
    title: "Free Afrikaans–English dictionary",
    language: "Afrikaans",
    languageSlug: "afrikaans",
    tagline:
      "A free, open Afrikaans → English dictionary as a SQLite database: 15,686 entries and 21,023 senses, assembled from Wiktionary, FreeDict, and public-domain sources. It's the same dictionary that powers Lector's offline lookups.",
    file: "https://github.com/heuwels/lector/releases/download/dict-af-2026-06-19/dictionary-af.db",
    format: "SQLite",
    encodingFormat: "application/vnd.sqlite3",
    size: "3 MB",
    license: "Open · FreeDict GPL-2.0 + Wiktionary CC BY-SA",
    licenseUrl: "https://github.com/heuwels/lector/releases/tag/dict-af-2026-06-19",
    stats: [
      { label: "Entries", value: "15,686" },
      { label: "Senses", value: "21,023" },
      { label: "Format", value: "SQLite" },
      { label: "License", value: "Open source" },
    ],
    inside: [
      "15,686 Afrikaans headwords with 21,023 English senses, in a single SQLite file.",
      "Assembled and de-duplicated from open sources: Wiktionary (via kaikki.org), FreeDict afr-eng, morphological roots, and public-domain dictionary text.",
      "The same dictionary Lector uses for instant, offline word lookups while you read.",
      "Query it with any SQLite client, or read it from code (Python's sqlite3, better-sqlite3, and friends).",
    ],
    howTo: [
      {
        title: "Download the database",
        body: "Grab dictionary-af.db from the GitHub release below (about 3 MB). It's a standard SQLite file.",
      },
      {
        title: "Open or query it",
        body: "Open it in a SQLite browser, or read it from code. Inspect the tables to see the entry and sense schema.",
      },
      {
        title: "Keep the attribution",
        body: "It bundles FreeDict afr-eng (GPL-2.0) and Wiktionary data (CC BY-SA), so preserve the attribution and COPYING from the release if you redistribute it.",
      },
    ],
    faqs: [
      {
        question: "Is the Afrikaans dictionary free to use?",
        answer:
          "Yes — it's built entirely from open sources and free to download and use. It includes FreeDict afr-eng (GPL-2.0) and Wiktionary data (CC BY-SA), so if you redistribute it, keep the attribution and COPYING noted on the <a href='https://github.com/heuwels/lector/releases/tag/dict-af-2026-06-19'>GitHub release</a>.",
      },
      {
        question: "What format is the dictionary in?",
        answer:
          "A single SQLite database (dictionary-af.db, about 3 MB) with 15,686 entries and 21,023 senses. Open it with any SQLite client, or read it from code.",
      },
      {
        question: "Where does the dictionary data come from?",
        answer:
          "It's assembled from Wiktionary (via kaikki.org), FreeDict's afr-eng dictionary, morphological roots, and public-domain dictionary text — de-duplicated into one lookup database. Full provenance and licensing are on the <a href='https://github.com/heuwels/lector/releases/tag/dict-af-2026-06-19'>GitHub release</a>.",
      },
      {
        question: "It looks a little sparse — will it grow?",
        answer:
          "Yes. Coverage will expand as more public-domain source material is digitised. The download always points at the current release.",
      },
    ],
    keywords: [
      "free Afrikaans English dictionary",
      "Afrikaans dictionary download",
      "Afrikaans English dictionary data",
      "open Afrikaans dictionary",
      "Afrikaans SQLite dictionary",
    ],
  },

  "german-dictionary": wiktionaryDict({
    languageSlug: "german",
    language: "German",
    langCode: "de",
    entries: "340,553",
    senses: "723,492",
    size: "146 MB",
    releaseTag: "dict-de-2026-06-25",
  }),

  "spanish-dictionary": wiktionaryDict({
    languageSlug: "spanish",
    language: "Spanish",
    langCode: "es",
    entries: "764,524",
    senses: "901,613",
    size: "260 MB",
    releaseTag: "dict-es-2026-06-26",
  }),

  "french-dictionary": wiktionaryDict({
    languageSlug: "french",
    language: "French",
    langCode: "fr",
    entries: "384,577",
    senses: "488,500",
    size: "99 MB",
    releaseTag: "dict-fr-2026-07-07",
  }),

  "dutch-dictionary": wiktionaryDict({
    languageSlug: "dutch",
    language: "Dutch",
    langCode: "nl",
    entries: "135,986",
    senses: "206,960",
    size: "47 MB",
    releaseTag: "dict-nl-2026-07-07",
  }),

  "italian-dictionary": wiktionaryDict({
    languageSlug: "italian",
    language: "Italian",
    langCode: "it",
    entries: "584,882",
    senses: "767,887",
    size: "160 MB",
    releaseTag: "dict-it-2026-07-12",
  }),

  "portuguese-dictionary": wiktionaryDict({
    languageSlug: "portuguese",
    language: "Portuguese",
    langCode: "pt",
    entries: "411,782",
    senses: "566,136",
    size: "114 MB",
    releaseTag: "dict-pt-2026-07-12",
  }),
};
