import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// /learn/ pillar + cluster articles. Prose lives in Markdown under
// src/content/learn/<slug>.md; frontmatter carries the metadata + FAQs.
const learn = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learn" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    oneLiner: z.string(),
    kind: z.enum(["pillar", "cluster"]),
    /** Sort order within the /learn/ index (pillar first). */
    order: z.number().default(0),
    /** Short summary for the index cards + "keep reading" links. */
    blurb: z.string(),
    keywords: z.array(z.string()),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
});

export const collections = { learn };
