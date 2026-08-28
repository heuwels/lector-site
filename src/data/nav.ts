// The header links, and only the header links. Navbar.astro renders this list
// twice, for the desktop row and for the mobile menu.
//
// KEEP THIS LIST AT FIVE. The desktop row has no overflow behaviour, and it
// shares the header with two icons, "Log in", and the signup button. Nine links
// touched the icons at 1280px, which is why the list is short now.
//
// A new top-level page does NOT belong here by default. Put it in a group in
// components/Footer.astro, which carries every top-level page, and link it from
// the pages it serves. /use-cases/ exists so an audience page can be added
// without a header slot.
//
// If a page genuinely earns a header slot, take one away, then screenshot the
// header at 1024px and 1280px before you commit.

export interface NavLink {
  href: string;
  label: string;
}

export const SITE_PAGES: NavLink[] = [
  { href: "/docs/", label: "Docs" },
  { href: "/languages/", label: "Languages" },
  { href: "/use-cases/", label: "Use cases" },
  { href: "/vs/", label: "Compare" },
  { href: "/pricing/", label: "Pricing" },
];
