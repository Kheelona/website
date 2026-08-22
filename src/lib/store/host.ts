import { STORE_URL } from "@/config/site";

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
  | { kind: "rewrite"; path: string }
  | { kind: "redirect"; url: string }
  | { kind: "pass" };

/** Hosts that serve the store. `store.localhost` is here so the rewrite can be
 *  exercised locally: browsers resolve any *.localhost to 127.0.0.1, so
 *  http://store.localhost:3000 hits the same dev server. */
export function isStoreHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return name === "store.kheelona.com" || name === "store.localhost";
}

export function routeForHost(host: string, pathname: string, search = ""): HostRoute {
  if (isStoreHost(host)) {
    /* Already-prefixed paths would resolve to /store/store/... The honest answer
       is that store.kheelona.com/store is not a page, so let it 404 rather than
       silently serving the home page from a URL nobody should link to. */
    if (pathname === "/store" || pathname.startsWith("/store/")) {
      return { kind: "rewrite", path: "/404-store-path" };
    }
    const suffix = pathname === "/" ? "" : pathname;
    return { kind: "rewrite", path: `/store${suffix}${search}` };
  }

  if (pathname === "/store" || pathname.startsWith("/store/")) {
    const suffix = pathname.slice("/store".length) || "/";
    return { kind: "redirect", url: `${STORE_URL}${suffix}${search}` };
  }

  return { kind: "pass" };
}
