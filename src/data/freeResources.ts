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
};
