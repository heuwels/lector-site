// JSON-LD builders for page-specific structured data. Pass the result to
// <Base schema={...}> — Organization + WebSite are emitted sitewide by Base.
// Keeping these as plain builders means pages stay declarative and the shapes
// are validated in one place (Google Rich Results / schema.org).

import { APP_URL, SUPPORT_EMAIL } from "../data/links";

const SITE = "https://lector.dev";

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage — rich results + easy extraction by answer engines. */
export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList — clarifies site hierarchy for search + AI. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE}${it.url}`,
    })),
  };
}

/** Course — a free, self-paced, online way to learn a language with Lector. */
export function courseSchema(opts: {
  name: string;
  description: string;
  url: string;
  weeks: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE}${opts.url}`,
    provider: { "@type": "Organization", name: "Lector", url: SITE },
    offers: {
      "@type": "Offer",
      category: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `P${opts.weeks}W`,
    },
  };
}

/** ContactPage — the public enquiry form at /contact/. */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Lector",
    url: `${SITE}/contact/`,
    mainEntity: {
      "@type": "Organization",
      name: "Lector",
      email: SUPPORT_EMAIL,
      url: SITE,
    },
  };
}

/** SoftwareApplication — for the homepage; describes Lector itself. */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lector",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, Docker",
    url: SITE,
    downloadUrl: APP_URL,
    description:
      "A self-hosted reader for language learners, with LingQ-style reading, Clozemaster-style cloze practice, and AnkiConnect integration. You keep your books and your data.",
    applicationSubCategory: "Language learning",
    featureList: [
      "Click-to-translate reading for EPUB, articles, YouTube captions, and podcasts",
      "Frequency-ordered cloze practice with spaced repetition",
      "Two-way Anki sync",
      "On-device dictionary plus optional local or cloud LLM",
      "Self-host with Docker, or Lector Cloud from $5/mo",
    ],
    screenshot: `${SITE}/images/reader.png`,
    softwareLicense: "https://www.gnu.org/licenses/agpl-3.0.html",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Self-host free; Lector Cloud from $5/mo.",
    },
  };
}

/** Dataset — for free, downloadable reference resources (decks, frequency lists). */
export function datasetSchema(opts: {
  name: string;
  description: string;
  url: string;
  contentUrl: string;
  encodingFormat: string;
  /** License URL, e.g. https://creativecommons.org/licenses/by-sa/4.0/. */
  license: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE}${opts.url}`,
    license: opts.license,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Lector", url: SITE },
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
    distribution: {
      "@type": "DataDownload",
      encodingFormat: opts.encodingFormat,
      contentUrl: opts.contentUrl.startsWith("http")
        ? opts.contentUrl
        : `${SITE}${opts.contentUrl}`,
    },
  };
}

/** Article — for the /learn/ pillar + cluster educational pages. */
export function articleSchema(opts: {
  headline: string;
  description: string;
  url: string;
  keywords?: string[];
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE}${opts.url}`,
    author: { "@type": "Organization", name: "Lector", url: SITE },
    publisher: { "@type": "Organization", name: "Lector", url: SITE },
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.keywords ? { keywords: opts.keywords.join(", ") } : {}),
  };
}
