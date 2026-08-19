// Topics on the contact form. Keep the `value` keys in sync with TOPICS in
// functions/api/contact.ts.

export const CONTACT_TOPICS = [
  { value: "product", label: "The product" },
  { value: "billing", label: "Cloud account or billing" },
  { value: "self-hosting", label: "Self-hosted install" },
  { value: "language", label: "Language pack" },
  { value: "other", label: "Other" },
] as const;
