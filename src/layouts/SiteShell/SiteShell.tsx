import type { ReactNode } from "react";
import { Footer } from "@/components/chrome/Footer/Footer";
import { NavBar } from "@/components/chrome/NavBar/NavBar";
import { NavDrawer } from "@/components/chrome/NavDrawer/NavDrawer";
import { SkipLink } from "@/components/chrome/SkipLink/SkipLink";
import { StickyBuyBar } from "@/components/chrome/StickyBuyBar/StickyBuyBar";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { MotionController } from "@/components/ui/MotionController/MotionController.client";
import { offerWords } from "@/components/ui/PriceSentence/PriceSentence";
import { RichText } from "@/components/ui/RichText/RichText";
import { cta } from "@/content/en-IN/cta";
import { navigation } from "@/content/en-IN/navigation";
import { organization } from "@/content/en-IN/organization";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, trustItems } from "@/content/en-IN/trust";
import type { Offer, SitePath } from "@/content/types";
import { jsonLd } from "@/lib/seo/jsonld";
import { siteGraphOf } from "./site-graph";

/** The site's home, where both logos link. */
const HOME: SitePath = "/";
/** The drawer dialog's id, which the menu button's `aria-controls` names. */
const DRAWER_ID = "menu";

/** The drawer's second note: the compact trust line beside every CTA (when deliveries start, the returns promise),
 *  as one line, as partials/drawer.html prints it. */
function drawerNote(offer: Offer): string {
  return offerWords(TRUST_COMPACT.map((id) => trustItems[id].label).join(" · "), offer, "SiteShell drawer note");
}

export interface SiteShellProps {
  /** The page. */
  children: ReactNode;
  /** The live offer, for the drawer's price sentence and the buy bar's lines. */
  offer: Offer;
  /** The paths that carry the phone buy bar (sticky-bar-paths.ts); none on the 404 (partials/buybar.html, meta). */
  stickyBar?: readonly string[];
}

/**
 * The marketing site's shell (architecture §5.1; structure §3.1, §5): the chrome every marketing page and the 404 share,
 * in the approved mockup's order (mockup/build.mjs): the skip link, the nav, the page in `<main id="main">`, the footer,
 * the phone buy bar (on its pages only), the menu drawer; then the WhatsApp bubble with the site's text (D050). It also
 * mounts, once per page, the shared chalk filter of the drawn doodles (`DoodleDefs`, before any doodle), the motion
 * observer (`MotionController`, D049 picks 1 and 3) and the Organization and WebSite JSON-LD (architecture §9.2).
 * Every word, link and price comes from content; `body.ks-has-float` (the bubble's clearance) is the root layout's.
 */
export function SiteShell({ children, offer, stickyBar = [] }: SiteShellProps) {
  const { labels, main, footer } = navigation;
  return (
    <>
      <SkipLink label={labels.skip} />
      <DoodleDefs />
      <NavBar
        label={labels.nav}
        logo={{ alt: labels.logoHome, href: HOME }}
        links={main}
        ctaLabel={cta.preorder}
        menu={{ label: labels.menu, controls: DRAWER_ID }}
      />
      <main id="main">{children}</main>
      <Footer
        logoAlt={labels.logo}
        promise={footer.promise}
        made={footer.made}
        columns={footer.columns}
        seller={{
          entity: <RichText text={seller.copyright} />,
          gstin: `GSTIN ${seller.gstin}`,
          address: seller.addressLine,
          contact: <RichText text={seller.support.line} />,
        }}
        grievance={footer.grievance}
      />
      {stickyBar.length > 0 && <StickyBuyBar offer={offer} label={cta.preorder} paths={stickyBar} />}
      <NavDrawer
        id={DRAWER_ID}
        label={labels.drawer}
        navLabel={labels.nav}
        logo={{ alt: labels.logoHome, href: HOME }}
        closeLabel={labels.closeMenu}
        links={main}
        ctaLabel={cta.preorder}
        offer={offer}
        note={drawerNote(offer)}
      />
      <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="site" />
      <MotionController />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraphOf(organization)) }} />
    </>
  );
}
