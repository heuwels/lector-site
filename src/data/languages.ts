// Registry of supported languages. Drives the homepage "Supported languages"
// section and the /reference-data/[language]/ pages (one page per entry below).

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
    status: "coming-soon",
    blurb: "Coming soon.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "german",
    name: "German → English",
    endonym: "Deutsch",
    flag: "🇩🇪",
    status: "partial",
    blurb:
      "Partial support — the full German dictionary works for reading and in-app word lookups. Frequency-banded vocabulary and an Anki deck aren't available yet.",
    downloads: [],
    stats: [],
    sources: [],
  },
];
