// Builds /llms.txt from the live language, guide, and comparison registries
// so crawlers see the same pack list the rest of the site renders.

import { comparisons } from "../data/comparisons";
import { languageGuides } from "../data/languageGuides";
import { languages, type Language } from "../data/languages";

const SITE = "https://lector.dev";

const LEARN_ARTICLES: { slug: string; title: string }[] = [
  {
    slug: "how-to-learn-a-language-by-reading",
    title: "How to learn a language by reading",
  },
  {
    slug: "what-is-comprehensible-input",
    title: "What is comprehensible input?",
  },
  {
    slug: "what-is-sentence-mining",
    title: "What is sentence mining?",
  },
  {
    slug: "spaced-repetition-explained",
    title: "Spaced repetition, explained",
  },
  {
    slug: "frequency-based-vocabulary",
    title: "Frequency-based vocabulary: learn the right words first",
  },
];

function englishName(language: Language): string {
  return language.name.split("→")[0].trim();
}

function abs(path: string): string {
  return `${SITE}${path}`;
}

function bullet(href: string, label: string, detail?: string): string {
  const link = `[${label}](${abs(href)})`;
  return detail ? `- ${link}: ${detail}` : `- ${link}`;
}

function firstSentence(text: string): string {
  const head = text.split(". ")[0].replace(/\.$/, "");
  return `${head}.`;
}

function languageHref(language: Language): string {
  return languageGuides[language.slug]
    ? `/languages/${language.slug}/`
    : `/reference-data/${language.slug}/`;
}

export function buildLlmsTxt(): string {
  const complete = languages.filter((language) => language.status === "complete");
  const partial = languages.filter((language) => language.status === "partial");
  const packNames = complete.map(englishName).join(", ");

  const learnComplete = complete.map((language) =>
    bullet(languageHref(language), `Learn ${englishName(language)}`),
  );
  const learnPartial = partial.map((language) =>
    bullet(
      `/reference-data/${language.slug}/`,
      `Learn ${englishName(language)}`,
      "dictionary only, no cloze bank",
    ),
  );

  const comparisonBullets = Object.values(comparisons).map((comparison) =>
    bullet(
      `/vs/${comparison.slug}/`,
      comparison.name,
      firstSentence(comparison.verdict),
    ),
  );

  const learnArticleBullets = LEARN_ARTICLES.map((article) =>
    bullet(`/learn/${article.slug}/`, article.title),
  );

  const lines = [
    "# Lector",
    "",
    `> Lector is a language-learning reader. It is an alternative to LingQ and Clozemaster. Use Lector Cloud from $5/mo, or self-host it. Import EPUB, articles, YouTube captions, and podcasts. Click any word to translate. Practice with frequency cloze and two-way Anki. A self-host stores data in SQLite. It is open source (AGPL). Language packs cover ${packNames}. Japanese and Korean have a dictionary and no cloze bank yet.`,
    "",
    "## Learn a language",
    "",
    ...learnComplete,
    bullet("/languages/", "All languages"),
    ...learnPartial,
    "",
    "## Comparisons",
    "",
    ...comparisonBullets,
    bullet("/vs/", "All comparisons"),
    "",
    "## Method",
    "",
    bullet("/learn/", "Learn by reading"),
    ...learnArticleBullets,
    bullet(
      "/methodology/",
      "Methodology",
      "The three-phase approach — frequency-based vocabulary, extensive reading with sentence mining, then comprehensible-input immersion. Draws on Krashen's comprehensible input and Kaufmann's learning-by-reading.",
    ),
    "",
    "## Docs",
    "",
    bullet(
      "/docs/",
      "Documentation",
      "Installation, configuration, self-hosting, and features.",
    ),
    bullet(
      "/docs/installation/",
      "Installation",
      "Run Lector with Docker Compose in about a minute.",
    ),
    bullet(
      "/docs/features/",
      "Reading & practice",
      "The reader, click-to-translate, word states, cloze SRS, AI providers, AnkiConnect, and the Lector Sync add-on for Anki (AnkiWeb code 1098736891).",
    ),
    bullet(
      "/docs/languages/",
      "Supported languages",
      "Language packs and how the frequency data is built.",
    ),
    "",
    "## Reference data",
    "",
    bullet(
      "/reference-data/",
      "Reference data",
      "Downloadable frequency-banded Anki decks and word-frequency lists per language, built from public corpora.",
    ),
    bullet(
      "/reference-data/afrikaans/",
      "Afrikaans reference data",
      "A free 9,066-card frequency-banded Afrikaans Anki deck and a 443k-word frequency list (CC BY-SA 4.0).",
    ),
    "",
    "## Run it",
    "",
    bullet(
      "/pricing/",
      "Pricing",
      "Self-host free forever, or Lector Cloud from $5/mo.",
    ),
    bullet(
      "/contact/",
      "Contact",
      "Send a support message. The address is support@lector.dev.",
    ),
    bullet(
      "/blog/",
      "Blog",
      "Notes on building Lector — local-LLM translation quality, OCRing an Afrikaans dictionary, and more.",
    ),
    "",
  ];

  return `${lines.join("\n")}\n`;
}
