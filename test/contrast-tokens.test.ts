import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The palette's text-on-surface pairs, in runnable form, for BOTH themes.
 *
 * A colour rule written only in prose gets applied unevenly, so the matrix
 * below is the arithmetic: if someone lightens a surface or darkens an ink,
 * this says which pair changed side rather than leaving it to the next axe
 * sweep to notice, or not.
 *
 * Redesign 2026-10 (the parent-first mockup, tokens v4). Every text colour
 * the site uses clears WCAG AA (4.5:1) on every surface it can sit on, in
 * light AND dark. That retires §8.29's accepted 2.88:1 white-on-orange
 * exception: the orange fill is gone, and primary buttons are ink with a
 * page-coloured label (14:1 and up).
 */

const ROOT = process.cwd();
const CSS = readFileSync(join(ROOT, "src/styles/globals.css"), "utf8");

const THEME = CSS.slice(CSS.indexOf("@theme {"));
const darkAt = CSS.indexOf(':root[data-theme="dark"] {');
const DARK = CSS.slice(darkAt, CSS.indexOf("}", darkAt));
const mqAt = CSS.indexOf("@media (prefers-color-scheme: dark)");
const MEDIA_DARK = CSS.slice(mqAt, CSS.indexOf(':root[data-theme="dark"]', mqAt));

function read(block: string, name: string): string {
  const m = block.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`--color-${name} not found`);
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

const AA = 4.5;
const TEXTS = ["ink", "ink-muted", "label", "err", "green"] as const;
const SURFACES = ["bg", "surface", "soft", "blush", "sage", "lav"] as const;

/* `accent` and `on-accent` are not redefined in dark: the finale band and the
   pill keep their fixed colours in both themes. */
const light = (n: string) => read(THEME, n);
const dark = (n: string) => {
  try {
    return read(DARK, n);
  } catch {
    return light(n);
  }
};

describe.each([
  ["light", light],
  ["dark", dark],
] as const)("%s theme: text on every surface clears AA", (_name, tok) => {
  for (const text of TEXTS) {
    for (const surface of SURFACES) {
      it(`${text} on ${surface}`, () => {
        expect(contrast(tok(text), tok(surface))).toBeGreaterThanOrEqual(AA);
      });
    }
  }

  it("the primary button: page colour on the ink fill", () => {
    expect(contrast(tok("bg"), tok("ink-head"))).toBeGreaterThanOrEqual(AA);
    // `text-white` on `bg-action` resolves to surface on ink
    expect(contrast(tok("surface"), tok("ink-head"))).toBeGreaterThanOrEqual(AA);
  });

  it("the WhatsApp button: on-green on green", () => {
    expect(contrast(tok("on-green"), tok("green"))).toBeGreaterThanOrEqual(AA);
  });

  it("the accent pill and finale: on-accent on accent", () => {
    expect(contrast(tok("on-accent"), tok("accent"))).toBeGreaterThanOrEqual(AA);
  });
});

describe("the two dark blocks agree", () => {
  /* The dark palette is written twice (the OS preference and the forced
     data-theme), because CSS cannot share one declaration block between a
     media query and a selector. This keeps the copies identical. */
  it("prefers-color-scheme and data-theme=dark carry the same values", () => {
    const names = [...DARK.matchAll(/--color-([a-z-]+):/g)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(10);
    for (const n of names) expect(read(MEDIA_DARK, n), n).toBe(read(DARK, n));
  });
});
