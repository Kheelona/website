import StoreNotFound, { metadata } from "../not-found";

/** Every store URL that is not a store page (§8.25-z, §8.34-a).
 *
 *  A mistyped URL on the store host is rewritten to `/store/<whatever>`, and
 *  before this route existed it matched nothing, so Next fell back to the ROOT
 *  not-found and served the store's 404 wearing the full marketing chrome.
 *  Someone who could not reach their paid order was shown the marketing site's
 *  navigation.
 *
 *  It RENDERS rather than calling `notFound()`, which is the 2026-09-06 change.
 *  A thrown 404 takes Next's error path and answers with an empty
 *  `<html id="__next_error__">` document — no stylesheet, no text — so this
 *  page was a blank screen until JavaScript hydrated. It answers 200 in the
 *  store chrome: on Vercel a middleware rewrite that carries a 4xx has its
 *  destination discarded and the marketing 404 served instead (§8.34-f,
 *  lib/store/host.ts), and the store host is noindex besides.
 *
 *  It is the store's not-found page itself (task 6.1): the same panel, close and
 *  metadata as the boundary, imported, so the two can never drift.
 *
 *  Static and dynamic segments still win over a catch-all, so /thanks and
 *  /e/[event] are untouched. */
export { metadata };

export default function StoreCatchAll() {
  return <StoreNotFound />;
}
