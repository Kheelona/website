import { describe, expect, it } from "vitest";
import { routeForHost, isStoreHost } from "@/lib/store/host";
import { STORE_URL } from "@/config/site";

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
