// Product Hunt launch. The badge renders only when `postId` holds a number, so
// the site stays exactly as it is today until the listing is live.
//
// On launch day: open the launch page → "Get badge" (or the embed snippet under
// the launch), then copy the numeric `post_id` and the URL slug in here. The
// slug is the last segment of the launch URL, not the display name.
export const PRODUCT_HUNT = {
  postId: null as number | null,
  slug: "lector",
  /**
   * `featured` is the plain "Find us on Product Hunt" badge, valid before and
   * after the day. `top-post-badge` renders the day's rank, and is only
   * meaningful once the launch places.
   */
  badge: "featured" as "featured" | "top-post-badge",
  /** Product Hunt renders its own theme, independent of the site's dark mode. */
  theme: "light" as "light" | "dark" | "neutral",
};

/** The launch page, with the attribution parameters Product Hunt expects. */
export function productHuntUrl(): string {
  const params = new URLSearchParams({
    utm_source: `badge-${PRODUCT_HUNT.badge}`,
    utm_medium: "badge",
    utm_campaign: "badge",
  });
  return `https://www.producthunt.com/posts/${PRODUCT_HUNT.slug}?${params}`;
}

/** The badge image, served by Product Hunt so the vote count stays current. */
export function productHuntBadgeUrl(): string {
  const params = new URLSearchParams({
    post_id: String(PRODUCT_HUNT.postId),
    theme: PRODUCT_HUNT.theme,
  });
  return `https://api.producthunt.com/widgets/embed-image/v1/${PRODUCT_HUNT.badge}.svg?${params}`;
}
