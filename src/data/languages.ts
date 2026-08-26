// Registry of supported languages. Drives the homepage, docs, /languages/ and
// /reference-data/ pages (the index and one page per entry below).
//
// ORDER MATTERS, and it is not arbitrary: every consumer renders this array as
// it stands, so this order decides which language a visitor sees first. Supported
// languages come first, then the roadmap, and inside each group the order is by
// TOTAL speakers worldwide (first language plus second language) so prominence
// tracks how many people actually speak each one. Languages with no comparable
// count — Esperanto, Koine Greek, Biblical Hebrew, Latin — sit at the end of
// their group. src/data/languageGuides.ts holds the same order; keep them in
// step, and put a new entry where its speaker count belongs rather than at the
// bottom.

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
  // For "coming-soon" entries: the lector GitHub issue that tracks the pack,
  // e.g. 213 → github.com/heuwels/lector/issues/213. Only /docs/languages/
  // links to it, because that page has a technical audience.
  //
  // The marketing pages do not. A learner who wants a language uses the form
  // in components/LanguageNotify.astro, on the home page, /reference-data/
  // and /roadmap/. Do not send a learner to an issue tracker.
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
    slug: "mandarin",
    name: "Mandarin → English",
    endonym: "中文",
    flag: "🇨🇳",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Mandarin. Chinese writes no spaces, so the reader splits each sentence into words before you tap one: 我喜欢读书 reads as 我 · 喜欢 · 读书, not five loose characters. Because a character does not show how it sounds, pinyin sits above every word while you read, and each reading retires once you mark that word known. Entries are keyed on Simplified, and Traditional resolves to the same entry, so 這 and 这 both answer zhè.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "145,875 entries" },
      { label: "English senses", value: "220,906" },
      { label: "Pinyin readings", value: "145,361" },
      { label: "Cloze bank", value: "7,967 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and pinyin",
        detail:
          "Chinese Wiktionary entries extracted through Kaikki.org. Every entry carries its Standard Mandarin pinyin, and Traditional headwords are filed as aliases of the Simplified form they convert to.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Chinese/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Mandarin–English sentence pairs from Tatoeba, segmented with jieba, frequency-ranked with wordfreq and filtered against the on-device dictionary. Traditional-script rows are excluded.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
      {
        label: "Script conversion and readings",
        detail:
          "OpenCC decides the Traditional-to-Simplified key for every entry, and pypinyin ranks the reading a character takes when it has several. Both run at build time, so neither ships in the app.",
        license: "Apache-2.0 (OpenCC), MIT (pypinyin)",
        url: "https://github.com/BYVoid/OpenCC",
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
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Spanish. We don't ship our own Spanish Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
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
    slug: "arabic",
    name: "Arabic → English",
    endonym: "العربية",
    // No country flag. Modern Standard Arabic is a pan-Arab written standard
    // that no single state owns, so a national flag reads as a claim to an
    // Egyptian, Iraqi or Moroccan learner. Same reasoning as the 🏛️ on Latin
    // and Koine Greek, and it matches the flag in the app's language picker.
    flag: "🌍",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Arabic: the first right-to-left language pack. Modern Standard Arabic, the written form newspapers and Wikipedia use, not a spoken dialect. A dictionary prints كَتَبَ and a newspaper prints كتب, so entries are keyed on the unvocalized spelling and running text resolves without the vowel marks, while the vocalized spelling shows in the definition. The four alef spellings fold to one key, so إلى and الى answer the same entry, and lookups peel the articles, conjunctions and pronoun endings that Arabic writes solid (وبالقلم → قلم, كتابه → كتاب). Typed practice accepts an unvocalized answer, because that is how the language is written.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "25,750 entries" },
      { label: "English senses", value: "58,893" },
      { label: "Inflections", value: "347,672" },
      { label: "Cloze bank", value: "7,126 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Arabic Wiktionary entries extracted through Kaikki.org. Keys drop the vowel marks and fold the alef spellings أ إ آ ٱ to bare ا, so a headword matches running text. The vocalized spelling is kept from each entry's canonical form and shown in the definition.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Arabic/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Arabic–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
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
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in French. We don't ship our own French Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
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
    slug: "portuguese",
    name: "Portuguese → English",
    endonym: "Português",
    flag: "🇧🇷",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Portuguese. Brazilian Portuguese (pt-BR) by default, with a Tatoeba sentence bank and an on-device dictionary covering rich Portuguese inflection (nasal vowels, conjugations, the personal infinitive).",
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
    slug: "indonesian",
    name: "Indonesian → English",
    endonym: "Bahasa Indonesia",
    flag: "🇮🇩",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Indonesian. Official spelling has no diacritics and almost no inflection. Reduplicated plurals stay one word (buku-buku), and lookups peel voice prefixes and possessive clitics (membeli → beli, namanya → nama).",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "34,251 entries" },
      { label: "English senses", value: "57,766" },
      { label: "Inflections", value: "28,750" },
      { label: "Cloze bank", value: "7,220 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Indonesian Wiktionary entries extracted through Kaikki.org, including form-of records for derived meN-/ber-/di-/ter- verbs. Lookups also peel those prefixes and the possessive clitics -nya/-ku/-mu when the dump has no row for the written form.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Indonesian/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Indonesian–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
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
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in German. We don't ship our own German Anki deck; the excellent free community decks below cover flashcards.",
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
    slug: "italian",
    name: "Italian → English",
    endonym: "Italiano",
    flag: "🇮🇹",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Italian. The on-device dictionary covers rich Italian inflection, while the Tatoeba sentence bank keeps elisions such as l'acqua and un'amica intact in practice.",
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
    slug: "polish",
    name: "Polish → English",
    endonym: "Polski",
    flag: "🇵🇱",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Polish. The on-device dictionary covers seven cases across three genders, verb aspect pairs, and the consonant alternations that defeat naive stemming: noga becomes nodze, miasto becomes mieście, pies becomes psowi. Definitions also carry IPA, so tapping a word shows how to say it as well as what it means.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "169,953 entries" },
      { label: "English senses", value: "270,331" },
      { label: "Inflections", value: "1,137,470" },
      { label: "Cloze bank", value: "10,518 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Polish Wiktionary entries extracted through Kaikki.org, including form-of records for the seven cases, conjugations and aspect pairs, plus IPA transcriptions on the headwords.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Polish/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Polish–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
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
    slug: "dutch",
    name: "Dutch → English",
    endonym: "Nederlands",
    flag: "🇳🇱",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Dutch. We don't ship our own Dutch Anki deck; you mine your own cards as you read, and the community deck below covers the vocabulary foundation.",
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
    slug: "afrikaans",
    name: "Afrikaans → English",
    endonym: "Afrikaans",
    flag: "🇿🇦",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Afrikaans. The only pack with its own downloadable Anki deck and published frequency list, built from a blend of Afrikaans Wikipedia (written) and OpenSubtitles (spoken).",
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
    slug: "czech",
    name: "Czech → English",
    endonym: "Čeština",
    flag: "🇨🇿",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Czech. Vowel length carries meaning here, so byt (“a flat”) and být (“to be”) stay two separate words instead of collapsing onto one key. The on-device dictionary covers seven cases, verb aspect pairs, and the stem changes that defeat naive stemming: kůň becomes koňmi, pes becomes psovi, město becomes městě. Definitions also carry IPA, so tapping a word shows how to say it as well as what it means.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "68,249 entries" },
      { label: "English senses", value: "88,200" },
      { label: "Inflections", value: "439,882" },
      { label: "Cloze bank", value: "9,312 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Czech Wiktionary entries extracted through Kaikki.org, including form-of records for the seven cases, conjugations and aspect pairs, plus IPA transcriptions on the headwords.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Czech/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Czech–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
  },
  {
    slug: "swedish",
    name: "Swedish → English",
    endonym: "Svenska",
    flag: "🇸🇪",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Swedish. Nouns take a definite suffix (hus → huset → husen), and two genders split the indefinite article (en bok, ett hus). The on-device dictionary carries those forms plus the å/ä/ö letters. Solid compounds stay one word (sjukhusparkering).",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "301,652 entries" },
      { label: "English senses", value: "358,170" },
      { label: "Inflections", value: "250,209" },
      { label: "Cloze bank", value: "8,854 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Swedish Wiktionary entries extracted through Kaikki.org, including form-of records for the definite suffix, plurals, and verb forms.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Swedish/",
      },
      {
        label: "Cloze sentences",
        detail:
          "Swedish–English sentence pairs from Tatoeba, frequency-ranked with wordfreq and filtered against the on-device dictionary.",
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
    slug: "latin",
    name: "Latin → English",
    endonym: "Latina",
    // No country flag for a historical language — the Classical building
    // matches the app's language picker.
    flag: "🏛️",
    status: "complete",
    blurb:
      "Fully supported — read, tap-to-define, mine vocabulary, and practice frequency-banded cloze in Latin. Dictionaries mark vowel length; running text almost never does, so amāre and amare are one key, and typed practice accepts the unmarked form. Lookups also try the u/v and i/j spellings editions mix (uult finds vult). Frequency ranks come from the Dickinson College Commentaries Latin Core Vocabulary. No synthesized audio on principle: classical and ecclesiastical pronunciation are disputed, so the speaker stays silent rather than guessing.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "833,680 entries" },
      { label: "English senses", value: "1,089,712" },
      { label: "Inflections", value: "965,021" },
      { label: "Cloze bank", value: "10,733 sentences" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Latin Wiktionary entries extracted through Kaikki.org, including form-of records for the five declensions and the full verb system. Keys strip editorial macrons and unfold æ/œ.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Latin/",
      },
      {
        label: "Frequency ranks",
        detail:
          "Dickinson College Commentaries Latin Core Vocabulary — about 1,000 lemmas ranked from a large Classical Latin corpus. Tatoeba token counts fill the rest of the cloze spine.",
        license: "CC BY-SA 3.0",
        url: "https://dcc.dickinson.edu/latin-core-list1",
      },
      {
        label: "Cloze sentences",
        detail:
          "Latin–English sentence pairs from Tatoeba, ranked on the DCC spine and filtered against the on-device dictionary.",
        license: "CC BY 2.0 FR",
        url: "https://tatoeba.org/",
      },
    ],
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
    slug: "japanese",
    name: "Japanese → English",
    endonym: "日本語",
    flag: "🇯🇵",
    status: "partial",
    roadmapIssue: 214,
    blurb:
      "Reader and on-device dictionary ship today. Furigana sits above kanji, and a morphological analyser keeps conjugated verbs whole. The cloze bank is the remaining work.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "91,339 entries" },
      { label: "English senses", value: "146,092" },
    ],
    sources: [
      {
        label: "Dictionary and furigana",
        detail:
          "Japanese Wiktionary entries extracted through Kaikki.org. Readings come from the canonical ruby row, not from phonetic sounds[].",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Japanese/",
      },
    ],
  },
  {
    slug: "vietnamese",
    name: "Vietnamese → English",
    endonym: "Tiếng Việt",
    flag: "🇻🇳",
    status: "coming-soon",
    blurb:
      "On the roadmap. The reader needs word-boundary support first, because a Vietnamese word is often two syllables with a space between them: học sinh is one word, not two.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "tagalog",
    name: "Tagalog → English",
    endonym: "Tagalog",
    flag: "🇵🇭",
    status: "coming-soon",
    blurb:
      "On the roadmap. Tagalog marks aspect inside the stem, so a lookup has to resolve sumulat back to sulat before it can answer.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "korean",
    name: "Korean → English",
    endonym: "한국어",
    flag: "🇰🇷",
    status: "partial",
    roadmapIssue: 258,
    blurb:
      "Reader and on-device dictionary ship today. Lookups peel postpositions and connective endings off an eojeol (도서관에서 → 도서관). The cloze bank is the remaining work.",
    downloads: [],
    stats: [
      { label: "Dictionary", value: "50,403 entries" },
      { label: "English senses", value: "65,760" },
    ],
    sources: [
      {
        label: "Dictionary and inflections",
        detail:
          "Korean Wiktionary entries extracted through Kaikki.org, including the finite conjugation tables. Postpositions and connective endings resolve through a peel at lookup time.",
        license: "CC BY-SA 4.0",
        url: "https://kaikki.org/dictionary/Korean/",
      },
    ],
  },
  {
    slug: "romanian",
    name: "Romanian → English",
    endonym: "Română",
    flag: "🇷🇴",
    status: "coming-soon",
    blurb:
      "On the roadmap. The reader handles the script today, so this pack needs its dictionary and its cloze bank.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "modern-greek",
    name: "Modern Greek → English",
    endonym: "Ελληνικά",
    flag: "🇬🇷",
    status: "coming-soon",
    roadmapIssue: 475,
    blurb:
      "On the roadmap. The Greek script already ships with the Koine Greek pack, so this pack needs its dictionary and its cloze bank.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "hungarian",
    name: "Hungarian → English",
    endonym: "Magyar",
    flag: "🇭🇺",
    status: "coming-soon",
    roadmapIssue: 473,
    blurb:
      "On the roadmap. Hungarian has one of the largest sentence banks on Tatoeba, and the pack needs the build.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "modern-hebrew",
    name: "Modern Hebrew → English",
    endonym: "עברית",
    flag: "🇮🇱",
    status: "coming-soon",
    blurb:
      "On the roadmap. Right-to-left reading shipped with Arabic, so what is left is the pack itself: an unpointed key for pointed dictionary entries, which is the same fold Arabic uses for its vowel marks.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "danish",
    name: "Danish → English",
    endonym: "Dansk",
    flag: "🇩🇰",
    status: "coming-soon",
    blurb:
      "On the roadmap. The Swedish pack proves the pattern, and Danish has more English sentence pairs than Swedish did.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "finnish",
    name: "Finnish → English",
    endonym: "Suomi",
    flag: "🇫🇮",
    status: "coming-soon",
    roadmapIssue: 476,
    blurb:
      "On the roadmap. Finnish inflects deeply, so the dictionary build is the work: one noun carries fifteen cases before any possessive suffix.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "slovak",
    name: "Slovak → English",
    endonym: "Slovenčina",
    flag: "🇸🇰",
    status: "coming-soon",
    blurb:
      "On the roadmap. The Czech pack proves the pattern, so this pack needs its dictionary and its cloze bank.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "irish",
    name: "Irish → English",
    endonym: "Gaeilge",
    flag: "🇮🇪",
    status: "coming-soon",
    blurb:
      "On the roadmap. A lookup has to undo initial mutation before it can answer, so bhean resolves to bean.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "welsh",
    name: "Welsh → English",
    endonym: "Cymraeg",
    flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
    status: "coming-soon",
    blurb:
      "On the roadmap. Welsh needs a frequency source of its own, because the word-frequency data every other pack uses covers no Celtic language.",
    downloads: [],
    stats: [],
    sources: [],
  },
  {
    slug: "scottish-gaelic",
    name: "Scottish Gaelic → English",
    endonym: "Gàidhlig",
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    status: "coming-soon",
    blurb:
      "On the roadmap. Scottish Gaelic shares its frequency work with Welsh and Irish. The sentence bank stays smaller than most, because little Gaelic and English parallel text carries an open licence.",
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
];
