/** GA4 events for the pre-order funnel (§8.25-r).
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
 *  so on localhost and previews every call here is a no-op by design. */
type Params = Record<string, string | number | undefined>;

function track(event: string, params?: Params): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", event, params);
}

export const preorderAnalytics = {
  /** The form was submitted and validated: real intent, before any gateway. */
  start: (tier: string) => track("preorder_start", { tier }),
  /** Razorpay's sheet actually opened. */
  beginCheckout: (valuePaise: number, tier: string) =>
    track("begin_checkout", { currency: "INR", value: valuePaise / 100, tier }),
  /** Paid, and verified. */
  purchase: (orderRef: string, valuePaise: number, tier: string) =>
    track("purchase", {
      transaction_id: orderRef,
      currency: "INR",
      value: valuePaise / 100,
      tier,
    }),
  /** The delivery address landed, which is what unblocks dispatch. */
  addressSaved: (orderRef: string) => track("preorder_address_saved", { transaction_id: orderRef }),
  /** They opened the sheet and closed it. The most useful negative signal we get. */
  dismissed: (tier: string) => track("preorder_dismissed", { tier }),
};
