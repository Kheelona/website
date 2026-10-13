import type { Metadata } from "next";
import { storeEnv } from "@/lib/store/env";
import { sign } from "@/lib/store/signing";
import { resolveTier } from "@/lib/store/tiers";
import { formatInr, LAUNCH_AMOUNT_PAISE } from "@/config/site";
import { HOSTS } from "@/config/env";
import type { StorePanelCopy } from "@/content/en-IN/store/event-page";
import { partnerPage } from "@/content/en-IN/store/partner-page";
import { pageMeta } from "@/lib/seo/metadata";
import { NotFoundPanel } from "../_components/NotFoundPanel";
import { StoreClose, TierCheckout } from "../_components/TierCheckout";

/** The Ideabaaz Startup Fest page (§8.25-g, public-partner form).
 *
 *  ⚑ CLOSED SINCE 31 AUGUST 2026 (founder, 2026-09-01). The tier's `expires_on`
 *  has passed, so `resolveTier` returns nothing and every visit now renders the
 *  ended state below: "the Ideabaaz exclusive has ended", with a link to the
 *  usual price. That is the whole of the closure, and it needed no code change
 *  to happen, which was the point of dating the tier in the first place.
 *
 *  THE ROUTE STAYS, deliberately. Printed QR codes from the fest point here and
 *  cannot be recalled, and an honest ended page is a better answer to a late
 *  scan than a 404. The live-price branch below is therefore unreachable for
 *  this tier and is kept only because the same shape serves any future event
 *  page; the generic machinery it rides on is covered by tiers.test.ts.
 *
 *  The `event_tiers` row itself is untouched: production data is the founder's,
 *  and expiry already does the job. Deactivating the row is optional belt and
 *  braces, not a requirement.
 *
 *  A QR at a stall carries its signature in the URL; a partner page IS the
 *  link, so it signs its own tier here on the server and hands the signature
 *  to the form. That is a deliberate downgrade the founder chose with eyes
 *  open (2026-08-23): the page is exactly as public as a QR photographed into
 *  a group chat, which the event model already tolerates, and what contains it
 *  is the same pair as ever, the tier's expiry (31 August 2026) plus the
 *  founder's manual close, inside the global 500-unit count. The URL is shared
 *  by hand at the fest and referenced nowhere on the site; the store host is
 *  noindex besides.
 *
 *  Everything priced still happens server-side: `create-order` re-resolves the
 *  tier and reads the amount from `event_tiers`, so this page can only ever
 *  change sentences, never charges (§8.25-c-i).
 *
 *  RESTYLED IN TASK 6.1 (ADR-013: markup, classes, copy and presentation imports
 *  only; architecture §16.1). No mockup: the ended and not-configured states in
 *  the store's panel (NotFoundPanel), the live branch in the store's folds
 *  (TierCheckout, the tier's price name in the first screen's heading), each
 *  under the fest's lockup (B29) and closed as every store page is. The words are
 *  src/content/en-IN/store/partner-page.ts; the logic above every return is the
 *  tag's. */
export const dynamic = "force-dynamic";

/** Title, description and share card through pageMeta; the canonical and og:url
 *  on the production store in every environment, as the store page's (a beta
 *  page never canonicalises to itself). No robots: the store layout's noindex
 *  stands. */
const url = `https://${HOSTS.production.store}/ideabaaz`;
const { title, description, openGraph, twitter } = pageMeta({ ...partnerPage.meta, path: "/ideabaaz" });

export const metadata: Metadata = { title, description, alternates: { canonical: url }, openGraph: { ...openGraph, url }, twitter };

const IDEABAAZ_TIER = "ideabaaz";

export default async function IdeabaazPage() {
  const env = storeEnv();
  if (!env) {
    return <Ended copy={partnerPage.notConfigured} cta={false} />;
  }

  const sig = sign(env.signingSecret, "event-link", IDEABAAZ_TIER);
  const result = await resolveTier(env, { tier: IDEABAAZ_TIER, signature: sig });

  if (!result.ok) {
    return (
      <Ended
        message={
          result.reason === "full"
            ? partnerPage.ended.full
            : partnerPage.ended.closed
        }
      />
    );
  }

  const amountLabel = formatInr(result.tier.amountPaise);
  /* What the ₹4,999 price still needs after this token: a ₹99 booking honestly
     reads ₹4,900, never the public ₹4,500. */
  const balanceLabel = formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - result.tier.amountPaise));

  /* Always the token shape, whatever the public mode is: an event token is a
     token, with the same balance-before-dispatch terms (TierCheckout). */
  return (
    <TierCheckout
      tier={result.tier}
      signature={sig}
      amountLabel={amountLabel}
      balanceLabel={balanceLabel}
      content={partnerPage.checkout}
      mark={<PartnerChip />}
    />
  );
}

/** The fest lockup as it appears on the launch posts: white lettering on its
 *  own black plate, so the plate is the chip. Never recolored (partner mark). A
 *  plain image of the live file (assets.md), its box reserved at the file's own
 *  size and drawn at the DS logo class's auto width and a DS space's height
 *  (`h-7`, space-7; architecture §4.2: an app-private component has no
 *  stylesheet). */
function PartnerChip() {
  const { logo } = partnerPage;
  // A partner's raster at its stable public URL, as on the printed material; not a DS asset, so no media primitive.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="kh-logo h-7" src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />;
}

/** Every not-for-sale state of this page: tier expired or closed by hand,
 *  allocation gone, or a deployment without store keys. Honest words plus the
 *  ways forward, in the store's panel under the lockup, exactly like the
 *  signed event page's refusal. */
function Ended({
  copy = partnerPage.ended,
  message,
  cta = true,
}: {
  copy?: StorePanelCopy;
  message?: string;
  cta?: boolean;
}) {
  return (
    <>
      <NotFoundPanel copy={copy} body={message} cta={cta} mark={<PartnerChip />} />
      <StoreClose />
    </>
  );
}
