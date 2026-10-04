import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * §8.29: every label on the orange action fill is WHITE.
 *
 * Founder decision, 2026-08-24, reversing V4 D1. It was taken with the
 * arithmetic in front of it: white on `#EF762F` is 2.88:1 and fails WCAG AA at
 * every size, and the passing alternative (`orange-cta` `#C25210`, white at
 * 4.66:1) was declined in order to keep brand orange exactly as the deck
 * specifies. The ratio itself is pinned in `test/contrast-tokens.test.ts`; this
 * file pins the RULE, so the site cannot drift back to a mixed state where some
 * CTAs are white-labelled and some are not.
 *
 * WHY A GUARD AND NOT A TOKEN. The obvious alternative was a
 * `--color-action-label` token. It was rejected deliberately: `--color-action-ink`
 * already exists and means something entirely different (orange TEXT on a light
 * wash, which still has to clear 4.5:1 and is untouched by this decision). A
 * second ink-ish name beside it is exactly the mix-up those slots exist to
 * prevent, and on a live payment site that mistake costs contrast on a real
 * checkout button.
 *
 * WHY TWO RULES. Rule A catches the common case, a single class string holding
 * both. It cannot catch a call site that passes an ink colour INTO the Button
 * atom through `className`, because the fill and the label would then live in
 * different files and never appear in the same string — the same composition
 * blind spot that let a live WCAG failure survive in `RecognitionStrip` for
 * weeks (see `kicker-language.test.ts`). Rule B exists for that.
 */

const ROOT = process.cwd();

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.tsx?$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** Comments are stripped before scanning. This file's own rule is described in
 *  prose inside `Button.tsx`, and a guard that trips on the documentation of
 *  the thing it guards is a guard nobody keeps. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const FILES = sourceFiles(join(ROOT, "src")).map((path) => ({
  path: path.slice(ROOT.length + 1),
  src: stripComments(readFileSync(path, "utf8")),
}));

/** The ink colours that must never label an orange fill. */
const INK_LABELS = ["text-ink-head", "text-ink-muted", "text-ink "];

describe("§8.29: labels on the action fill are white", () => {
  it("finds source files to scan, so a silent empty pass is impossible", () => {
    expect(FILES.length).toBeGreaterThan(50);
    expect(FILES.some((f) => f.path.endsWith("components/atoms/Button.tsx"))).toBe(true);
  });

  /* Rule A: the fill and an ink label in one class string. */
  it("has no class string putting an ink label on bg-action", () => {
    const offenders: string[] = [];
    for (const { path, src } of FILES) {
      src.split("\n").forEach((line, i) => {
        if (!line.includes("bg-action")) return;
        if (INK_LABELS.some((ink) => line.includes(ink))) {
          offenders.push(`${path}:${i + 1}`);
        }
      });
    }
    expect(offenders, `ink label on the action fill at:\n${offenders.join("\n")}`).toEqual([]);
  });

  /* Rule B: an ink label composed INTO the button from a call site. */
  it("has no Button call site overriding the label colour with ink", () => {
    const offenders: string[] = [];
    for (const { path, src } of FILES) {
      /* Each <Button …> opening tag, attributes and all, across line breaks. */
      for (const tag of src.match(/<Button\b[^>]*>/gs) ?? []) {
        if (INK_LABELS.some((ink) => tag.includes(ink))) {
          offenders.push(`${path}: ${tag.replace(/\s+/g, " ").slice(0, 90)}`);
        }
      }
    }
    expect(offenders, `Button given an ink label at:\n${offenders.join("\n")}`).toEqual([]);
  });

  /* The positive half: the atom every CTA routes through actually says white.
     Rules A and B are both satisfied by deleting all the colours, so one
     assertion has to state what the right answer IS. */
  it("keeps the white label on the Button atom's filled variants", () => {
    const button = FILES.find((f) => f.path.endsWith("components/atoms/Button.tsx"))!.src;
    const variants = button.match(/const VARIANTS[\s\S]*?\n};/)?.[0];
    expect(variants, "Button.tsx no longer declares a VARIANTS map").toBeTruthy();
    const filled = variants!.split("\n").filter((line) => line.includes("bg-action"));
    // primary and onDark
    expect(filled.length).toBe(2);
    for (const line of filled) expect(line).toContain("text-white");
  });
});
