import type { ReactNode } from "react";
import { SiteShell } from "@/layouts/SiteShell/SiteShell";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { getOffer } from "@/lib/offer/get-offer";

/** The drawer's price sentence and the buy bar's lines show on every marketing page, so every marketing page follows
 *  the live mode like a page that shows a price (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because
 *  Next reads it statically). */
export const revalidate = 300;

/**
 * The marketing site's layout (structure §3.1). A route group, so no URL changes: `(site)` is not a path segment. It
 * wraps every marketing page in the site shell (chrome, the WhatsApp bubble, the motion observer, the doodles' filter,
 * the Organization and WebSite JSON-LD) with the live offer and the paths that carry the phone buy bar. The root
 * not-found page sits outside the group and renders the shell itself, with no bar.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const offer = await getOffer();
  return (
    <SiteShell offer={offer} stickyBar={stickyBarPaths()}>
      {children}
    </SiteShell>
  );
}
