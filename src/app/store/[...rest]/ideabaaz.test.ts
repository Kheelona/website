import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { REDIRECTS } from "@/config/redirects";
import { routeForHost } from "@/lib/store/host";

/* store.kheelona.com/ideabaaz (task 6.6 item 2; D054 item 7, 2026-10-14): the Ideabaaz partner page is not needed, so
 * the address shows the store's not-found page, with no redirect (the founder chose this over a redirect to the store,
 * knowing printed QR codes point there). With no page of its own the path is a store dead end: the host rule rewrites
 * it into /store, where only this folder's catch-all answers, rendering the store's not-found page in the store chrome
 * (../not-found.tsx; the status is the store dead end's, lib/store/host.ts). The browser proof is
 * test/e2e/store-secondary.spec.ts, row "partner-retired", at 360, 390 and 1440. */

const tracked = (pathspec: string) =>
  execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", pathspec], { encoding: "utf8" }).split("\n").filter(Boolean);

/** The tracked files under `path` that contain any of the words (git grep answers 1 when none does). */
function grep(words: string[], path: string): string[] {
  try {
    return execFileSync("git", ["grep", "-l", "-I", ...words.flatMap((w) => ["-e", w]), "--", path], { encoding: "utf8" }).split("\n").filter(Boolean);
  } catch (e) {
    if ((e as { status?: number }).status === 1) return [];
    throw e;
  }
}

describe("store.kheelona.com/ideabaaz: the store's not-found page (D054 item 7)", () => {
  it("has no page of its own, so the store's catch-all answers it", () => {
    expect(tracked("src/app/store/ideabaaz")).toEqual([]);
    expect(tracked("src/app/store/[[]...rest[]]/page.tsx")).toEqual(["src/app/store/[...rest]/page.tsx"]);
  });

  it("is rewritten into the store like any other store path, never redirected", () => {
    for (const host of ["store.kheelona.com", "betastore.kheelona.com", "store.localhost:3000"]) {
      expect(routeForHost(host, "/ideabaaz"), host).toEqual({ kind: "rewrite", path: "/store/ideabaaz" });
      expect(routeForHost(host, "/ideabaaz", "?utm_source=qr"), host).toEqual({ kind: "rewrite", path: "/store/ideabaaz?utm_source=qr" });
    }
    expect(REDIRECTS.filter((r) => /ideabaaz/i.test(JSON.stringify(r)))).toEqual([]);
  });

  it("keeps none of the partner page's parts: its words, its checkout and its lockup's code are gone", () => {
    expect(tracked("src/content/en-IN/store/partner-page*")).toEqual([]);
    const refs = grep(["partnerPage", "partner-page", "PartnerChip"], "src").filter((f) => f !== "src/app/store/[...rest]/ideabaaz.test.ts");
    expect(refs).toEqual([]);
  });
});
