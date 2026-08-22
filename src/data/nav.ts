// Single source of truth for the site's primary subpages. Drives the global
// footer nav (layouts/Base.astro) and the homepage hero nav (pages/index.astro)
// so the two can't drift out of sync — add a top-level page here once and the
// navs pick it up. Home, GitHub and Sponsor are rendered alongside this list
// (Home is the logo/breadcrumb target; the latter two are external links).

export interface NavLink {
  href: string;
  label: string;
}

export const SITE_PAGES: NavLink[] = [
  { href: "/docs/", label: "Docs" },
  { href: "/languages/", label: "Languages" },
  { href: "/vs/", label: "Compare" },
  { href: "/for/greek-hebrew/", label: "Greek & Hebrew" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/blog/", label: "Blog" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/reference-data/", label: "Reference Data" },
  { href: "/funding/", label: "Funding" },
];
