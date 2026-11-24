import type { Metadata } from "next";
import { storeEnv } from "@/lib/store/env";
import { launchTier, fullTier } from "@/lib/store/tiers";
import { preorderMode } from "@/lib/store/mode";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { OrderSummary } from "@/features/preorder/components/OrderSummary";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { FilmsStrip } from "@/components/sections/FilmsStrip/FilmsStrip";
import { PayBeside, StoreDetails } from "@/components/sections/store/StoreDetails/StoreDetails";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { StoreTop } from "@/components/sections/store/StoreTop/StoreTop";
import { InAppBrowserNote } from "@/components/ui/InAppBrowserNote/InAppBrowserNote";
import { formatInr } from "@/config/site";
import { HOSTS, STORE_ORIGIN } from "@/config/env";
import { pickFaqs } from "@/content/en-IN/faqs";
import { films, filmsStrip } from "@/content/en-IN/films";
import { navigation } from "@/content/en-IN/navigation";
import { seller } from "@/content/en-IN/seller";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { storePage } from "@/content/en-IN/store/store-page";
import { buildOffer } from "@/lib/offer/offer";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";
import { StoreNotConfigured } from "./_components/StoreNotConfigured";

/** store.kheelona.com (§8.25-w, mode-gated since §8.26; restyled on the design
 *  system in task 5.15, ADR-013: markup, classes, copy and presentation imports).
 *
 *  Three states, all real, none of them a stack trace:
 *
 *   1. TOKEN MODE: fewer than the capped units are paid, so ₹499 reserves one
 *      at the pre-order price. The price panel and the form. This is the page.
 *   2. FULL MODE: the capped units are gone. Same page, same form, but the
 *      offer is the launch price paid once, upfront. There is no "closed"
 *      state any more — the store always sells at SOME price, decided here on
 *      the server from the live count (never by the client, §8.25-c-i).
 *   3. NOT CONFIGURED: deployed before the keys are in the dashboard (and on
 *      beta, which never takes a payment, D051). Says "shortly" rather than
 *      failing, which is what let this ship before the founder had finished
 *      with Razorpay. The state is _components/StoreNotConfigured, shared
 *      with the event page since task 7.1c.
 *
 *  Rendered on the server, form and all, so the price a parent reads is in the
 *  HTML rather than assembled by a script that might not run. Prerendered and
 *  revalidated every 5 minutes (see `revalidate` below), not rendered per request.
 *
 *  THE APPROVED PAGE (mockup/store.html; wiki/site/pages/store.md). The first
 *  screen says what is paid today, the total and when it comes (StoreTop); the
 *  form follows, with the price sentence, the refund promise, the trust row and
 *  a person to reach in the pay button's own block; then the agreement card and
 *  the questions before you pay (StoreDetails: beside the form from 900 px, after
 *  it on a phone); then, below every money answer, the families' films (D040);
 *  and last in <main> the payments line the footer cannot carry (deviations V1).
 *  The checkout itself is wired here, as at the tag: the live mode decides the
 *  tier, and PreorderForm and OrderSummary take that tier's amount and label. */

/** THE STORE'S FIRST SCREEN COMES FROM CACHE (D070 / B5, K-173). It used to be `force-dynamic`: every visit waited for the
 *  paid-count query before a byte was sent (TTFB 1.0 to 2.2 s on production, `x-vercel-cache: MISS` every time). Now the page
 *  is prerendered and revalidated every 300 seconds, the ADR-005 offer window (a literal, because Next reads it statically;
 *  the same number as `OFFER_REVALIDATE_SECONDS`, `getOffer` and the marketing route handler).
 *
 *  WHAT THIS COSTS: the price a parent sees (token or full, decided from the live count) can be up to five minutes old across
 *  a mode flip. THAT IS SAFE because the price on the page is never what is charged: `create-order` re-decides the tier on
 *  the server for every order, and `resolveTier` (src/lib/store/tiers.ts) refuses a stale page in BOTH directions, a token
 *  page after the cap is hit (`cap-reached`) and a full page after a refund reopens a unit (`not-yet`), with a plain
 *  message (`tierRefusalMessage`: refresh, it will show the current price). A parent is never charged a price they did not
 *  see, and never charged the wrong tier. (The same stale-then-refresh path existed before for a tab left open.)
 *
 *  WHY NOTHING ELSE CHANGES: nothing in this page's tree reads `headers()`, `cookies()` or `searchParams` (checked in
 *  B5: the store layout, the shell, every section and the form read only constants, content and the client's own
 *  browser APIs), so the page is the same for every visitor and can be shared. The proxy still runs on every request,
 *  before the cache, so `kh_utm`, `kh_fbclid` and the host rewrite are unaffected. `/store/thanks` (a per-visitor cookie)
 *  and `/store/e/[event]` (a signed link) stay dynamic. With no store keys the page prerenders StoreNotConfigured, as it
 *  rendered it before; a build must have the store env to prerender the real page (without it, the not-configured state is
 *  what the cache holds until its first revalidation). */
export const revalidate = 300;

/** The store's description, Open Graph and Twitter (pageMeta; the store layout keeps its noindex, so no robots here),
 *  on the production store's address in every environment (config/env.ts: a beta page never canonicalises to itself):
 *  a link shared from the store previews the store, not the marketing home. The mode is the offer's cached read, which
 *  a mode flip reaches within its window (ADR-005); the page itself is revalidated on the same window (above). */
export async function generateMetadata(): Promise<Metadata> {
  const meta = pageMeta({ ...storePage.meta, path: "/", offer: await getOffer() });
  const url = `https://${HOSTS.production.store}/`;
  return { ...meta, alternates: { canonical: url }, openGraph: { ...meta.openGraph, url } };
}

export default async function StorePage() {
  const env = storeEnv();
  if (!env) return <StoreNotConfigured />;

  const mode = await preorderMode(env);
  const tier = mode === "token" ? launchTier() : fullTier();
  const offer = buildOffer(mode);
  const newTabNote = navigation.labels.newTabNote;

  return (
    <>
      <StoreDetails
        content={storePage.details}
        top={<StoreTop content={storePage.top} offer={offer} newTabNote={newTabNote} />}
        note={<InAppBrowserNote content={inAppNote} storeUrl={STORE_ORIGIN} />}
        form={
          <PreorderForm
            tier={tier.id}
            amountLabel={formatInr(tier.amountPaise)}
            mode={mode}
            beside={<PayBeside content={storePage.beside} offer={offer} newTabNote={newTabNote} />}
          />
        }
        summary={
          <OrderSummary
            amountLabel={formatInr(tier.amountPaise)}
            tierLabel={tier.label}
            mode={mode}
            delivery={offer.delivery}
          />
        }
        questions={
          <FaqSection variant="store" heading={storePage.questions.heading} items={pickFaqs(storePage.questions.items)} offer={offer} />
        }
      />
      {/* Real families on film (§8.37, D040), below the whole grid and every money
          answer: on a phone the order stays heading, form, summary, questions,
          films. Nothing here can reach the payment path, and no <video> mounts
          until a visitor asks for one. */}
      <FilmsStrip {...storePage.films} films={films} labels={filmsStrip} offer={offer} />
      <StorePaymentsLine content={storePage.payments} newTabNote={newTabNote} />
      <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="store" />
    </>
  );
}
