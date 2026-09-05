import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { routeForHost, isStoreHost, isStorePage } from "@/lib/store/host";
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

  /* THE GUARD THAT MAKES THE PAGE LIST SAFE (§8.34-c).
     `STORE_PAGES` restates what the folders under src/app/store/ already say,
     on the host that takes money: tighten it by mistake and a live checkout
     page 404s. So the folders are the source of truth and this walks them.
     Adding src/app/store/<x>/page.tsx without adding <x> to the list fails
     here, not in production. */
  it("admits every page that actually exists under src/app/store", () => {
    const dir = join(process.cwd(), "src/app/store");
    const urls = readdirSync(dir, { withFileTypes: true, recursive: true })
      .filter((e) => e.name === "page.tsx")
      .map((e) => join(e.parentPath ?? dir, e.name))
      .map((f) => f.slice(dir.length).replace(/\/page\.tsx$/, "") || "/")
      /* Component folders are not routes, and the catch-all IS the 404. */
      .filter((u) => !u.includes("/_") && !u.includes("[..."))
      /* A dynamic segment stands for any value a visitor could type. */
      .map((u) => u.replace(/\[[^\]]+\]/g, "sample-value"));

    expect(urls, "no store pages found — the walk is broken, not the list").not.toHaveLength(0);
    expect(urls).toContain("/thanks");
    expect(urls).toContain("/e/sample-value");
    for (const url of urls) {
      expect(isStorePage(url), `${url} exists but the proxy would 404 it`).toBe(true);
      expect(routeForHost("store.kheelona.com", url), url).not.toHaveProperty("status");
    }
  });

  /* The other direction: a URL that is not a page must carry the status, or it
     renders the store 404 under a 200 and becomes a soft 404. */
  it("marks a URL that is not a store page with a 404 status", () => {
    for (const path of ["/typo", "/products/kheelu", "/thanks/extra", "/e"]) {
      expect(routeForHost("store.kheelona.com", path), path).toEqual({
        kind: "rewrite",
        path: `/store${path}`,
        status: 404,
      });
    }
  });

  it("maps store paths through, query string intact", () => {
    expect(routeForHost("store.kheelona.com", "/thanks", "?ref=KH-A2B3-C4D5")).toEqual({
      kind: "rewrite",
      path: "/store/thanks?ref=KH-A2B3-C4D5",
    });
    expect(routeForHost("store.kheelona.com", "/e/blr-aug", "?sig=abc")).toEqual({
      kind: "rewrite",
      path: "/store/e/blr-aug?sig=abc",
    });
  });

  /* The doubled-prefix trap: store.kheelona.com/store must not quietly serve
     the store home page, or that URL gets linked and indexed as a third
     address for the same page. */
  it("refuses a doubled /store prefix instead of serving the page twice", () => {
    /* Answered by the ordinary catch-all now rather than a route of its own:
       /store is simply not in STORE_PAGES, so it takes the 404 status and the
       rewrite lands on /store/store, which no page matches. The dedicated
       /404-store-path route it used to use was deleted on 2026-09-06 — it
       rendered the MARKETING 404 on the payment host, and rendered it blank. */
    expect(routeForHost("store.kheelona.com", "/store")).toEqual({
      kind: "rewrite",
      path: "/store/store",
      status: 404,
    });
    expect(routeForHost("store.kheelona.com", "/store/thanks")).toEqual({
      kind: "rewrite",
      path: "/store/store/thanks",
      status: 404,
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
    expect(route).toEqual({
      kind: "rewrite",
      path: "/store/products/kheelu",
      status: 404,
    });
    // The 404 is now stated rather than left to an accident of file layout:
    // before 2026-09-06 this relied on no such route existing, and answered
    // with an empty document when it did not.
  });
});
