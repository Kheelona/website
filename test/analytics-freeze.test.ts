import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * THE ANALYTICS FREEZE (founder requirement, CMO merge, 2026-10-04): "make sure
 * the pixel and PostHog integrations are properly carried forward."
 *
 * NARROWED in review round 2 (2026-10-04), deliberately and recorded: the
 * founder also asked for EVERY page, the store included, to read in sync with
 * Home. The first version froze whole folders (the store pages, the pre-order
 * components), which made store COPY impossible to fix. So the freeze is now
 * on the code that measures and charges, and the places where pages touch the
 * measurement are pinned explicitly:
 *
 *   1. BYTE-IDENTICAL: the tag components, the client libraries, the edge and
 *      the CSP, every API route, the pre-order logic (analytics, checkout,
 *      validation) and the store library, except one file below.
 *   2. LINE-LIMITED: `lib/store/tiers.ts` may change only its display `label`
 *      strings; the root layout only its default title and description;
 *      `next.config.ts` only by losing the `/faq` redirect; the pre-order form
 *      components only their `className` lines.
 *   3. PINNED HOOKS: /thanks keeps its `ph-no-capture` container; the forms
 *      still import `preorderAnalytics`, and the form still fires
 *      `onFirstChange` on its first edit.
 *   4. The config constants the tags read are line-identical.
 *
 * It compares against the git TAG, so it SKIPS (named) in a clone without it.
 * A ROUND guard: retire it once production confirms (Technical-Todo.md).
 */
const ROOT = process.cwd();
const TAG = "pre-cmo-merge-2026-10";

function git(args: string[]) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
}
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

const hasTag = (() => {
  try {
    git(["rev-parse", "--verify", `${TAG}^{commit}`]);
    return true;
  } catch {
    return false;
  }
})();

/** Byte-identical: everything that measures, routes or charges. */
const FROZEN = [
  "src/components/molecules/MetaPixel.tsx",
  "src/components/molecules/PostHogGate.tsx",
  "src/components/molecules/GoogleAnalyticsGate.tsx",
  "src/lib/fbq.ts",
  "src/lib/posthog.ts",
  "src/lib/click-id.ts",
  "src/lib/campaign.ts",
  "src/proxy.ts",
  "src/lib/security-headers.ts",
  "src/app/api",
  "src/features/preorder/lib",
  "src/lib/store",
] as const;

/** The only file inside a frozen folder that may change, and how. */
const LINE_LIMITED_INSIDE_FROZEN = ["src/lib/store/tiers.ts", "src/lib/store/tiers.test.ts"];

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

/** The added and removed lines of a file against the tag, trimmed, with blank
 *  lines and comment lines dropped. */
function changedLines(path: string) {
  return git(["diff", "-U0", TAG, "--", path])
    .split("\n")
    .filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l))
    .map((l) => l.slice(1).trim())
    .filter((l) => l && !/^(\/\*|\*|\/\/|\{\/\*)/.test(l) && !/\*\/\}?$/.test(l));
}

describe.skipIf(!hasTag)(`the measuring and charging code is unchanged since ${TAG}`, () => {
  it.each(FROZEN)("%s has no diff against the tag (line-limited files aside)", (path) => {
    const excludes = LINE_LIMITED_INSIDE_FROZEN.filter((f) => f.startsWith(path)).map(
      (f) => `:(exclude)${f}`,
    );
    const diff = git(["diff", "--stat", TAG, "--", path, ...excludes]);
    expect(diff, `${path} changed: the measuring and charging layer is frozen this round`).toBe("");
  });

  it.each(LINE_LIMITED_INSIDE_FROZEN)("%s changed only its display labels", (path) => {
    const bad = changedLines(path).filter((l) => !/label: "/.test(l));
    expect(bad).toEqual([]);
  });

  it("the root layout changed only its default title and description", () => {
    const bad = changedLines("src/app/layout.tsx").filter(
      (l) => !/^(default|description):/.test(l) && !/^"[^"]*",?$/.test(l),
    );
    expect(bad).toEqual([]);
  });

  it("next.config.ts changed ONLY by losing the /faq redirect (comments aside)", () => {
    const changed = changedLines("next.config.ts").filter((l) => !/^[`a-z.(]/.test(l));
    expect(changed).toEqual(['{ source: "/faq", destination: "/products/kheelu#faq", permanent: true },']);
  });

  it.each([
    "src/features/preorder/components/PreorderForm.tsx",
    "src/features/preorder/components/AddressForm.tsx",
    "src/features/preorder/components/OrderSummary.tsx",
  ])("%s changed only className lines", (path) => {
    const bad = changedLines(path).filter((l) => !/className=|^"[^"]*",?$|^`[^`]*`,?$|^\?|^:/.test(l));
    expect(bad).toEqual([]);
  });

  it.each(FROZEN_CONSTANTS)("config %s is unchanged", (name) => {
    const before = constantLine(git(["show", `${TAG}:src/config/site.ts`]), name);
    const now = constantLine(read("src/config/site.ts"), name);
    expect(before, `${name} missing at the tag`).toBeDefined();
    expect(now).toBe(before);
  });
});

describe("the places pages touch the measurement are pinned", () => {
  it("/thanks keeps its ph-no-capture container (no replay, no autocapture of the order)", () => {
    expect(read("src/app/store/thanks/page.tsx")).toMatch(/className="ph-no-capture ph-mask /);
  });

  it("the pre-order and address forms still report through preorderAnalytics", () => {
    expect(read("src/features/preorder/components/PreorderForm.tsx")).toMatch(
      /import \{ preorderAnalytics \} from "\.\.\/lib\/analytics";/,
    );
    expect(read("src/features/preorder/components/AddressForm.tsx")).toMatch(
      /import \{ preorderAnalytics \} from "\.\.\/lib\/analytics";/,
    );
  });

  it("the form still fires preorder_form_started on its first edit", () => {
    expect(read("src/features/preorder/components/PreorderForm.tsx")).toMatch(/onChange=\{onFirstChange\}/);
  });

  it("names the tag it compares against (and says when it is skipping)", () => {
    if (!hasTag) console.warn(`[analytics-freeze] SKIPPED: tag ${TAG} is not in this clone`);
    expect(TAG).toBe("pre-cmo-merge-2026-10");
  });
});
