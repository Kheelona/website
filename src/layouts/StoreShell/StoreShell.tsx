import type { ReactNode } from "react";
import { SkipLink } from "@/components/chrome/SkipLink/SkipLink";
import { StoreFooter } from "@/components/chrome/StoreFooter/StoreFooter";
import { StoreHeader } from "@/components/chrome/StoreHeader/StoreHeader";
import { MotionController } from "@/components/ui/MotionController/MotionController.client";
import { RichText } from "@/components/ui/RichText/RichText";
import { MARKETING_ORIGIN } from "@/config/env";
import { navigation } from "@/content/en-IN/navigation";
import { seller } from "@/content/en-IN/seller";

/**
 * Two lines of the approved store copy that no content module holds yet (wiki/site/pages/store.md fold 0: the logo
 * link's name; folds 1, 3 and 7: the note every store link that opens a new tab reads to screen readers). No task owns
 * moving them (5.15 owns the store page, not this shell), so they are reported to the main session for the wave-3
 * close (task 3.1 review, SCA 5): once content holds them (for example `navigation.labels.storeLogoLink` and
 * `navigation.labels.newTabNote`), StoreShell reads them from there and this constant goes. The "GSTIN " lead of the
 * seller line, typed here and in SiteShell, waits for the same content change.
 */
const STORE_COPY_PENDING_CONTENT = {
  logoLink: "Kheelona home",
  newTabNote: " (opens in a new tab)",
} as const;

/**
 * The store host's shell (architecture §16.1; structure §3.1), rendered by src/app/store/layout.tsx around the store
 * page, /thanks, the event and partner pages and the store's not-found page: the skip link, the store header (whose store
 * this is, and a person to reach), the page in `<main id="main">`, and the store footer (the policy links on the
 * marketing site of this build, `MARKETING_ORIGIN`, so beta links to beta; the seller, the grievance officer and the
 * copyright), as mockup/store.html composes them; then the motion observer (`MotionController`, D049 pick 1A: the store
 * page reveals its films, store.html:134; it renders nothing and moves nothing with reduced motion). No site navigation
 * and no buy bar, by design; each store page renders its own WhatsApp bubble with its own text (D050: a layout cannot
 * know its page). `body.ks-has-float` is the root layout's.
 *
 * Held back from the footer: the payments line with its chargeback link (store.md fold 7, D042). The store layout's
 * rendered contract (test/guards/fixtures/checkout-contract/store-layout.json, never edited) lists exactly five policy
 * links, and refund#chargeback would be a sixth; reported to the main session. `StoreFooter` takes it as `payments`.
 */
export function StoreShell({ children }: { children: ReactNode }) {
  const { labels } = navigation;
  return (
    <>
      <SkipLink label={labels.skip} />
      <StoreHeader
        logo={{ alt: labels.logo, href: MARKETING_ORIGIN, linkLabel: STORE_COPY_PENDING_CONTENT.logoLink }}
        help={{ lead: seller.storeHelp.lead, contact: <RichText text={seller.storeHelp.contact} /> }}
      />
      <main id="main">{children}</main>
      <StoreFooter
        policies={{
          label: labels.policies,
          newTabNote: STORE_COPY_PENDING_CONTENT.newTabNote,
          links: navigation.policies.map((link) => ({ label: link.label, href: `${MARKETING_ORIGIN}${link.href}` })),
        }}
        seller={{
          entity: seller.legalName,
          gstin: `GSTIN ${seller.gstin}`,
          address: seller.addressLine,
          contact: <RichText text={seller.support.line} />,
        }}
        grievance={
          <>
            <RichText text={seller.grievance.line.lead} /> <RichText text={seller.grievance.line.text} />
          </>
        }
        copyright={<RichText text={seller.copyright} />}
      />
      <MotionController />
    </>
  );
}
