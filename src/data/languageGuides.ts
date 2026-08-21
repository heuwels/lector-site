// Marketing / SEO content for the /languages/<slug> landing pages. Keyed by the
// same slug as src/data/languages.ts (the reference-data registry); kept separate
// so reference data and marketing copy don't tangle. A language shows a guide page
// only if it appears here AND is `status: "complete"` in languages.ts.
//
// Entries are ordered by TOTAL speakers worldwide (first language plus second
// language), because that order decides prominence on /languages/ and it should
// track how many people actually speak each language. Mandarin leads at about
// 1.18 billion. Esperanto and Koine Greek have no comparable count, so they sit
// at the end. src/data/languages.ts holds
// the same order; keep the two in step.
//
// Facts (speaker counts, FSI category/hours) were verified against the US Foreign
// Service Institute, Ethnologue/Wikipedia, OIF 2022, and Instituto Cervantes 2024.
// Keep those sources in mind when editing numbers. Sample passages are original,
// wholesome sentences (no copyright risk) written to read naturally in each
// language. Koine is the exception: its sample is John 1:1, because a marketing
// page for a scriptural reading language should quote the text people come for.

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
  mandarin: {
    slug: "mandarin",
    answer:
      "The best way to learn Mandarin is to read real Chinese with instant tap-to-translate and pinyin above every word, learning the most frequent words first and holding them with spaced repetition. Chinese writes no spaces, so a reader that splits each sentence into words is what turns a wall of characters into something you can look up.",
    nativeSpeakers: "~990 million",
    totalSpeakers: "~1.18 billion (incl. second-language)",
    fsiCategory: "Category IV",
    approxHours: "~2,200 hours",
    approxWeeks: 88,
    whyLearn: [
      "Around 990 million native speakers and roughly 1.18 billion in total — more first-language speakers than any other language on earth.",
      "One written standard across the whole Chinese-speaking world, and the same characters sit under a large share of Japanese and Korean vocabulary.",
      "No verb conjugation, no noun cases, no grammatical gender, and no plurals. Mandarin grammar is far simpler than its reputation suggests. The script and the tones are the work.",
    ],
    mutualIntelligibility:
      "Spoken Mandarin is not mutually intelligible with Cantonese, Hokkien or Shanghainese, but they share the written language, so reading carries across the Chinese-speaking world. Lector keys entries on Simplified and resolves Traditional to the same entry, so 這 and 这 both answer zhè.",
    difficultyNote:
      "FSI Category IV (~2,200 hours), the hardest tier for English speakers, alongside Japanese, Korean and Arabic. The grammar is not the reason. Two other things are: four tones that change meaning, and a script where a character does not tell you how it sounds. Reading is where both get solved, which is why Lector prints pinyin above every word and retires each reading once you mark that word known.",
    faqs: [
      {
        question: "Is Mandarin hard to learn?",
        answer:
          "Mandarin sits in the FSI's hardest tier, though not because of its grammar. There is no conjugation, no case, no gender and no plural. The difficulty is the tones and the writing system, and both are learned by meeting the same words again and again in context.",
      },
      {
        question: "How long does it take to learn Mandarin?",
        answer:
          "The US Foreign Service Institute places Mandarin in Category IV, at roughly 2,200 class hours (about 88 weeks of intensive study) to reach professional working proficiency. Reading with pinyin support and lookups a tap away brings simple texts within reach long before that.",
      },
      {
        question: "How many Chinese characters do I need to read?",
        answer:
          "Roughly 2,500 to 3,000 characters covers most everyday text, and the most frequent 1,000 do the bulk of the work. Frequency-ordered practice is the shortest way through that list, which is exactly what a cloze bank ranked by frequency gives you.",
      },
      {
        question: "What is the best way to learn Mandarin?",
        answer:
          "Read real Chinese with word segmentation, pinyin above each word, and a tap-to-translate dictionary. Learn the most frequent words first and let spaced repetition return them. Because the reader retires the pinyin once you know a word, the support fades on its own as you improve.",
      },
      {
        question: "Can I learn Mandarin for free?",
        answer:
          "Yes. Mandarin has an enormous free corpus — public-domain literature, open courses, news, podcasts and video — and free or self-hosted reading and flashcard tools cover the practice side, so no paid course is required.",
      },
    ],
    sample: {
      text: "傍晚的时候，太阳落到山后面，人们坐在门口聊天，看孩子们在街上玩。",
      translation:
        "In the evening, when the sun drops behind the mountain, people sit in their doorways chatting and watch the children playing in the street.",
    },
    readerImg: "/images/languages/mandarin-reader.png",
    readerAlt:
      "Lector reading a Mandarin passage with pinyin above each word, colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/mandarin-cloze.png",
    clozeAlt: "Mandarin cloze practice in Lector with multiple-choice options",
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

  portuguese: {
    slug: "portuguese",
    answer:
      "The best way to learn Portuguese is to read authentic Portuguese daily with instant tap-to-translate, learning the most frequent words first and reinforcing them with spaced repetition. Portuguese spelling is largely regular, so reading real texts quickly builds vocabulary — and Lector defaults to Brazilian Portuguese (pt-BR), the largest variety.",
    nativeSpeakers: "~260 million",
    totalSpeakers: "~265 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600–750 hours",
    approxWeeks: 27,
    whyLearn: [
      "Around 260 million native speakers — the most-spoken language in South America and the Southern Hemisphere, and official on four continents (Brazil, Portugal, Angola, Mozambique, and more).",
      "Brazil is one of the world's largest economies, so Portuguese opens up travel, business, music, and culture for a huge and growing community.",
      "Largely regular spelling and Latin-derived cognates with English make reading approachable early — and Lector ships Brazilian Portuguese by default.",
    ],
    mutualIntelligibility:
      "Very closely related to Spanish — Portuguese speakers can often read and follow Spanish — and to Italian; it shares a large stock of Latin-derived cognates with English, so knowing one Romance language makes the others far easier.",
    difficultyNote:
      "FSI Category I (~600–750 hours), among the easiest languages for English speakers. Spelling is largely regular and there are many cognates; the nasal vowels (ão, õe), verb conjugations, and the distinctive personal infinitive are the main learning curve.",
    faqs: [
      {
        question: "Is Portuguese hard to learn?",
        answer:
          "Portuguese is one of the easier languages for English speakers. Spelling is mostly regular and there are many shared cognates; the main challenges are nasal vowels, verb conjugations, and the personal infinitive.",
      },
      {
        question: "How long does it take to learn Portuguese?",
        answer:
          "The US Foreign Service Institute places Portuguese in Category I — roughly 600–750 class hours (about 24–30 weeks of intensive study) to reach professional working proficiency. Reading consistently brings everyday comprehension much sooner.",
      },
      {
        question: "What is the best way to learn Portuguese?",
        answer:
          "Read authentic Portuguese daily, learn the most frequent words first, and reinforce them with spaced repetition. Because spelling is largely regular, reading real texts quickly builds vocabulary and pronunciation.",
      },
      {
        question: "Can I learn Portuguese for free?",
        answer:
          "Yes. Portuguese has abundant free material — public-domain books, open courses, podcasts, and free or self-hosted reading and flashcard tools — so no paid course is required.",
      },
    ],
    sample: {
      text: "No fim da tarde, a família se reúne na varanda para tomar café, conversar sobre o dia e ver as crianças brincarem no quintal.",
      translation:
        "In the late afternoon, the family gathers on the porch to drink coffee, talk about the day, and watch the children play in the backyard.",
    },
    readerImg: "/images/languages/portuguese-reader.png",
    readerAlt:
      "Lector reading a Portuguese passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/portuguese-cloze.png",
    clozeAlt: "Portuguese cloze practice in Lector with multiple-choice options",
  },

  russian: {
    slug: "russian",
    answer:
      "The best way to learn Russian is to read real Russian texts with instant tap-to-translate, learning the highest-frequency words first and locking them in with spaced repetition. Cyrillic takes a week or two; six noun cases and verb aspect are what reading a lot of Russian teaches you faster than any grammar table.",
    nativeSpeakers: "~145 million",
    totalSpeakers: "~210 million (incl. second-language)",
    fsiCategory: "Category III",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "Around 145 million native speakers and roughly 210 million in total — the most spoken native language in Europe, and one of the six official languages of the United Nations.",
      "Official or widely used from Belarus and Kazakhstan across Central Asia, with an enormous body of literature, film and scientific writing behind it.",
      "Cyrillic looks harder than it is: 33 letters, mostly regular, learned in a week or two. The alphabet is the small part.",
    ],
    mutualIntelligibility:
      "Ukrainian and Belarusian are close relatives, and Russian gives you a large head start on Bulgarian, Serbian and Polish vocabulary. The alphabet carries straight over to Ukrainian, Bulgarian, Serbian and Macedonian.",
    difficultyNote:
      "FSI Category III (~1,100 hours), a hard tier for English speakers. The alphabet is the easy part. The work is six noun cases, verb aspect pairs (говорить / сказать), and lexical stress that moves without warning — which is exactly what a lot of reading, with a dictionary one tap away, drills into place.",
    faqs: [
      {
        question: "Is Russian hard to learn?",
        answer:
          "Russian is genuinely challenging for English speakers, in the same tier as Polish and Turkish. Cyrillic takes a week or two and is not the obstacle. The real work is six noun cases, verb aspect, and stress that shifts between forms of the same word.",
      },
      {
        question: "How long does it take to learn Russian?",
        answer:
          "The US Foreign Service Institute places Russian in Category III, needing roughly 1,100 class hours (about 44 weeks of intensive study) to reach professional working proficiency. Reading daily brings recognition of common words and simple texts far sooner than that.",
      },
      {
        question: "What is the best way to learn Russian?",
        answer:
          "Learn the alphabet first, then read real Russian with lookups a tap away, prioritising the most frequent words and using spaced repetition to keep them. Cases and aspect are learned much faster from thousands of real examples than from paradigm tables.",
      },
      {
        question: "Can I learn Russian for free?",
        answer:
          "Yes. Russian has an enormous free corpus — public-domain literature, open courses, news and podcasts — plus free and self-hosted reading tools and spaced-repetition software, so no paid course is required.",
      },
    ],
    sample: {
      text: "Вечером, когда солнце садится за реку, люди выходят на улицу, чтобы поговорить и посмотреть, как дети играют во дворе.",
      translation:
        "In the evening, when the sun sets behind the river, people come out into the street to talk and watch the children playing in the yard.",
    },
    readerImg: "/images/languages/russian-reader.png",
    readerAlt:
      "Lector reading a Russian passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/russian-cloze.png",
    clozeAlt: "Russian cloze practice in Lector with multiple-choice options",
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

  turkish: {
    slug: "turkish",
    answer:
      "The best way to learn Turkish is to read real Turkish with instant tap-to-translate, because one Turkish word can stack four suffixes at once and reading is where you learn to see them. Learn the most frequent stems first, then let spaced repetition hold them.",
    nativeSpeakers: "~85 million",
    totalSpeakers: "~91 million (incl. second-language)",
    fsiCategory: "Category III",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "Around 85 million native speakers and about 91 million in total, official in Türkiye and Cyprus and spoken across the Balkans, Germany and Central Asia.",
      "Grammar with almost no irregularity: no grammatical gender, no articles, and endings that follow the same rules every time.",
      "A gateway to the wider Turkic family — Azerbaijani is largely mutually intelligible, and Turkmen, Uzbek and Kazakh share much of the structure.",
    ],
    mutualIntelligibility:
      "Largely mutually intelligible with Azerbaijani, and close enough to Turkmen, Gagauz and Crimean Tatar that they become far easier once you know Turkish.",
    difficultyNote:
      "FSI Category III (~1,100 hours). Almost nothing in Turkish is irregular, and that is the point: the difficulty is not exceptions, it is agglutination and vowel harmony. “evlerimizden” is one word meaning “from our houses”, and reading with an inflection-aware dictionary is where stacked suffixes stop looking like new vocabulary.",
    faqs: [
      {
        question: "Is Turkish hard to learn?",
        answer:
          "Turkish is challenging but unusually consistent. There is no grammatical gender, no articles, and hardly any irregularity. What takes practice is agglutination — words that stack plural, possessive and case endings together — and vowel harmony.",
      },
      {
        question: "How long does it take to learn Turkish?",
        answer:
          "The FSI places Turkish in Category III, at roughly 1,100 class hours (about 44 weeks of intensive study) to reach professional working proficiency. Because the rules are so regular, progress on simple texts often feels faster than that figure suggests.",
      },
      {
        question: "What is the best way to learn Turkish?",
        answer:
          "Read real Turkish with a dictionary that unstacks suffixes back to the stem, learn the most frequent stems first, and use spaced repetition to keep them. Seeing the same stem in a dozen suffixed shapes is what makes the pattern click.",
      },
      {
        question: "Can I learn Turkish for free?",
        answer:
          "Yes. Free resources are plentiful — public-domain texts, open courses, news and podcasts — and free or self-hosted reading and flashcard tools cover the rest, so you can reach a strong level without paying for lessons.",
      },
    ],
    sample: {
      text: "Akşam olunca komşular kapılarının önüne çıkar, çay içerek konuşur ve çocukların sokakta oynamasını izler.",
      translation:
        "When evening comes, the neighbours come out in front of their doors, talk over tea, and watch the children playing in the street.",
    },
    readerImg: "/images/languages/turkish-reader.png",
    readerAlt:
      "Lector reading a Turkish passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/turkish-cloze.png",
    clozeAlt: "Turkish cloze practice in Lector with multiple-choice options",
  },

  italian: {
    slug: "italian",
    answer:
      "The best way to learn Italian is to read real Italian texts with instant tap-to-translate, prioritising the most frequent vocabulary and reinforcing it with spaced repetition. Italian spelling is very nearly phonetic, so reading and pronunciation improve together.",
    nativeSpeakers: "~65 million",
    totalSpeakers: "~85 million (incl. second-language)",
    fsiCategory: "Category I",
    approxHours: "~600 hours",
    approxWeeks: 24,
    whyLearn: [
      "Around 65 million native speakers and up to 85 million in total, official in Italy, San Marino, Vatican City, and Swiss Ticino.",
      "Very nearly phonetic spelling — learn the rules once and you can pronounce a word you have only read, and spell a word you have only heard.",
      "The working language of a vast amount of art, music, opera, food and design, and the source of thousands of words English already borrowed.",
    ],
    mutualIntelligibility:
      "Closely related to Spanish, Portuguese and French, and often partly understandable to their speakers. Of the big Romance languages it stays closest to Latin, so Latin and the rest of the family get easier with it.",
    difficultyNote:
      "FSI Category I (~600 hours), one of the easiest tiers for English speakers. Spelling maps cleanly onto sound and a great deal of the vocabulary is recognisable. The learning curve is verb conjugation, the subjunctive, and gendered nouns with irregular plurals.",
    faqs: [
      {
        question: "Is Italian hard to learn?",
        answer:
          "Italian is one of the easier languages for English speakers. Spelling is almost perfectly regular and much of the vocabulary is familiar. The main challenges are verb conjugations, the subjunctive mood, and noun gender.",
      },
      {
        question: "How long does it take to learn Italian?",
        answer:
          "The FSI puts Italian in Category I, at about 600 class hours (roughly 24 weeks of intensive study) to reach professional working proficiency. Reading consistently brings everyday comprehension considerably sooner.",
      },
      {
        question: "What is the best way to learn Italian?",
        answer:
          "Read real Italian daily, learn the most frequent words first, and reinforce them with spaced repetition. Because spelling and sound line up, reading aloud what you see on screen builds pronunciation at the same time.",
      },
      {
        question: "Can I learn Italian for free?",
        answer:
          "Yes. Italian has a huge free corpus — public-domain literature, open courses, radio and podcasts — and free or self-hosted reading and flashcard tools, so a paid course is not required.",
      },
    ],
    sample: {
      text: "La sera, quando le campane suonano, la gente si ferma nella piazza per parlare e guardare i bambini che giocano davanti alla fontana.",
      translation:
        "In the evening, when the bells ring, people stop in the square to talk and watch the children playing in front of the fountain.",
    },
    readerImg: "/images/languages/italian-reader.png",
    readerAlt:
      "Lector reading an Italian passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/italian-cloze.png",
    clozeAlt: "Italian cloze practice in Lector with multiple-choice options",
  },

  polish: {
    slug: "polish",
    answer:
      "The best way to learn Polish is to read real Polish with instant tap-to-translate, because seven cases put one word into a dozen shapes and reading is where you learn to recognise them. Learn the most frequent words first, then keep them with spaced repetition.",
    nativeSpeakers: "~40 million",
    totalSpeakers: "~43 million (incl. second-language)",
    fsiCategory: "Category III",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "Around 40 million native speakers, official in Poland and the European Union, with large communities in the UK, Germany, the US and Canada.",
      "Poland is one of Europe's fastest-growing economies, which makes Polish unusually useful for its speaker count.",
      "Spelling is consistent once you know the digraphs (sz, cz, rz, dz), so an unfamiliar word is still pronounceable on sight.",
    ],
    mutualIntelligibility:
      "Partly mutually intelligible with Czech and Slovak, especially in writing, and it shares a great deal of vocabulary with Ukrainian and Russian. Polish is a strong entry point to the Slavic family.",
    difficultyNote:
      "FSI Category III (~1,100 hours), a hard tier for English speakers. Seven cases across three genders, verb aspect pairs, and consonant alternations that hide the stem: noga becomes nodze, miasto becomes mieście, pies becomes psowi. Reading with an inflection-aware dictionary is the shortcut, because you meet the forms in context instead of memorising tables.",
    faqs: [
      {
        question: "Is Polish hard to learn?",
        answer:
          "Polish is one of the harder European languages for English speakers, in the same FSI tier as Russian. Seven cases, three genders, verb aspect and consonant alternations are the work. Pronunciation is regular once the digraphs are learned.",
      },
      {
        question: "How long does it take to learn Polish?",
        answer:
          "The FSI places Polish in Category III, needing roughly 1,100 class hours (about 44 weeks of intensive study) to reach professional working proficiency. Recognising common words and reading simple texts comes much earlier with daily practice.",
      },
      {
        question: "What is the best way to learn Polish?",
        answer:
          "Read real Polish with a dictionary that resolves inflected forms back to the lemma, front-load the most frequent words, and use spaced repetition. Cases are absorbed from thousands of real examples far faster than from declension tables.",
      },
      {
        question: "Can I learn Polish for free?",
        answer:
          "Yes. Public-domain Polish literature, open courses, free news and podcasts, and free or self-hosted reading and flashcard tools make it entirely possible to learn Polish at no cost.",
      },
    ],
    sample: {
      text: "Wieczorem, kiedy słońce schodzi za dachy, dzieci wracają do domu, a w oknach zapalają się pierwsze lampy.",
      translation:
        "In the evening, when the sun goes down behind the roofs, the children come home, and the first lamps light up in the windows.",
    },
    readerImg: "/images/languages/polish-reader.png",
    readerAlt:
      "Lector reading a Polish passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/polish-cloze.png",
    clozeAlt: "Polish cloze practice in Lector with multiple-choice options",
  },

  ukrainian: {
    slug: "ukrainian",
    answer:
      "The best way to learn Ukrainian is to read real Ukrainian texts with instant tap-to-translate, learning the most frequent words first and holding them with spaced repetition. Ukrainian is its own language rather than a dialect of Russian, and it repays being learned as one.",
    nativeSpeakers: "~32 million",
    totalSpeakers: "~39 million (incl. second-language)",
    fsiCategory: "Category III",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "Around 32 million native speakers and roughly 39 million in total, the official language of Ukraine, with large communities in Poland, Germany, Canada and the US.",
      "Spelling is close to phonemic: Ukrainian is written much as it is said, so a word you have never met is still pronounceable the first time.",
      "Grammar and vocabulary overlap heavily with Polish, Belarusian and Russian, so Ukrainian opens the West and East Slavic families at once.",
    ],
    mutualIntelligibility:
      "Very close to Belarusian, and it shares a great deal with Polish and Russian. The false friends are real, though: так is “yes” in Ukrainian, not the Russian “like that”.",
    difficultyNote:
      "FSI Category III (~1,100 hours), the same tier as Russian and Polish. Seven cases, verb aspect and consonant alternations do the work. The alphabet takes a week or two and includes letters Russian does not have: ґ, є, і and ї.",
    faqs: [
      {
        question: "Is Ukrainian hard to learn?",
        answer:
          "Ukrainian is a hard language for English speakers, in the same FSI tier as Russian and Polish. Seven cases and verb aspect are the real work. Spelling is close to phonemic, so pronunciation is one of the easier parts.",
      },
      {
        question: "How long does it take to learn Ukrainian?",
        answer:
          "The FSI places Ukrainian in Category III, at roughly 1,100 class hours (about 44 weeks of intensive study) to reach professional working proficiency. Daily reading brings recognition of everyday vocabulary well before that.",
      },
      {
        question: "What is the best way to learn Ukrainian?",
        answer:
          "Learn the alphabet, then read real Ukrainian with lookups a tap away, prioritising the most frequent words and keeping them with spaced repetition. Use Ukrainian material and Ukrainian definitions rather than Russian ones — the two languages diverge in exactly the places that matter.",
      },
      {
        question: "Can I learn Ukrainian for free?",
        answer:
          "Yes. Ukrainian has a growing free corpus of literature, news, courses and podcasts, and free or self-hosted reading and flashcard tools cover the practice side, so no paid course is needed.",
      },
    ],
    sample: {
      text: "Увечері, коли сонце сідає за дахи, люди виходять на вулицю, щоб поговорити й подивитися, як діти грають у дворі.",
      translation:
        "In the evening, when the sun sets behind the roofs, people come out into the street to talk and watch the children playing in the yard.",
    },
    readerImg: "/images/languages/ukrainian-reader.png",
    readerAlt:
      "Lector reading a Ukrainian passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/ukrainian-cloze.png",
    clozeAlt: "Ukrainian cloze practice in Lector with multiple-choice options",
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

  czech: {
    slug: "czech",
    answer:
      "The best way to learn Czech is to read real Czech with instant tap-to-translate, learning the highest-frequency words first and keeping them with spaced repetition. Seven cases put one word into many shapes, and meeting those shapes in context is far faster than memorising the tables.",
    nativeSpeakers: "~10 million",
    totalSpeakers: "~12 million (incl. second-language)",
    fsiCategory: "Category III",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "Around 10 million native speakers, official in the Czech Republic and the European Union, in one of central Europe's most industrial and most visited countries.",
      "Near-complete mutual intelligibility with Slovak, so learning Czech effectively gives you a second country's language at almost no extra cost.",
      "Spelling is consistent and marks vowel length, so the written word tells you how to say it — the háček and the acute accent both do real work.",
    ],
    mutualIntelligibility:
      "Almost fully mutually intelligible with Slovak and partly with Polish, so Czech opens the West Slavic group. Its vocabulary overlap with Russian and Ukrainian is substantial too.",
    difficultyNote:
      "FSI Category III (~1,100 hours). Vowel length carries meaning, so byt (“a flat”) and být (“to be”) are two different words rather than a typo. Add seven cases, verb aspect pairs, and stem changes that defeat naive stemming — kůň becomes koňmi, pes becomes psovi — and the case for reading with a real dictionary makes itself.",
    faqs: [
      {
        question: "Is Czech hard to learn?",
        answer:
          "Czech is a hard language for English speakers, in the same FSI tier as Russian and Polish. Seven cases, three genders and verb aspect are the work, along with consonant clusters that look worse than they sound. Spelling, at least, is regular.",
      },
      {
        question: "How long does it take to learn Czech?",
        answer:
          "The FSI places Czech in Category III, at roughly 1,100 class hours (about 44 weeks of intensive study) to reach professional working proficiency. Reading simple texts with lookups comes a long way before that point.",
      },
      {
        question: "What is the best way to learn Czech?",
        answer:
          "Read real Czech with a dictionary that resolves declined and conjugated forms back to the lemma, learn the most frequent words first, and use spaced repetition to hold them. Pay attention to vowel length from the first day, because it changes meaning.",
      },
      {
        question: "Can I learn Czech for free?",
        answer:
          "Yes. Public-domain Czech literature, open courses, free news and podcasts, and free or self-hosted reading and flashcard tools make learning Czech at no cost entirely realistic.",
      },
    ],
    sample: {
      text: "V podvečer se lidé schází na náměstí, povídají si o práci a dívají se, jak si děti hrají u staré fontány.",
      translation:
        "In the early evening people gather in the square, talk about work, and watch the children playing by the old fountain.",
    },
    readerImg: "/images/languages/czech-reader.png",
    readerAlt:
      "Lector reading a Czech passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/czech-cloze.png",
    clozeAlt: "Czech cloze practice in Lector with multiple-choice options",
  },

  esperanto: {
    slug: "esperanto",
    answer:
      "The best way to learn Esperanto is to start reading it almost immediately, because the grammar has no exceptions and the word-building is systematic: learn about a thousand roots and the affixes generate the rest. Tap-to-translate and spaced repetition get you there in months rather than years.",
    nativeSpeakers: "~1,000 (raised bilingually)",
    totalSpeakers: "estimates from 100,000 to 2 million",
    fsiCategory: "Not FSI rated",
    approxHours: "~200 hours",
    approxWeeks: 8,
    whyLearn: [
      "Built to be learnable: no irregular verbs, no grammatical gender, one plural ending, and stress always on the second-to-last syllable.",
      "Systematic word-building means vocabulary compounds instead of multiplying — sana is “healthy”, malsana “ill”, malsanulo “a patient”, malsanulejo “a hospital”.",
      "A worldwide community far out of proportion to its size, with meetings on every continent, a hosting network for travellers, and a large body of original and translated literature.",
    ],
    mutualIntelligibility:
      "Not mutually intelligible with any national language, but the roots are mostly Romance and Germanic, so an English speaker recognises a surprising amount of the vocabulary on sight.",
    difficultyNote:
      "The FSI does not rate Esperanto, because it teaches diplomats national languages. Claude Piron put mastery at roughly 180 to 220 hours, and Esperanto is widely reported as several times faster to learn than any national language, because there are no exceptions to memorise. Lector's lookups understand the word-building (malsanulejo → mal- + san- + -ul- + -ej-) and accept x-system typing, so gxardeno finds ĝardeno.",
    faqs: [
      {
        question: "Is Esperanto hard to learn?",
        answer:
          "No — it is the easiest language on this list by a wide margin. It was designed to be regular: no irregular verbs, no grammatical gender, one plural ending, predictable stress, and one letter for each sound.",
      },
      {
        question: "How long does it take to learn Esperanto?",
        answer:
          "The FSI does not rate Esperanto, so there is no official figure. Claude Piron's estimate of roughly 180 to 220 hours to mastery is the most-cited one, and most learners can read simple Esperanto after a few weeks of daily practice.",
      },
      {
        question: "What is the best way to learn Esperanto?",
        answer:
          "Learn the affix system early, then read as much as you can. Because malsanulejo is built out of parts you already know, most new vocabulary is recognised rather than memorised. Frequency-ordered practice and spaced repetition cover the roots.",
      },
      {
        question: "Can I learn Esperanto for free?",
        answer:
          "Yes, and more easily than for most languages. The community publishes its courses, dictionaries and literature freely, and free or self-hosted reading and flashcard tools cover the rest.",
      },
    ],
    sample: {
      text: "Vespere, kiam la suno malaperas malantaŭ la montoj, la homoj sidas antaŭ siaj domoj kaj rigardas la infanojn ludantajn sur la strato.",
      translation:
        "In the evening, when the sun disappears behind the mountains, people sit in front of their houses and watch the children playing in the street.",
    },
    readerImg: "/images/languages/esperanto-reader.png",
    readerAlt:
      "Lector reading an Esperanto passage with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/esperanto-cloze.png",
    clozeAlt: "Esperanto cloze practice in Lector with multiple-choice options",
  },

  "koine-greek": {
    slug: "koine-greek",
    answer:
      "The best way to learn Koine Greek is to read the Greek New Testament itself, with instant tap-to-translate and frequency-ordered practice. The 300 most frequent lemmas cover about 80% of the running text, so real verses come within reach early. This is a reading language, so reading is the whole method.",
    nativeSpeakers: "None — a historical language",
    totalSpeakers: "Studied worldwide; still liturgical in the Orthodox churches",
    fsiCategory: "Not FSI rated",
    approxHours: "~1,100 hours",
    approxWeeks: 44,
    whyLearn: [
      "It is the language of the New Testament and the Septuagint. Reading them in Koine takes the translator out from between you and the text.",
      "A closed, finite target: the Greek New Testament runs to about 138,000 words over roughly 5,400 distinct lemmas, and the top 300 of those cover about 80% of the running text. Few languages define the job this clearly.",
      "Koine is the bridge between Classical and Modern Greek, so it opens Homer and Plato in one direction and modern Athens in the other.",
    ],
    mutualIntelligibility:
      "Koine grew out of Attic Greek and became Medieval and then Modern Greek, so Classical texts and modern Greek both become far more approachable. Its roots also sit under a large share of English scientific and technical vocabulary.",
    difficultyNote:
      "The FSI does not rate Koine, because it does not teach historical languages. Modern Greek sits in Category III (~1,100 hours), which is a fair marker for the grammar: three genders, four cases, and a verb system with aspects and moods that English has no direct equivalent for. The goal is different, though. You are learning to read rather than to speak, and reading a closed corpus with a dictionary one tap away is a much shorter road than conversational fluency.",
    faqs: [
      {
        question: "Is Koine Greek hard to learn?",
        answer:
          "The grammar is demanding — three genders, four cases, and a verb system with aspects and moods English lacks. The target is narrow, though: you are learning to read a finite corpus, not to hold a conversation, which makes it far more tractable than a modern language of the same grammatical weight.",
      },
      {
        question: "How long does it take to learn Koine Greek?",
        answer:
          "There is no FSI figure, because the FSI does not teach historical languages. Modern Greek's ~1,100 hours is a reasonable marker for the grammar. Reading-only is a shorter road: the 300 most frequent New Testament lemmas cover about 80% of the running text, so simple verses become readable within months.",
      },
      {
        question: "What is the best way to learn Koine Greek?",
        answer:
          "Read the Greek New Testament from the start, with lookups that forgive accent variance and practice that is ordered by frequency over the Greek NT itself. Learning the highest-frequency lemmas first buys the most text for the least effort.",
      },
      {
        question: "Does Lector read Koine Greek aloud?",
        answer:
          "No, and that is deliberate. Koine pronunciation is reconstructed and genuinely disputed, so Lector stays silent rather than teaching you a guess. Every other feature — lookups, cloze practice, mining to Anki — works as it does for any other language.",
      },
    ],
    sample: {
      text: "Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.",
      translation:
        "In the beginning was the Word, and the Word was with God, and the Word was God. (John 1:1)",
    },
    readerImg: "/images/languages/koine-greek-reader.png",
    readerAlt:
      "Lector reading a Koine Greek verse with colour-coded word states and click-to-translate",
    clozeImg: "/images/languages/koine-greek-cloze.png",
    clozeAlt:
      "Koine Greek cloze practice in Lector with multiple-choice options and the verse reference kept",
  },
};
