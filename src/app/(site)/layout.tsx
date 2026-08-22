import { SiteChrome } from "@/components/templates/SiteChrome";

/** The marketing site's chrome (§8.25-z).
 *
 *  A route group, so no URL changes: `(site)` is not a path segment. It exists
 *  because this app now serves two kinds of page, and only one of them wants a
 *  navbar, a footer, a mascot and an Organization graph. The store wants none of
 *  those, and inheriting them put a dead `#reserve` CTA on the checkout.
 *
 *  Everything shared by BOTH kinds stays in the root layout: the html element,
 *  the fonts, the analytics tags. Nothing here is duplicated there. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
