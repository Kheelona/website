import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * THE ANALYTICS FREEZE (founder requirement, CMO merge, 2026-10-04): "make sure
 * the pixel and PostHog integrations are properly carried forward."
 *
 * Both integrations live almost entirely OUTSIDE the pages, so this round froze
 * that layer byte-identical to `pre-cmo-merge-2026-10` (= 77552ff, main before
 * the round) and this test is the proof. If any line below changes, the change
 * is to the measurement itself, not to content, and it needs its own decision.
 *
 * It compares against the git TAG, so it needs a clone that has the tag. Where
 * the tag is absent (a fresh clone, a CI checkout without tags) it SKIPS, loudly
 * named, rather than failing on a missing ref. It is a ROUND guard: once the
 * merge is verified on production, retire it (Technical-Todo.md says so),
 * because a permanent freeze would block every legitimate analytics change.
 */
const ROOT = process.cwd();
const TAG = "pre-cmo-merge-2026-10";

function git(args: string[]) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}

const hasTag = (() => {
  try {
    git(["rev-parse", "--verify", `${TAG}^{commit}`]);
    return true;
  } catch {
    return false;
  }
})();

/** Byte-identical files and folders: every tag lives in the root layout, the
 *  client libraries, the edge, the CSP, the server-side events and the store. */
const FROZEN = [
  "src/app/layout.tsx",
  "src/components/molecules/MetaPixel.tsx",
  "src/components/molecules/PostHogGate.tsx",
  "src/lib/fbq.ts",
  "src/lib/posthog.ts",
  "src/lib/click-id.ts",
  "src/lib/campaign.ts",
  "src/proxy.ts",
  "src/lib/security-headers.ts",
  "src/lib/store",
  "src/app/api",
  "src/app/store",
  "src/features/preorder",
] as const;

/** Config constants the measurement depends on, compared line for line. */
const FROZEN_CONSTANTS = [
  "STORE_URL",
  "PREORDER_HREF",
  "GA4_MEASUREMENT_ID",
  "GA4_HOSTS",
  "META_PIXEL_ID",
  "META_PIXEL_HOSTS",
  "AHREFS_ANALYTICS_KEY",
  "POSTHOG_KEY",
  "POSTHOG_API_HOST",
  "POSTHOG_ASSET_HOST",
  "POSTHOG_PROXY_PATH",
  "POSTHOG_ASSET_PROXY_PATH",
  "POSTHOG_UI_HOST",
  "POSTHOG_HOSTS",
  "POSTHOG_REPLAY_DENY_PATHS",
] as const;

const constantLine = (src: string, name: string) =>
  src.split("\n").find((l) => l.startsWith(`export const ${name} =`));

describe.skipIf(!hasTag)(`the analytics layer is byte-identical to ${TAG}`, () => {
  it.each(FROZEN)("%s has no diff against the tag", (path) => {
    const diff = git(["diff", "--stat", TAG, "--", path]);
    expect(diff, `${path} changed: the measurement layer is frozen this round`).toBe("");
  });

  it.each(FROZEN_CONSTANTS)("config %s is unchanged", (name) => {
    const before = constantLine(git(["show", `${TAG}:src/config/site.ts`]), name);
    const now = constantLine(readFileSync(join(ROOT, "src/config/site.ts"), "utf8"), name);
    expect(before, `${name} missing at the tag`).toBeDefined();
    expect(now).toBe(before);
  });

  it("next.config.ts changed ONLY by losing the /faq redirect (comments aside)", () => {
    const changed = git(["diff", "-U0", TAG, "--", "next.config.ts"])
      .split("\n")
      .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
      .map((l) => l.slice(1).trim())
      /* comment lines: a line inside or closing a block comment */
      .filter((l) => l && !/^(\/\*|\*|\/\/)/.test(l) && !/\*\/$/.test(l) && !/^[`a-z.(]/.test(l));
    expect(changed).toEqual(['{ source: "/faq", destination: "/products/kheelu#faq", permanent: true },']);
  });
});

describe("the freeze guard itself", () => {
  it("names the tag it compares against (and says when it is skipping)", () => {
    if (!hasTag) console.warn(`[analytics-freeze] SKIPPED: tag ${TAG} is not in this clone`);
    expect(TAG).toBe("pre-cmo-merge-2026-10");
  });
});
