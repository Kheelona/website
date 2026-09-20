import { describe, expect, it } from "vitest";
import { trailingSlashRedirectPath } from "@/lib/trailing-slash";
import { POSTHOG_ASSET_PROXY_PATH, POSTHOG_PROXY_PATH } from "@/config/site";

/**
 * Next normalises trailing slashes itself, and we switched that off
 * (`skipTrailingSlashRedirect`) so PostHog keeps the trailing slashes it
 * ingests on (2026-09-20, §8.39). This is the half that puts it back.
 *
 * It matters because the flag is site-wide: without this, `/team/` and `/team`
 * would both answer 200 on a site whose whole SEO and answer-engine programme
 * rests on one URL per page. The point of this module is that a visitor and a
 * crawler cannot tell the flag was ever flipped.
 */
describe("the trailing-slash redirect Next is no longer doing", () => {
  it("strips a trailing slash from an ordinary route", () => {
    expect(trailingSlashRedirectPath("/team/")).toBe("/team");
    expect(trailingSlashRedirectPath("/products/kheelu/")).toBe("/products/kheelu");
    expect(trailingSlashRedirectPath("/stories/how-children-learn-by-talking/")).toBe(
      "/stories/how-children-learn-by-talking",
    );
  });

  it("leaves a path that already has no trailing slash alone", () => {
    for (const path of ["/team", "/products/kheelu", "/thanks", "/store/thanks"]) {
      expect(trailingSlashRedirectPath(path), path).toBeNull();
    }
  });

  /* The root is a trailing slash and must never redirect to the empty string. */
  it("never touches the root", () => {
    expect(trailingSlashRedirectPath("/")).toBeNull();
  });

  /* THE WHOLE REASON THE FLAG IS OFF. PostHog ingests on `/e/`, `/s/` and
     `/i/`; redirecting those away is what we are avoiding, and a redirect on a
     beacon fired during page unload is a lost event. */
  it("leaves the PostHog proxy paths with their trailing slashes", () => {
    for (const path of [
      `${POSTHOG_PROXY_PATH}/e/`,
      `${POSTHOG_PROXY_PATH}/s/`,
      `${POSTHOG_PROXY_PATH}/i/`,
      `${POSTHOG_ASSET_PROXY_PATH}/static/`,
    ]) {
      expect(trailingSlashRedirectPath(path), path).toBeNull();
    }
  });

  /* A doubled slash would otherwise loop: "/team//" -> "/team/" -> "/team/"… */
  it("resolves a repeated trailing slash in one hop", () => {
    expect(trailingSlashRedirectPath("/team//")).toBe("/team");
  });
});
