import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { POSTHOG_PROXY_PATH } from "@/config/site";

/**
 * The behavioural half of §8.39's trailing-slash story. `trailing-slash.test.ts`
 * proves the RULE; this proves `src/proxy.ts` actually applies it, which is the
 * part that would otherwise be a comment nobody checked.
 *
 * It drives the real exported `proxy` with a real NextRequest rather than
 * asserting on the file's text, because the question is what a browser gets
 * back, not what the source says.
 */
function request(url: string, host = "kheelona.com") {
  return new NextRequest(new URL(url, `https://${host}`), {
    headers: { host },
  });
}

describe("src/proxy.ts restores the trailing-slash redirect", () => {
  it("308s a marketing route with a trailing slash", () => {
    const response = proxy(request("https://kheelona.com/team/"));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/team");
  });

  it("keeps the query string when it redirects", () => {
    const response = proxy(request("https://kheelona.com/products/kheelu/?utm_source=meta"));
    expect(response.status).toBe(308);
    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/products/kheelu");
    /* An untagged click is untagged forever (docs/utm-conventions.md), and ads
       are running. Dropping the query here would silently break attribution. */
    expect(location.search).toBe("?utm_source=meta");
  });

  it("does not redirect a route that has no trailing slash", () => {
    const response = proxy(request("https://kheelona.com/team"));
    expect(response.status).not.toBe(308);
  });

  it("leaves the PostHog ingestion path exactly as PostHog sends it", () => {
    const response = proxy(request(`https://kheelona.com${POSTHOG_PROXY_PATH}/e/`));
    expect(response.status).not.toBe(308);
  });

  /* The store host redirects the same way, because it is one app and a parent
     mid-checkout must not meet different routing from a parent reading a story. */
  it("308s on the store host too", () => {
    const response = proxy(request("https://store.kheelona.com/refund/", "store.kheelona.com"));
    expect(response.status).toBe(308);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/refund");
  });
});
