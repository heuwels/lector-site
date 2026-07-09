// Marketing / SEO content for the /languages/<slug> landing pages. Keyed by the
// same slug as src/data/languages.ts (the reference-data registry); kept separate
// so reference data and marketing copy don't tangle. A language shows a guide page
// only if it appears here AND is `status: "complete"` in languages.ts.
//
// Facts (speaker counts, FSI category/hours) were verified against the US Foreign
// Service Institute, Ethnologue/Wikipedia, OIF 2022, and Instituto Cervantes 2024.
// Keep those sources in mind when editing numbers. Sample passages are original,
// wholesome sentences (no copyright risk) written to read naturally in each language.

export interface Faq {
  question: string;
  answer: string;
}

export interface SamplePassage {
  text: string;
  translation: string;
}

export interface LanguageGuide {
  slug: string;
  /** One-sentence, quotable answer under the H1 — written to be lifted by AI answers. */
  answer: string;
  nativeSpeakers: string;
  totalSpeakers: string;
  fsiCategory: string;
  approxHours: string;
  /** FSI intensive-study weeks — feeds the Course JSON-LD workload. */
  approxWeeks: number;
  whyLearn: string[];
  mutualIntelligibility?: string;
  difficultyNote: string;
  faqs: Faq[];
  sample: SamplePassage;
  /** Personalised reader screenshot (real app capture) showing this language. */
  readerImg: string;
  readerAlt: string;
  /** Optional personalised cloze-practice screenshot. */
  clozeImg?: string;
  clozeAlt?: string;
}

