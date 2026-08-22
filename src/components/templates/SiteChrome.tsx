import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { RevealObserver } from "@/components/molecules/RevealObserver";
import { SiteBackdrop } from "@/components/atoms/SiteBackdrop";
import { KheeluGuide } from "@/components/organisms/KheeluGuide";
import { graph } from "@/lib/seo";

/* The entity graph moved to lib/seo.ts in the V3 SEO pass: every marketing page
   emits the same Organization and WebSite nodes by @id, so an answer engine
   builds ONE picture of the company (with the founders' credentials, our
   strongest E-E-A-T signal) instead of a thin island per page. */
const ORG_JSON_LD = graph();

/** Everything that makes a page part of the marketing site (§8.25-z).
 *
 *  Extracted from the root layout on 2026-08-22, when the store gave this app a
 *  SECOND kind of page. Before the extraction the store inherited all of it and
 *  the result was visibly wrong in one screenshot: two headers stacked, two
 *  footers, the guide floating over a payment form, and a navbar CTA pointing at
 *  `#reserve`, an anchor the store had no page for. A dead CTA on the one page
 *  that takes money.
 *
 *  Two consumers, which is why this is a component and not just a route group's
 *  layout: `(site)/layout.tsx` wraps every marketing route, and the root
 *  `not-found.tsx` wraps itself, because a not-found file at the root sits
 *  OUTSIDE the route group and would otherwise render with no chrome at all. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      {/* Revamp M1: one warm CSS sky behind every route (theme B) */}
      <SiteBackdrop />
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Revamp M1: the persistent narrator; its mobile dock ABSORBS the old
          StickyMobileCTA (same hide-at-#reserve contract) */}
      <KheeluGuide />
      <RevealObserver />
    </>
  );
}
