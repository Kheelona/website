import { describe, expect, it } from "vitest";
import { routeForHost, isStoreHost } from "@/lib/store/host";
import { POSTHOG_ASSET_PROXY_PATH, POSTHOG_PROXY_PATH, STORE_URL } from "@/config/site";

/**
 * The store lives on its own host but inside this app, so the mapping between
 * the two is load-bearing: get it wrong in one direction and the store 404s, get
 * it wrong in the other and every store page exists at two URLs.
 *
 * Tested as a pure function rather than by deploying and clicking, which is the
 * same reasoning as reading the redirect config as text in
 * redirects-vs-assets.test.ts.
 */
describe("store host routing", () => {
  it("knows its own hosts, including the local one", () => {
    expect(isStoreHost("store.kheelona.com")).toBe(true);
    expect(isStoreHost("store.localhost:3000")).toBe(true);
    expect(isStoreHost("STORE.KHEELONA.COM")).toBe(true);
    for (const other of ["kheelona.com", "www.kheelona.com", "kheelona.ai", "localhost:3000"]) {
      expect(isStoreHost(other), other).toBe(false);
    }
  });

  it("maps the store root to the store page, not to /store/", () => {
    expect(routeForHost("store.kheelona.com", "/")).toEqual({ kind: "rewrite", path: "/store" });
  });

  /* The doubled-prefix trap: store.kheelona.com/store must not quietly serve
     the store home page, or that URL gets linked and indexed as a third
     address for the same page. */
  it("refuses a doubled /store prefix instead of serving the page twice", () => {
    /* Answered by the ordinary catch-all now rather than a route of its own:
       /store is simply not in STORE_PAGES, so it takes the 404 status and the
       rewrite lands on /store/store, which no page matches. The dedicated
       /404-store-path route it used to use was deleted on 2026-09-06 — it
       rendered the MARKETING 404 on the payment host, and rendered it blank.
       It answers 200, not 404: a rewrite carrying a 4xx has its destination
       discarded by Vercel's edge (§8.34-f), so the choice was the right chrome
       or the right number, and the chrome is what a person sees. */
    expect(routeForHost("store.kheelona.com", "/store")).toEqual({
      kind: "rewrite",
      path: "/store/store",
    });
    expect(routeForHost("store.kheelona.com", "/store/thanks")).toEqual({
      kind: "rewrite",
      path: "/store/store/thanks",
    });
  });

  it("sends the apex's /store paths to the store host, one canonical URL each", () => {
    expect(routeForHost("kheelona.com", "/store")).toEqual({
      kind: "redirect",
      url: `${STORE_URL}/`,
    });
    expect(routeForHost("kheelona.com", "/store/thanks", "?ref=x")).toEqual({
      kind: "redirect",
      url: `${STORE_URL}/thanks?ref=x`,
    });
  });

  /* F-01. The confirmation link is the one URL on this host that carries a
     credential, and the page it points at loads three measurement tags, each of
     which reports the URL it loaded on. So the token must never survive as far
     as a rendered page: it is claimed here and the browser is sent to a clean
     path. Before this behaviour existed the same input rewrote straight through
     with `t=` intact, which is what put thirty-day order credentials into an
     analytics property. */
  it("claims the confirmation token out of the URL instead of rendering it", () => {
    const token = "1790000000000.AbCdEfGh12345678";
    const route = routeForHost(
      "store.kheelona.com",
      "/thanks",
      `?ref=KH-A2B3-C4D5&t=${token}`,
    );
    expect(route).toEqual({
      kind: "claim",
      path: "/thanks",
      session: `KH-A2B3-C4D5.${token}`,
    });
    /* The whole point: nothing that reaches a page still holds the token. */
    expect(JSON.stringify(route)).not.toContain("?");
    if (route.kind === "claim") expect(route.path).not.toContain("t=");
  });

  it("does not claim a malformed link: it falls through to the honest page", () => {
    /* A wrong reference or a token that is not the shape we mint must not be
       written into a Set-Cookie header. The ordinary rewrite renders the
       page's "we need your link again" state, which reveals nothing. */
    for (const search of [
      "?ref=KH-A2B3-C4D5",
      "?t=1790000000000.AbCdEfGh12345678",
      "?ref=nope&t=1790000000000.AbCdEfGh12345678",
      "?ref=KH-A2B3-C4D5&t=garbage",
    ]) {
      expect(routeForHost("store.kheelona.com", "/thanks", search).kind, search).toBe("rewrite");
    }
  });

  it("leaves every marketing route alone", () => {
    for (const path of ["/", "/products/kheelu", "/refund", "/stories/how-children-learn-by-talking"]) {
      expect(routeForHost("kheelona.com", path), path).toEqual({ kind: "pass" });
    }
  });

  /* A store host must not serve the marketing site: same content on two hosts is
     duplicate content, and it would also mean a parent could read the old
     reservation copy on a domain that takes payments. */
  it("does not serve marketing pages on the store host", () => {
    const route = routeForHost("store.kheelona.com", "/products/kheelu");
    expect(route).toEqual({ kind: "rewrite", path: "/store/products/kheelu" });
    // No such route exists, so it lands on the /store catch-all, which since
    // 2026-09-06 RENDERS the store's not-found rather than throwing one that
    // answers with an empty document.
  });
});

/** THE POSTHOG REVERSE PROXY MUST SURVIVE THIS FUNCTION (2026-09-20).
 *
 *  Analytics stopped being an off-site concern the moment its requests started
 *  going to our own domain. `/ingest/*` is now a path on BOTH hosts, and on the
 *  store host every path is rewritten into `/store/...` — which would turn
 *  `/ingest/e/` into `/store/ingest/e/`, a route that does not exist. PostHog
 *  would have died silently on exactly the host the pre-order funnel runs on,
 *  and the marketing host would have looked perfectly healthy.
 *
 *  Next's own routing order is what makes this reachable: proxy runs at step 3
 *  and `beforeFiles` rewrites at step 4
 *  (node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/rewrites.md),
 *  so this function sees the request BEFORE the rewrite that sends it to
 *  PostHog. `src/proxy.ts` also excludes these paths from its matcher, so in
 *  production this branch is belt to that braces — the guard stays because the
 *  matcher is a literal Next cannot let us build from a constant, and a silent
 *  analytics outage on the checkout host is not a failure anyone would notice. */
describe("the PostHog proxy paths", () => {
  const ingestPaths = [
    `${POSTHOG_PROXY_PATH}/e/`,
    `${POSTHOG_PROXY_PATH}/s/`,
    `${POSTHOG_PROXY_PATH}/i/`,
    `${POSTHOG_ASSET_PROXY_PATH}/static/recorder.js`,
  ];

  it("are never rewritten into the store on the store host", () => {
    for (const path of ingestPaths) {
      expect(
        routeForHost("store.kheelona.com", path),
        `${path} was routed into /store, so PostHog is dead on the checkout host`,
      ).toEqual({ kind: "pass" });
    }
  });

  it("pass through the apex untouched as well", () => {
    for (const path of ingestPaths) {
      expect(routeForHost("kheelona.com", path), path).toEqual({ kind: "pass" });
    }
  });

  /* The guard must key on the proxy prefixes themselves, not on a substring
     that a real store route could contain. */
  it("does not accidentally exempt an ordinary store route", () => {
    expect(routeForHost("store.kheelona.com", "/ingestion-report")).toEqual({
      kind: "rewrite",
      path: "/store/ingestion-report",
    });
  });
});