export const languageGuides: Record<string, LanguageGuide> = {
  afrikaans: {
    slug: "afrikaans",
    answer:
      "The best way to learn Afrikaans is to read real Afrikaans texts with instant tap-to-translate, drilling the most common words first with frequency-ordered practice and spaced repetition. Afrikaans is also one of the easiest languages for English speakers — no genders, no cases, no verb conjugation — so reading progresses quickly.",
    nativeSpeakers: "~7 million",
    totalSpeakers: "~17 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600 hours",
    approxWeeks: 24,
    whyLearn: [
      "One of the fastest languages for an English speaker to learn: no grammatical gender, no noun cases, and verbs don't change with the subject.",
      "Spoken by around 7 million people as a first language and understood by up to ~20 million across South Africa and Namibia.",
      "A direct gateway to Dutch — the two are largely mutually intelligible in writing.",
    ],
    mutualIntelligibility:
      "Highly mutually intelligible with Dutch (Afrikaans grew out of 17th-century Dutch), especially in writing, and speakers can often follow Flemish too.",
    difficultyNote:
      "Rated FSI Category I (~600 hours), the easiest tier for English speakers. Its grammar is arguably simpler than other Germanic languages — no verb conjugation by person and no cases — though pronunciation and some vocabulary still take practice.",
    faqs: [
      {
        question: "Is Afrikaans hard to learn?",
        answer:
          "Not for English speakers — it's one of the easiest. Afrikaans has no grammatical gender, no case system, and verbs don't change with the subject, so sentence structure feels familiar and regular.",
      },
      {
        question: "How long does it take to learn Afrikaans?",
        answer:
          "The US Foreign Service Institute places Afrikaans in Category I, needing roughly 600 class hours (about 24 weeks of intensive study) to reach professional working proficiency. Casual learners reading daily can handle simple texts and conversations much sooner.",
      },
      {
        question: "What is the best way to learn Afrikaans?",
        answer:
          "Combine lots of reading in real Afrikaans texts with frequency-based vocabulary — learning the most common words first — and spaced repetition to retain them. Because it's so close to English and Dutch, comprehensible reading progresses quickly.",
      },
      {
        question: "Can I learn Afrikaans for free?",
        answer:
          "Yes. Free and self-hosted tools, open dictionaries, public-domain Afrikaans texts, and free spaced-repetition software let you build reading fluency without paying for a course.",
      },
    ],
    sample: {
      text: "Die son sak stadig agter die blou berge, en oral in die dorp maak mense hul vensters oop om die koel aandwind in te laat.",
      translation:
        "The sun sets slowly behind the blue mountains, and all over the town people open their windows to let in the cool evening breeze.",
    },
    readerImg: "/images/languages/afrikaans-reader.png",
    readerAlt:
      "Lector reading an Afrikaans passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/afrikaans-cloze.png",
    clozeAlt: "Afrikaans cloze practice in Lector with multiple-choice options",
  },

  dutch: {
    slug: "dutch",
    answer:
      "The best way to learn Dutch is to read authentic Dutch texts with instant tap-to-translate, learning the highest-frequency words first and locking them in with spaced repetition. Dutch is one of the closest major languages to English, so reading real material builds comprehension fast.",
    nativeSpeakers: "~25 million",
    totalSpeakers: "~30 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600 hours",
    approxWeeks: 24,
    whyLearn: [
      "Around 25 million native speakers across the Netherlands, Belgium (Flanders), and Suriname, with a strong presence in trade, the EU, and international business.",
      "One of the closest major languages to English — shared Germanic roots make thousands of words instantly recognisable.",
      "A stepping stone to Afrikaans and a big head start on German vocabulary and structure.",
    ],
    mutualIntelligibility:
      "Largely mutually intelligible with Afrikaans (which grew out of Dutch) and with Flemish; it shares much vocabulary and grammar with German and English.",
    difficultyNote:
      "FSI Category I (~600 hours), among the easiest tiers for English speakers. Verb-final word order in some clauses and the vowel/'g' pronunciation take getting used to, but core vocabulary overlaps heavily with English.",
    faqs: [
      {
        question: "Is Dutch hard to learn?",
        answer:
          "Dutch is one of the easier languages for English speakers, sitting in the FSI's easiest tier. Much of the vocabulary looks familiar; the main hurdles are verb-final word order in some clauses and pronouncing sounds like the guttural 'g'.",
      },
      {
        question: "How long does it take to learn Dutch?",
        answer:
          "The FSI estimates about 600 class hours (roughly 24 weeks of full-time study) to reach professional working proficiency. With consistent daily reading and practice, everyday reading comprehension comes much earlier.",
      },
      {
        question: "What is the best way to learn Dutch?",
        answer:
          "Read authentic Dutch material daily, prioritise the highest-frequency words, and lock them in with spaced repetition. Because Dutch shares so much with English, reading real texts builds comprehension fast.",
      },
      {
        question: "Can I learn Dutch for free?",
        answer:
          "Yes. Free resources, open-source and self-hosted reading tools, public-domain Dutch literature, and free spaced-repetition software make it entirely possible to learn Dutch at no cost.",
      },
    ],
    sample: {
      text: "De boot vaart langzaam over het rustige kanaal, en op de oude brug staan twee kinderen te zwaaien naar de mensen aan de kant.",
      translation:
        "The boat sails slowly across the calm canal, and on the old bridge two children stand waving to the people on the bank.",
    },
    readerImg: "/images/languages/dutch-reader.png",
    readerAlt:
      "Lector reading a Dutch passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/dutch-cloze.png",
    clozeAlt: "Dutch cloze practice in Lector with multiple-choice options",
  },

  french: {
    slug: "french",
    answer:
      "The best way to learn French is to read real French texts at your level with instant tap-to-translate, focusing on the most frequent vocabulary first and reinforcing it with spaced repetition. English shares thousands of words with French, so a lot of vocabulary is already familiar.",
    nativeSpeakers: "~80 million",
    totalSpeakers: "~300 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600–750 hours",
    approxWeeks: 27,
    whyLearn: [
      "One of the world's most widely spoken languages — roughly 80 million native speakers and over 300 million total across five continents (OIF, 2022).",
      "An official language of the UN, EU, and many international organisations — a real asset for careers in diplomacy, business, and travel.",
      "English borrowed thousands of words from French, so a large amount of vocabulary is already familiar.",
    ],
    mutualIntelligibility:
      "Shares thousands of cognates with English thanks to the Norman influence, and is closely related to Spanish, Italian, and Portuguese — which become easier once you know French.",
    difficultyNote:
      "FSI Category I — one of the easiest tiers — at roughly 600–750 hours. Vocabulary overlaps heavily with English; the main challenges are pronunciation, nasal vowels, silent letters, and grammatical gender.",
    faqs: [
      {
        question: "Is French hard to learn?",
        answer:
          "French is one of the more accessible languages for English speakers because the two share a huge amount of vocabulary. Pronunciation, nasal vowels, silent letters, and gendered nouns are the main things to master.",
      },
      {
        question: "How long does it take to learn French?",
        answer:
          "The FSI puts French in its easiest category, estimating around 600–750 class hours (roughly 24–30 weeks of intensive study) to reach professional working proficiency. Reading regularly speeds up comprehension well before that.",
      },
      {
        question: "What is the best way to learn French?",
        answer:
          "Read real French texts at your level, focus first on the most frequent vocabulary, and use spaced repetition to remember it. Pairing comprehensible reading with listening builds both understanding and an ear for pronunciation.",
      },
      {
        question: "Can I learn French for free?",
        answer:
          "Yes. There is a wealth of free French content — public-domain books, open courses, and free or self-hosted reading and flashcard tools — so you can reach a high level without paying for lessons.",
      },
    ],
    sample: {
      text: "Le matin, quand le soleil se lève sur le village, les boulangers ouvrent leurs portes et l'odeur du pain frais remplit les rues tranquilles.",
      translation:
        "In the morning, when the sun rises over the village, the bakers open their doors and the smell of fresh bread fills the quiet streets.",
    },
    readerImg: "/images/languages/french-reader.png",
    readerAlt:
      "Lector reading a French passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/french-cloze.png",
    clozeAlt: "French cloze practice in Lector with multiple-choice options",
  },

  spanish: {
    slug: "spanish",
    answer:
      "The best way to learn Spanish is to read authentic Spanish daily with instant tap-to-translate, learning the most frequent words first and reinforcing them with spaced repetition. Spanish spelling is highly phonetic, so reading real texts quickly builds both vocabulary and pronunciation.",
    nativeSpeakers: "~485–500 million",
    totalSpeakers: "~600 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600 hours",
    approxWeeks: 24,
    whyLearn: [
      "The world's second-most-spoken native language — nearly 500 million native speakers and around 600 million total (Instituto Cervantes).",
      "Official in 20+ countries across Spain and Latin America, and hugely useful for travel, business, and community life in the US.",
      "Highly phonetic spelling — words are pronounced as they're written — which makes reading approachable from early on.",
    ],
    mutualIntelligibility:
      "Closely related to Portuguese and Italian (often partly understandable) and shares many Latin-derived cognates with English; knowing Spanish makes other Romance languages far easier.",
    difficultyNote:
      "FSI Category I (~600 hours), one of the easiest languages for English speakers. Spelling is highly phonetic and grammar is regular; verb conjugations and the subjunctive mood are the main learning curve.",
    faqs: [
      {
        question: "Is Spanish hard to learn?",
        answer:
          "Spanish is one of the easiest languages for English speakers. Spelling is phonetic and predictable and there are many shared cognates; the biggest challenges are verb conjugations and the subjunctive mood.",
      },
      {
        question: "How long does it take to learn Spanish?",
        answer:
          "The FSI classifies Spanish as Category I — about 600 class hours (roughly 24 weeks of intensive study) to reach professional working proficiency. Consistent reading and practice bring everyday comprehension much sooner.",
      },
      {
        question: "What is the best way to learn Spanish?",
        answer:
          "Read authentic Spanish daily, learn the most frequent words first, and reinforce them with spaced repetition. Because spelling maps cleanly to sound, reading real texts quickly builds both vocabulary and pronunciation.",
      },
      {
        question: "Can I learn Spanish for free?",
        answer:
          "Yes. Spanish has an enormous amount of free material — public-domain books, open courses, podcasts, and free or self-hosted reading and flashcard tools — so no paid course is required.",
      },
    ],
    sample: {
      text: "Por la tarde, la familia se reúne en la plaza para hablar, tomar café y ver a los niños jugar bajo los árboles.",
      translation:
        "In the afternoon, the family gathers in the square to talk, drink coffee, and watch the children play under the trees.",
    },
    readerImg: "/images/languages/spanish-reader.png",
    readerAlt:
      "Lector reading a Spanish passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/spanish-cloze.png",
    clozeAlt: "Spanish cloze practice in Lector with multiple-choice options",
  },

  german: {
    slug: "german",
    answer:
      "The best way to learn German is to read real German texts with instant tap-to-translate, prioritising the most frequent vocabulary and using spaced repetition to internalise each word with its gender and plural. Plenty of reading also helps the case system and word order start to feel natural.",
    nativeSpeakers: "~95 million",
    totalSpeakers: "~130 million (incl. second-language)",
    fsiCategory: "Category II",
    approxHours: "~750 hours",
    approxWeeks: 30,
    whyLearn: [
      "Around 95 million native speakers — the most widely spoken native language in the European Union — and the language of Europe's largest economy.",
      "A major language for science, engineering, philosophy, and business, with strong study and career opportunities in Germany, Austria, and Switzerland.",
      "Shares Germanic roots with English, so a lot of core everyday vocabulary is recognisable.",
    ],
    mutualIntelligibility:
      "Shares Germanic vocabulary and structure with English and Dutch; knowing German makes Dutch, Afrikaans, and the Scandinavian languages more approachable.",
    difficultyNote:
      "FSI Category II (~750 hours), a step above the Category I languages. The vocabulary is often familiar, but four noun cases, three grammatical genders, and verb-final word order in clauses take dedicated practice.",
    faqs: [
      {
        question: "Is German hard to learn?",
        answer:
          "German is moderately challenging for English speakers — a step above French or Spanish. The words are often recognisable, but the grammar (four cases, three genders, and flexible word order) is what takes time to master.",
      },
      {
        question: "How long does it take to learn German?",
        answer:
          "The FSI places German in Category II, estimating about 750 class hours (roughly 30 weeks of intensive study) to reach professional working proficiency — a bit more than Category I languages like Spanish or Dutch.",
      },
      {
        question: "What is the best way to learn German?",
        answer:
          "Read real German texts, prioritise the most frequent vocabulary, and use spaced repetition to internalise each word along with its gender and plural. Plenty of reading also helps the case system and word order start to feel natural.",
      },
      {
        question: "Can I learn German for free?",
        answer:
          "Yes. German has abundant free resources — public-domain literature, open courses, and free or self-hosted reading and flashcard tools — so you can reach a strong level without paying for classes.",
      },
    ],
    sample: {
      text: "Am Sonntagmorgen gehen die Familien gern im Wald spazieren, und die Kinder sammeln bunte Blätter, während die Vögel in den hohen Bäumen singen.",
      translation:
        "On Sunday mornings, families like to take a walk in the forest, and the children collect colourful leaves while the birds sing in the tall trees.",
    },
    readerImg: "/images/languages/german-reader.png",
    readerAlt:
      "Lector reading a German passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/german-cloze.png",
    clozeAlt: "German cloze practice in Lector with multiple-choice options",
  },
};
