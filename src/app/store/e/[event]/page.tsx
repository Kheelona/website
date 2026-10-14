import type { Metadata } from "next";
import { storeEnv } from "@/lib/store/env";
import { resolveTier } from "@/lib/store/tiers";
import { formatInr, LAUNCH_AMOUNT_PAISE } from "@/config/site";
import { eventPage, type StorePanelCopy } from "@/content/en-IN/store/event-page";
import { pageMeta } from "@/lib/seo/metadata";
import { NotFoundPanel } from "../../_components/NotFoundPanel";
import { StoreNotConfigured } from "../../_components/StoreNotConfigured";
import { StoreClose, TierCheckout } from "../../_components/TierCheckout";

/** Event pricing, behind a signed link (§8.25-g).
 *
 *  What a QR code at a stall points at. The signature stops anyone minting a
 *  cheap link by guessing a slug; the cap and the expiry in `event_tiers` are
 *  what contain the leak a signature cannot prevent, because a printed QR code
 *  can be photographed and forwarded to a group chat. The honest security model
 *  is: unguessable, and worthless once the event is over or the allocation is
 *  gone.
 *
 *  The price is read from the database on the server, here and again inside
 *  create-order. The URL carries which event, never how much.
 *
 *  RESTYLED IN TASK 6.1 (ADR-013: markup, classes, copy and presentation imports
 *  only; architecture §16.1). No mockup: the store page's folds around the same
 *  checkout (TierCheckout: StoreTop, StoreDetails, the store's questions), the
 *  tier's own price name in the first screen's heading, and every refusal in the
 *  store's panel (NotFoundPanel), each closing as the store does. The words are
 *  src/content/en-IN/store/event-page.ts; the logic above every return is the
 *  tag's.
 *
 *  TASK 7.1c (CMO review C m1, m3): a refused link's body is the copy page's for
 *  its reason (store.md, "Event link refused"), printed in place of the frozen
 *  tiers.ts words, which name the token amount with no total and say "on this
 *  page" of a button that leaves for the store; and a store without keys is the
 *  store page's own state (StoreNotConfigured: its WhatsApp button, its note,
 *  the bubble, no payments line). */
export const dynamic = "force-dynamic";

/** Title, description and share card through pageMeta, with no amount (the link
 *  sets its own price). No robots: the store layout's noindex stands. No canonical
 *  and no og:url: the signed link itself is the page's address, and a preview
 *  that pointed elsewhere would drop the tier and its signature. */
const { title, description, openGraph, twitter } = pageMeta({ ...eventPage.meta, path: "/" });

export const metadata: Metadata = { title, description, openGraph: { ...openGraph, url: undefined }, twitter };

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ event: string }>;
  searchParams: Promise<{ sig?: string }>;
}) {
  const [{ event }, { sig }] = await Promise.all([params, searchParams]);
  const env = storeEnv();
  /* Renders rather than throws, for the same reason as everywhere else on this
     host (§8.34-a): a thrown 404 answers with an empty document. This branch is
     a deployment misconfiguration rather than a visitor mistake, and a QR code
     at a stall is exactly where a blank screen is least recoverable. It is
     what the store page shows without its keys (and on beta, D051). */
  if (!env) return <StoreNotConfigured />;

  const result = await resolveTier(env, { tier: event, signature: sig ?? null });

  if (!result.ok) {
    return <Panel copy={eventPage.refused} message={eventPage.refused.reasons[result.reason]} />;
  }

  const amountLabel = formatInr(result.tier.amountPaise);
  /* What the ₹4,999 price still needs after THIS token, so a ₹99 event booking
     honestly reads ₹4,900 rather than the public ₹4,500 (2026-08-23). */
  const balanceLabel = formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - result.tier.amountPaise));

  /* Always the token shape, whatever the public mode is: an event token is a
     token, with the same balance-before-dispatch terms (TierCheckout). */
  return (
    <TierCheckout content={eventPage.checkout} tier={result.tier} signature={sig} amountLabel={amountLabel} balanceLabel={balanceLabel} />
  );
}

/** A link the store refuses, in the store's panel, closed as every store page
 *  that sells is: the body for the checkout's reason, then the two ways forward
 *  (the usual price, a person). */
function Panel({ copy, message }: { copy: StorePanelCopy; message: string }) {
  return (
    <>
      <NotFoundPanel copy={copy} body={message} />
      <StoreClose />
    </>
  );
}
