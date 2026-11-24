/** What the two payment-return routes share (D070 / B2, K-172).
 *
 *  Both live on the store host only (the proxy rewrites its paths to /store/*), are never linked and never in the
 *  sitemap, and carry a person's order, so every response, redirects included, is private and unindexed. */

/** Not cached by anything, and kept out of every index. */
export const PAY_HEADERS = {
  "cache-control": "private, no-store",
  "x-robots-tag": "noindex, nofollow",
} as const;

/** The Razorpay order id's documented shape: `order_` and 14 letters or digits. Anything else is not one of ours. */
export const RZP_ORDER_ID = /^order_[A-Za-z0-9]{14}$/;

/** A 303 to a RELATIVE path, on purpose: Razorpay's page posts to us across sites, and a relative Location resolves on
 *  whatever host the parent is on (the store, a test store, localhost) with no host knowledge in this code. 303, never
 *  301/302/307, so the browser follows it with a GET and never re-posts the payment fields. */
export function see(path: string): Response {
  return new Response(null, { status: 303, headers: { location: path, ...PAY_HEADERS } });
}
