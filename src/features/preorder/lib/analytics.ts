/** Funnel events for the pre-order, for GA4, the Meta Pixel and PostHog
 *  (§8.25-r, extended §8.38).
 *
 *  Four events, each answering a question the founder will actually ask: how
 *  many people started, how many reached the payment sheet, how many paid, and
 *  how many finished the address. The gap between any two of those is where the
 *  money is leaking.
 *
 *  `purchase` uses GA4's own ecommerce names (value, currency, transaction_id)
 *  because the standard report is built on them, and transaction_id is our order
 *  reference so a GA4 row can be matched to a real order.
 *
 *  gtag may be absent: the tag only loads on the production hosts (GA4_HOSTS),
 *  so on localhost and previews every call here is a no-op by design. The same
 *  is true of fbq and of PostHog, on the same host list.
 *
 *  THE META PIXEL'S TWO MONEY EVENTS ARE FIRED FROM HERE, beside their GA4
 *  twins, rather than from their own call sites. One funnel, defined once: the
 *  failure this design rules out is the tools drifting apart, so that Meta and
 *  GA4 disagree about how many people paid and nobody can say which is lying.
 *  PostHog joined these same bodies on 2026-09-19 for exactly that reason, and
 *  it is the tool most likely to have been left to autocapture instead:
 *  autocapture WOULD produce a click event for the pre-order button, but it
 *  cannot produce a value in rupees, a tier, or an order reference, and a funnel
 *  that cannot be set beside the other two is worth very little. The GA4 event
 *  names are reused verbatim so all three can be read side by side.
 *
 *  Meta's names are fixed by Meta (InitiateCheckout, Purchase) and its value is
 *  in rupees, not paise.
 *
 *  VALUE IS WHAT WAS ACTUALLY COLLECTED (founder, 2026-09-01), not the ₹4,999
 *  headline: ₹499 for a token order, ₹7,999 for a full one, ₹99 at an event.
 *  A token order's ₹4,500 balance lands weeks later by payment link and is
 *  never reported here, so ROAS reads low on token orders rather than counting
 *  revenue that a refund could take back. Refunds are not reported either;
 *  correcting for them needs the Conversions API, which is why fbTrack already
 *  carries an eventId slot. */
import { fbTrack, purchaseEventId } from "@/lib/fbq";
import { phCapture } from "@/lib/posthog";

type Params = Record<string, string | number | undefined>;

function track(event: string, params?: Params): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, params);
}

export const preorderAnalytics = {
  /** The form was submitted and validated: real intent, before any gateway. */
  start: (tier: string) => {
    track("preorder_start", { tier });
    phCapture("preorder_start", { tier });
  },
  /** Razorpay's sheet actually opened. */
  beginCheckout: (valuePaise: number, tier: string) => {
    track("begin_checkout", { currency: "INR", value: valuePaise / 100, tier });
    fbTrack("InitiateCheckout", { currency: "INR", value: valuePaise / 100, content_category: tier });
    phCapture("begin_checkout", { currency: "INR", value: valuePaise / 100, tier });
  },
  /** Paid, and verified.
   *
   *  Fired from Razorpay's success handler, so it runs once per payment and
   *  cannot repeat: a parent returning to /thanks weeks later from the email
   *  link never reaches this code, which is why no de-duplication is needed.
   *
   *  `valuePaise` is the amount the SERVER quoted in the create-order response.
   *  The client never chooses it (§8.25-c-i), so the figure reported to Meta is
   *  the figure Razorpay was asked to charge. */
  purchase: (orderRef: string, valuePaise: number, tier: string) => {
    track("purchase", {
      transaction_id: orderRef,
      currency: "INR",
      value: valuePaise / 100,
      tier,
    });
    fbTrack(
      "Purchase",
      {
        currency: "INR",
        value: valuePaise / 100,
        content_category: tier,
        order_id: orderRef,
      },
      /* The de-duplication key, sent from 2026-09-02 ahead of the Conversions
         API that will need it. Meta collapses a browser event and a server
         event into one when event_name and eventID match within 48 hours, and
         the point of deriving it from the order reference is that BOTH sides
         can compute it independently, with no shared state and nothing to pass
         between them. Harmless while only the browser sends: an eventID on its
         own just makes the event idempotent. */
      purchaseEventId(orderRef),
    );
    phCapture("purchase", {
      transaction_id: orderRef,
      currency: "INR",
      value: valuePaise / 100,
      tier,
    });
  },
  /** The delivery address landed, which is what unblocks dispatch.
   *
   *  Fires on /store/thanks, where autocapture is suppressed by `ph-no-capture`
   *  on the page container. That suppression governs what a person TAPS; this is
   *  an explicit call and still fires, as it should. It carries an order
   *  reference and nothing else. */
  addressSaved: (orderRef: string) => {
    track("preorder_address_saved", { transaction_id: orderRef });
    phCapture("preorder_address_saved", { transaction_id: orderRef });
  },
  /** They opened the sheet and closed it. The most useful negative signal we get. */
  dismissed: (tier: string) => {
    track("preorder_dismissed", { tier });
    phCapture("preorder_dismissed", { tier });
  },
};
