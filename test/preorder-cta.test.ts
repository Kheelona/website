import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { PREORDER_HREF, STORE_URL } from "@/config/site";

/**
 * ONE TAP TO THE STORE (§8.25-b, revised 2026-08-23 on the founder's call).
 *
 * Until this date every pre-order CTA pointed at `#reserve`, and only the
 * finale linked out to the store. The reason was real: a parent should read the
 * price, the refund promise and the ship date before a payment form opens. But
 * the store page carries all three itself, above its own form, so the second
 * tap bought no extra honesty and cost completions on the only action this site
 * exists for.
 *
 * The law is now the inverse, and this guards it: a CTA that points at an
 * anchor instead of the store is a regression, not a preference.
 */

const files = execFileSync(
  "git",
  ["ls-files", "src/**/*.ts", "src/**/*.tsx", "src/*.ts"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean)
  .filter((f) => !/\.(test|stories)\.tsx?$/.test(f));

/** Comments explain history, so they are stripped before the scan. */
function published(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

describe("every pre-order CTA reaches the store in one tap", () => {
  it("sends PREORDER_HREF to the store host, absolutely", () => {
    expect(PREORDER_HREF).toBe(STORE_URL);
    expect(PREORDER_HREF).toMatch(/^https:\/\/store\./);
  });

  it("scans a real file list", () => {
    expect(files.length).toBeGreaterThan(60);
    expect(files).toContain("src/components/organisms/Navbar.tsx");
  });

  /* The anchor itself survives as a SECTION ID: LegalDoc appends the finale to
     every legal page and the mobile guide hides against it. Only an href may
     not point there. */
  it.each(files)("%s routes no CTA at the reserve anchor", (file) => {
    const text = published(readFileSync(file, "utf8"));
    expect(text, `${file} still sends a CTA to #reserve`).not.toMatch(
      /href\s*=\s*\{?\s*"#reserve"/,
    );
  });
});
