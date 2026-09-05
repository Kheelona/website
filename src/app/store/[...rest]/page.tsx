import { NotFoundPanel } from "../_components/NotFoundPanel";

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
 *  page was a blank screen until JavaScript hydrated. The 404 status now comes
 *  from `src/proxy.ts`, which knows the path is not a store page before Next
 *  ever resolves the route.
 *
 *  Static and dynamic segments still win over a catch-all, so /thanks and
 *  /e/[event] are untouched. */
export default function StoreCatchAll() {
  return <NotFoundPanel />;
}
