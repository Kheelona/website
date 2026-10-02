import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { StickyReserveBar } from "@/components/organisms/StickyReserveBar";
import { siteEntityGraph, jsonLd } from "@/lib/seo";
import { SHIP_DATE_ISO } from "@/config/site";

/* The entity graph moved to lib/seo.ts in the V3 SEO pass: every marketing page
   emits the same Organization and WebSite nodes by @id, so an answer engine
   builds ONE picture of the company (with the founders' credentials, our
   strongest E-E-A-T signal) instead of a thin island per page. */
const ORG_JSON_LD = siteEntityGraph();

/* "20 Oct", derived so it can never disagree with SHIP_DATE_TEXT. */
const SHIP_SHORT = new Date(`${SHIP_DATE_ISO}T00:00:00Z`).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Everything that makes a page part of the marketing site (§8.25-z).
 *
 *  Two consumers, which is why this is a component and not just a route
 *  group's layout: `(site)/layout.tsx` wraps every marketing route, and the
 *  root `not-found.tsx` wraps itself. The store has its own chrome.
 *
 *  Redesign 2026-10: the backdrop sky, the mascot guide and the scroll-reveal
 *  observer are gone; the mobile reserve bar replaces the guide's dock. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ORG_JSON_LD) }}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <StickyReserveBar shipShort={SHIP_SHORT} />
    </>
  );
}
