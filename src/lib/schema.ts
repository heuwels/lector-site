// JSON-LD builders for page-specific structured data. Pass the result to
// <Base schema={...}> — Organization + WebSite are emitted sitewide by Base.
// Keeping these as plain builders means pages stay declarative and the shapes
// are validated in one place (Google Rich Results / schema.org).

import { APP_URL } from "../data/links";

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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Self-host free; Lector Cloud from $5/mo.",
    },
  };
}
