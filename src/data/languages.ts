// Registry of supported languages. Drives the homepage, docs, and
// /reference-data/ pages (the index and one page per entry below).

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
  // For "coming-soon" entries: the lector GitHub issue tracking the pack, e.g.
  // 213 → github.com/heuwels/lector/issues/213. Drives the "Bump the issue" links.
  roadmapIssue?: number;
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
  {
    slug: "french",
    name: "French → English",
    endonym: "Français",
    flag: "🇫🇷",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in French, at Afrikaans parity. We don't ship our own French Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
    downloads: [],
    stats: [],
    sources: [],
    recommendedDecks: [
      {
        label: "5000 Most Frequent French Words",
        detail:
          "The 5,000 most frequent French words in frequency order — a widely-used, free core-vocabulary foundation.",
        url: "https://ankiweb.net/shared/info/614833642",
        meta: "~5,000 cards · free",
      },
    ],
  },
  {
    slug: "dutch",
    name: "Dutch → English",
    endonym: "Nederlands",
    flag: "🇳🇱",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Dutch, at Afrikaans parity. We don't ship our own Dutch Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
    downloads: [],
    stats: [],
    sources: [],
    recommendedDecks: [
      {
        label: "A Frequency Dictionary of Dutch",
        detail:
          "The 5,000 most frequent Dutch words in frequency order, from A Frequency Dictionary of Dutch (Routledge), with English equivalents and example sentences — a solid frequency-first vocabulary foundation.",
        url: "https://ankiweb.net/shared/info/1002891444",
        meta: "~5,000 cards · free",
      },
    ],
  },
  {
    slug: "italian",
    name: "Italian → English",
    endonym: "Italiano",
    flag: "🇮🇹",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Italian, at Afrikaans parity. The on-device dictionary covers rich Italian inflection, while the Tatoeba sentence bank keeps elisions such as l'acqua and un'amica intact in practice.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "584,882 entries" },
      { label: "English senses", value: "767,887" },
      { label: "Inflections", value: "658,019" },
      { label: "Cloze bank", value: "11,783 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Italian Wiktionary entries extracted through Kaikki.org, including form-of records for conjugations and plurals.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Italian/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Italian–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "portuguese",
    name: "Portuguese → English",
    endonym: "Português",
    flag: "🇧🇷",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Portuguese, at Afrikaans parity. Brazilian Portuguese (pt-BR) by default, with a Tatoeba sentence bank and an on-device dictionary covering rich Portuguese inflection (nasal vowels, conjugations, the personal infinitive).",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "411,782 entries" },
      { label: "English senses", value: "566,136" },
      { label: "Inflections", value: "424,236" },
      { label: "Cloze bank", value: "8,363 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Portuguese Wiktionary entries extracted through Kaikki.org, including form-of records for conjugations and plurals.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Portuguese/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Portuguese–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "esperanto",
    name: "Esperanto → English",
    endonym: "Esperanto",
    // Unicode has no Esperanto flag emoji (the verda stelo) — the green
    // square stands in, matching the app's language picker.
    flag: "🟩",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Esperanto. Because the orthography is fully phonemic, every lookup carries a rule-generated IPA pronunciation, and audio is spoken by eSpeak NG — the only text-to-speech engine that exists for Esperanto — hosted by Lector on every plan. Lookups understand Esperanto's regular word-building (malsanulejo → mal- + san + -ul- + -ej-) and accept x-system typing (gxardeno → ĝardeno).",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "134,042 entries" },
      { label: "English senses", value: "136,926" },
      { label: "Inflections", value: "230,825" },
      { label: "Cloze bank", value: "8,019 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Esperanto Wiktionary entries extracted through Kaikki.org, including form-of records for plurals, accusatives, and verb tenses.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Esperanto/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Esperanto–English sentence pairs from Tatoeba (Esperanto is its fourth-largest language), ranked by a custom Esperanto Wikipedia + OpenSubtitles frequency blend and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
      {
        label: "Speech synthesis",
        detail:
          "eSpeak NG formant synthesizer, self-hosted server-side. Phonemically exact for Esperanto's one-letter-one-phoneme orthography.",
        license: "GPL-3.0-or-later (invoked as a separate program)",
        url: "https://github.com/espeak-ng/espeak-ng",
      },
    ],
  },
  {
    slug: "russian",
    name: "Russian → English",
    endonym: "Русский",
    flag: "🇷🇺",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Russian: the first Cyrillic language pack. The on-device dictionary covers Russian's rich inflection (six cases, verb aspect pairs, suppletive forms like шёл → идти), understands the everyday е-for-ё spelling (теплое finds тёплый), and shows lexical stress in definitions.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "426,510 entries" },
      { label: "English senses", value: "507,187" },
      { label: "Inflections", value: "992,704" },
      { label: "Cloze bank", value: "11,604 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Russian Wiktionary entries extracted through Kaikki.org, including form-of records for declensions, conjugations, and aspect pairs.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Russian/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Russian–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "turkish",
    name: "Turkish → English",
    endonym: "Türkçe",
    flag: "🇹🇷",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Turkish. Agglutination is the whole problem here: a single word stacks plural, possessive and case endings (evlerimizden, “from our houses”), and the on-device dictionary unstacks them back to the lemma. Lookups also handle the dotted and dotless i correctly, so a sentence-initial İyi finds iyi and ILIK (“lukewarm”) never collapses onto İLİK (“marrow”).",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "40,714 entries" },
      { label: "English senses", value: "60,257" },
      { label: "Inflections", value: "2,281,087" },
      { label: "Cloze bank", value: "11,765 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Turkish Wiktionary entries extracted through Kaikki.org, including the very large paradigm tables that make agglutinated forms resolvable.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Turkish/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Turkish–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "ukrainian",
    name: "Ukrainian → English",
    endonym: "Українська",
    flag: "🇺🇦",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Ukrainian, as its own language rather than an approximation of Russian. Ukrainian spelling treats the apostrophe as a letter (п'ять, м'ясо, з'їзд), so the reader keeps those words whole and tappable instead of splitting them in half, and a lookup finds the entry whichever apostrophe your source typed. The alphabet includes ґ, є, і and ї, and definitions are Ukrainian ones — так is “yes” here, not the Russian “like that”.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "54,563 entries" },
      { label: "English senses", value: "83,546" },
      { label: "Inflections", value: "346,122" },
      { label: "Cloze bank", value: "9,663 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Ukrainian Wiktionary entries extracted through Kaikki.org, including form-of records for the seven cases, verb conjugations and aspect pairs. Headword stress marks are stripped so unstressed running text still matches.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Ukrainian/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Ukrainian–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "koine-greek",
    name: "Koine Greek → English",
    endonym: "Κοινή",
    // No country flag for a historical language — the Classical building
    // matches the app's language picker.
    flag: "🏛️",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in polytonic Koine. Built for the Greek New Testament: frequency ranks come from the GNT itself (the ~300 most frequent lemmas cover most of the running text), cloze sentences are verse-aligned with their references kept, lookups forgive accent variance (τὸν finds τόν) and typed practice accepts unaccented answers. No synthesized audio on principle: Koine pronunciation is reconstructed and disputed, so the speaker stays silent rather than guessing.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "63,963 entries" },
      { label: "English senses", value: "93,508" },
      { label: "Inflections", value: "1,895,013" },
      { label: "Cloze bank", value: "7,329 verse segments" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Ancient Greek Wiktionary entries extracted through Kaikki.org, supplemented with per-word lemma data from MorphGNT/SBLGNT for the Koine forms Classical-leaning tables miss.",
        license: "CC BY-SA 4.0 / CC BY-SA 3.0",
        url: "https://kaikki.org/dictionary/Ancient%20Greek/",
      },
      {
        label: "Glosses and frequency",
        detail:
          "Dodson Greek-English lexicon glosses for New Testament vocabulary, ranked by lemma frequency over the Greek NT via MorphGNT.",
        license: "CC0 / public domain",
        url: "https://github.com/biblicalhumanities/Dodson-Greek-Lexicon",
      },
      {
        label: "Cloze sentences",
        detail:
          "Greek NT verses (SBLGNT) aligned to the World English Bible by verse reference — every practice sentence keeps its verse ref as provenance.",
        license: "CC BY 4.0 / public domain",
        url: "https://ebible.org/web/",
      },
    ],
  },
  {
    slug: "mandarin",
    name: "Mandarin → English",
    endonym: "中文",
    flag: "🇨🇳",
    status: "coming-soon",
    roadmapIssue: 213,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "japanese",
    name: "Japanese → English",
    endonym: "日本語",
    flag: "🇯🇵",
    status: "coming-soon",
    roadmapIssue: 214,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "hindi",
    name: "Hindi → English",
    endonym: "हिन्दी",
    flag: "🇮🇳",
    status: "coming-soon",
    roadmapIssue: 252,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "arabic",
    name: "Arabic → English",
    endonym: "العربية",
    flag: "🇸🇦",
    status: "coming-soon",
    roadmapIssue: 253,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "biblical-hebrew",
    name: "Biblical Hebrew → English",
    endonym: "עברית מקראית",
    flag: "🇮🇱",
    status: "coming-soon",
    roadmapIssue: 255,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "latin",
    name: "Latin → English",
    endonym: "Latina",
    flag: "🇻🇦",
    status: "coming-soon",
    roadmapIssue: 256,
    blurb: "On the roadmap — pending a language pack.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "indonesian",
    name: "Indonesian → English",
    endonym: "Bahasa Indonesia",
    flag: "🇮🇩",
    status: "coming-soon",
    roadmapIssue: 257,
    blurb: "On the roadmap — pending a language pack.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "korean",
    name: "Korean → English",
    endonym: "한국어",
    flag: "🇰🇷",
    status: "coming-soon",
    roadmapIssue: 258,
    blurb: "On the roadmap — pending reader support for its script.",
    downloads: [],
    stats: [],
    sources: [],
  },
];
