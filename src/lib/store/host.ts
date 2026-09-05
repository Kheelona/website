import { STORE_URL } from "@/config/site";
import { THANKS_PATH, formatThanksSession } from "./thanks-session";

/** Host routing for store.kheelona.com (§8.25-a).
 *
 *  The founder chose a subdomain, and a subdomain does not have to mean a second
 *  application. This repo serves both hosts: `store.kheelona.com/thanks` is
 *  internally `/store/thanks`, which keeps the design tokens, the component
 *  catalog, the copy laws and the test suite in exactly one place. A second
 *  codebase would have drifted from the brand inside a month.
 *
 *  Two rules, and the second one is the one people forget:
 *
 *   1. On the store host, every path maps into `/store/...`.
 *   2. On the apex, `/store/...` REDIRECTS to the store host. Without that, every
 *      store page exists at two URLs, which splits its links and lets Google
 *      pick the wrong one. One page, one address.
 *
 *  This is a pure function so it can be tested without a Next request object,
 *  the same way `redirects-vs-assets.test.ts` reads the redirect config as text
 *  rather than booting a server. */

export type HostRoute =
  /** `status` is set only when the proxy already knows the path is not a page
   *  (§8.34-a). Next cannot supply a 404 that renders: a thrown `notFound()`
   *  answers with an empty document, so the status is attached to the rewrite
   *  here and the page itself just renders. */
  | { kind: "rewrite"; path: string; status?: number }
  | { kind: "redirect"; url: string }
  /** Take the confirmation credential out of the URL and into a cookie, then
   *  send the browser to the clean path (F-01, see thanks-session.ts). */
  | { kind: "claim"; path: string; session: string }
  | { kind: "pass" };

/** Hosts that serve the store. `store.localhost` is here so the rewrite can be
 *  exercised locally: browsers resolve any *.localhost to 127.0.0.1, so
 *  http://store.localhost:3000 hits the same dev server. */
export function isStoreHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return name === "store.kheelona.com" || name === "store.localhost";
}

/** Every page that exists on the store host, written the way a visitor types
 *  it. Anything else is a 404, and the proxy has to know that BEFORE Next
 *  resolves the route (§8.34-a).
 *
 *  This duplicates what the folders under `src/app/store/` already say, which
 *  is a real cost on the host that takes money: get it wrong in the tightening
 *  direction and a live checkout page 404s. `test/store-host.test.ts` walks
 *  those folders and fails if a page exists that this list does not admit, so
 *  the drift is caught by the suite rather than by a customer. */
const STORE_PAGES: readonly RegExp[] = [
  /^\/$/,
  /^\/thanks$/,
  /^\/ideabaaz$/,
  /^\/e\/[^/]+$/,
];

/** Exported for the guard test, which is the only thing keeping the list above
 *  honest. */
export function isStorePage(pathname: string): boolean {
  return STORE_PAGES.some((route) => route.test(pathname));
}

export function routeForHost(host: string, pathname: string, search = ""): HostRoute {
  if (isStoreHost(host)) {
    /* The one URL on this host that carries a credential. It is consumed on
       arrival rather than rendered: the page that would render it loads three
       analytics tags, and every one of them reports the URL it was loaded on
       (F-01). Anything malformed falls through to the ordinary rewrite, where
       the page answers with its "open your link again" state. */
    if (pathname === THANKS_PATH && search) {
      const params = new URLSearchParams(search);
      const session = formatThanksSession(params.get("ref") ?? "", params.get("t") ?? "");
      if (session) return { kind: "claim", path: THANKS_PATH, session };
    }
    /* The rewrite target does not change for a missing page — the catch-all
       under /store renders the store's own 404 inside the store chrome. What
       changes is the status, which only this function is in a position to
       know. That also covers the doubled-prefix trap: /store and /store/thanks
       are not store pages, so they 404 here rather than quietly serving the
       home page from a URL nobody should link to. */
    const suffix = pathname === "/" ? "" : pathname;
    const path = `/store${suffix}${search}`;
    return isStorePage(pathname)
      ? { kind: "rewrite", path }
      : { kind: "rewrite", path, status: 404 };
  }

  if (pathname === "/store" || pathname.startsWith("/store/")) {
    const suffix = pathname.slice("/store".length) || "/";
    return { kind: "redirect", url: `${STORE_URL}${suffix}${search}` };
  }

  return { kind: "pass" };
}
