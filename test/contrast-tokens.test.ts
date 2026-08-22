import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The palette's legal ink-on-wash pairs, in runnable form.
 *
 * This exists because a colour rule written only in prose gets applied unevenly.
 * §8.24-7 says `ink-muted` is banned on tinted washes at label size, and nine
 * call sites carried it anyway — one of them failing WCAG AA on the live site.
 * The matrix below is the arithmetic behind that rule, so it cannot rot: if
 * someone lightens a wash or darkens an ink, the test says which pairs changed
 * side rather than leaving it to the next axe sweep to notice, or not.
 *
 * WHERE THE VALUES COME FROM. Every wash except `white` is a real `--color-*`
 * token in globals.css since CS3 Phase 0 (2026-08-23) promoted `sun` from a
 * raw `bg-[#fdf1e2]` literal in Room.tsx to `--color-sun` — the literal was
 * the one wash a palette change could silently miss. `white` is Tailwind's
 * own default and not a token at all.
 */

const ROOT = process.cwd();
const CSS = readFileSync(join(ROOT, "src/styles/globals.css"), "utf8");

function token(name: string): string {
  const m = CSS.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`--color-${name} not found in globals.css`);
  return m[1].toLowerCase();
}

function contrast(a: string, b: string): number {
  const channel = (hex: string, i: number) => {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = (hex: string) =>
    0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
  const [l1, l2] = [lum(a), lum(b)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const INKS = {
  "ink-muted": token("ink-muted"),
  "orange-ink": token("orange-ink"),
  "blue-ink": token("blue-ink"),
  ink: token("ink"),
  "ink-head": token("ink-head"),
};

const WASHES = {
  white: "#ffffff", // Tailwind default, via FILLS.white = "bg-white"
  cream: token("cream"),
  cool: token("cool"),
  sun: token("sun"),
};

const AA = 4.5;

describe("ink-on-wash contrast, as arithmetic rather than prose", () => {
  it("resolves every token it claims to read", () => {
    /* Pinned to the v3 values since CS3 Phase A (2026-08-23): ink-muted is
       --kh-ink-3, cool is --kh-blue-tint, sun is --kh-yellow-tint. orange-ink
       is a site extension and did not move. */
    expect(INKS["ink-muted"]).toBe("#78716c");
    expect(INKS["orange-ink"]).toBe("#b54a0d");
    expect(WASHES.cool).toBe("#e2f3fa");
    expect(WASHES.sun).toBe("#fceeda");
  });

  /* The four inks that are safe anywhere. `orange-ink` being in this list is the
     entire reason §8.24-7 could pick one colour for every label on every wash. */
  it.each(["orange-ink", "blue-ink", "ink", "ink-head"] as const)(
    "%s clears AA on all four washes",
    (ink) => {
      for (const [wash, bg] of Object.entries(WASHES)) {
        expect(
          contrast(INKS[ink], bg),
          `${ink} on ${wash} (${bg})`,
        ).toBeGreaterThanOrEqual(AA);
      }
    },
  );

  /* The ban, asserted as a FAILURE. If a token edit ever made ink-muted legal on
     a tinted wash, this test going red is the signal to revisit §8.24-7 rather
     than to quietly keep a rule that no longer describes the palette. */
  it("confirms ink-muted still fails AA on the two tinted washes the law bans", () => {
    expect(contrast(INKS["ink-muted"], WASHES.cool)).toBeLessThan(AA);
    expect(contrast(INKS["ink-muted"], WASHES.sun)).toBeLessThan(AA);
  });

  it("records that ink-muted remains legal on white and cream, where it is still used", () => {
    expect(contrast(INKS["ink-muted"], WASHES.white)).toBeGreaterThanOrEqual(AA);
    /* cream clears by 0.03. Worth knowing before anyone warms that token up. */
    expect(contrast(INKS["ink-muted"], WASHES.cream)).toBeGreaterThanOrEqual(AA);
    expect(contrast(INKS["ink-muted"], WASHES.cream)).toBeLessThan(4.6);
  });

  it("computes a known ratio correctly, so the maths itself is not the bug", () => {
    // Black on white is exactly 21:1 by definition.
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 5);
    // The live failure this whole change came from.
    expect(contrast("#727272", "#eaf6fc")).toBeCloseTo(4.37, 2);
  });
});
