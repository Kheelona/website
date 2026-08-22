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
    expect(routeForHost("store.kheelona.com", "/store")).toEqual({
      kind: "rewrite",
      path: "/404-store-path",
    });
    expect(routeForHost("store.kheelona.com", "/store/thanks")).toEqual({
      kind: "rewrite",
      path: "/404-store-path",
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

  it("leaves every marketing route alone", () => {
    for (const path of ["/", "/products/lumi", "/refund", "/stories/how-children-learn-by-talking"]) {
      expect(routeForHost("kheelona.com", path), path).toEqual({ kind: "pass" });
    }
  });

  /* A store host must not serve the marketing site: same content on two hosts is
     duplicate content, and it would also mean a parent could read the old
     reservation copy on a domain that takes payments. */
  it("does not serve marketing pages on the store host", () => {
    const route = routeForHost("store.kheelona.com", "/products/lumi");
    expect(route).toEqual({ kind: "rewrite", path: "/store/products/lumi" });
    // which is not a route that exists, so it 404s. Asserted here so the
    // intention is on the record rather than an accident of file layout.
  });
});
