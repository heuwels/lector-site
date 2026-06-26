// Registry of supported languages. Drives the /reference-data/ pages (the index
// and one page per entry below). NOTE: the homepage "Supported languages"
// section in src/pages/index.astro is hardcoded separately — keep it in sync.

export interface Download {
  label: string;
  file: string;
  size: string;
  format: string;
  license: string;
  note?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Source {
  label: string;
  detail: string;
  license: string;
  url?: string;
}

export interface Band {
  name: string;
  count: number;
}

// A curated external (community) resource, e.g. a third-party AnkiWeb deck —
// not Lector's own data, just a good complement we link out to.
export interface RecommendedDeck {
  label: string;
  detail: string;
  url: string;
  meta?: string;
}

export interface Language {
  slug: string;
  name: string;
  endonym: string;
  flag: string;
  status: "complete" | "partial" | "coming-soon";
  blurb: string;
  downloads: Download[];
  stats: Stat[];
  bands?: Band[];
  sources: Source[];
  recommendedDecks?: RecommendedDeck[];
}

export const languages: Language[] = [
  {
    slug: "afrikaans",
    name: "Afrikaans → English",
    endonym: "Afrikaans",
    flag: "🇿🇦",
    status: "complete",
    blurb:
      "Frequency-banded vocabulary and a downloadable Anki deck, built from a blend of Afrikaans Wikipedia (written) and OpenSubtitles (spoken). The most complete language pack.",
    downloads: [
      {
        label: "Anki deck — frequency-banded",
        file: "/reference-data/afrikaans/afrikaans-frequency.apkg",
        size: "2.4 MB",
        format: "APKG",
        license: "CC BY-SA 4.0",
        note: "9,066 cards across six frequency sub-decks (Core → Marginal). Afrikaans → English recognition cards. Glosses from Wiktionary.",
      },
      {
        label: "Word frequency list",
        file: "/reference-data/afrikaans/afrikaans-word-frequency.csv",
        size: "15 MB",
        format: "CSV",
        license: "CC BY-SA 4.0",
        note: "443,747 words ranked by Afrikaans Wikipedia frequency, with raw counts, Zipf scores, and a proper-noun flag.",
      },
    ],
    stats: [
      { label: "Written corpus", value: "37.6M tokens · af.wikipedia" },
      { label: "Spoken corpus", value: "0.83M tokens · OpenSubtitles" },
      { label: "Anki cards", value: "9,066" },
      { label: "Frequency list", value: "443,747 words" },
    ],
    bands: [
      { name: "Core", count: 220 },
      { name: "Very Common", count: 1175 },
      { name: "Common", count: 2529 },
      { name: "Mid", count: 2073 },
      { name: "Rare", count: 1163 },
      { name: "Marginal", count: 1906 },
    ],
    sources: [
      {
        label: "Word frequencies",
        detail:
          "Afrikaans Wikipedia (37.6M tokens) blended with OpenSubtitles (0.83M tokens) — Zipf-averaged so spoken vocabulary isn't under-rated by the encyclopedic register.",
        license: "CC BY-SA 4.0 / OPUS",
        url: "https://dumps.wikimedia.org/afwiki/",
      },
      {
        label: "Glosses (definitions)",
        detail: "Afrikaans Wiktionary, extracted via kaikki.org.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Afrikaans/",
      },
    ],
  },
  {
    slug: "spanish",
    name: "Spanish → English",
    endonym: "Español",
    flag: "🇪🇸",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Spanish, at Afrikaans parity. We don't ship our own Spanish Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
    downloads: [],
    stats: [],
    sources: [],
    recommendedDecks: [
      {
        label: "New Spanish Top 5000 Vocabulary",
        detail:
          "The 5,000 most frequent Spanish words in frequency order, from A Frequency Dictionary of Spanish (Davies, 2nd ed.), with native audio and bilingual example sentences — a solid frequency-first vocabulary foundation.",
        url: "https://ankiweb.net/shared/info/2072103552",
        meta: "5,000 cards · free · audio",
      },
    ],
  },
  {
    slug: "german",
    name: "German → English",
    endonym: "Deutsch",
    flag: "🇩🇪",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in German, at Afrikaans parity. We don't ship our own German Anki deck; the excellent free community decks below cover flashcards.",
    downloads: [],
    stats: [],
    sources: [],
    recommendedDecks: [
      {
        label: "Most Frequent Words, Patterns & Phrases",
        detail:
          "~7,800 words in frequency order, with verb conjugations, colour-coded der/die/das genders, example sentences and Wiktionary links.",
        url: "https://ankiweb.net/shared/info/2012989005",
        meta: "~7,800 cards · free",
      },
      {
        label: "Deutsch: 4000 German Words by Frequency",
        detail:
          "The 4,000 most common German words in frequency order — a compact, widely-used core-vocabulary deck.",
        url: "https://ankiweb.net/shared/info/653061995",
        meta: "4,000 cards · free",
      },
      {
        label: "German Mastery: 4,000 Most Frequent Words",
        detail:
          "The 4,000 most frequent words tagged by CEFR level (A1–C2), aligned to Goethe-Institut / telc exam vocabulary.",
        url: "https://ankiweb.net/shared/info/145156667",
        meta: "4,000 cards · free · A1–C2",
      },
    ],
  },
];
