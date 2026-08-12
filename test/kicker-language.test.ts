import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * §8.24-7: every 12 to 13px uppercase tracked label renders in `orange-ink`.
 * `ink-muted` is banned at that size, because it measures 4.37:1 on the `cool`
 * wash and 4.32:1 on `sun` against a 4.5:1 requirement.
 *
 * The founder set that rule on 2026-07-31, and NINE call sites escaped it. One
 * of them — the "Recognised by" label on /playos — was a live WCAG AA failure
 * on kheelona.com for weeks, because /playos was never in the V6 axe sweep.
 *
 * WHY THIS GUARD HAS TWO RULES. The obvious single rule is "no class string
 * holds 13px + uppercase + ink-muted together". That rule is worth having, and
 * it would have caught eight of the nine — but it could NOT have caught the one
 * that was actually broken in production. `RecognitionStrip` passed
 * `color="text-ink-muted"` into the `Eyebrow` atom, and Eyebrow's own
 * `text-[13px] ... uppercase` cluster lives in a different file, so the two
 * strings never appear together anywhere. Rule B exists for exactly that
 * composition. A guard that only catches the easy eight is worse than no guard,
 * because it reads like proof.
 */

const ROOT = process.cwd();

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.tsx$/.test(entry) && !/\.(test|stories)\.tsx$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const FILES = sourceFiles(join(ROOT, "src"));

/** The contents of every `className="…"` and `className={`…`}` attribute.
 *
 *  Parsed as ATTRIBUTES, never as raw file text. Two files already contain the
 *  literal string "text-ink-muted" inside explanatory comments that also
 *  mention 13px (`FamilyGrid.tsx`, `FootnotesRow.tsx`), so a proximity match
 *  over raw source would fail on a comment while the markup was fine. */
function classAttributes(src: string): string[] {
  const found: string[] = [];
  for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    found.push(m[1] ?? m[2] ?? "");
  }
  return found;
}

const SMALL = /^text-\[1[23]px\]$/;

describe("§8.24-7: one kicker language", () => {
  it("reads a meaningful number of source files", () => {
    expect(FILES.length).toBeGreaterThan(40);
  });

  // Rule A — the class-string case.
  it("has no 12 to 13px uppercase label carrying ink-muted", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      for (const attr of classAttributes(readFileSync(file, "utf8"))) {
        const tokens = new Set(attr.split(/\s+/).filter(Boolean));
        const isSmall = [...tokens].some((t) => SMALL.test(t));
        if (isSmall && tokens.has("uppercase") && tokens.has("text-ink-muted")) {
          offenders.push(`${file.replace(ROOT + "/", "")}: ${attr}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  // Rule B — the composed case. THIS is the one that catches the real bug.
  it("never passes ink-muted into Eyebrow or SectionHeading's eyebrowColor", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(/<Eyebrow\b[^>]*>/g)) {
        if (m[0].includes("text-ink-muted")) {
          offenders.push(`${file.replace(ROOT + "/", "")}: ${m[0]}`);
        }
      }
      for (const m of src.matchAll(/eyebrowColor=(?:"([^"]*)"|\{"([^"]*)"\})/g)) {
        if ((m[1] ?? m[2] ?? "").includes("text-ink-muted")) {
          offenders.push(`${file.replace(ROOT + "/", "")}: eyebrowColor=${m[1] ?? m[2]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  /* Proves the rules can actually fail. A guard nobody has seen go red is a
     guard nobody should trust — and Rule A's tokenisation and Rule B's JSX
     match are both easy to write in a way that silently matches nothing. */
  it("both rules detect a planted violation", () => {
    const badClass = "mt-1 text-[13px] font-bold uppercase tracking-wide text-ink-muted";
    const tokens = new Set(badClass.split(/\s+/));
    expect(
      [...tokens].some((t) => SMALL.test(t)) &&
        tokens.has("uppercase") &&
        tokens.has("text-ink-muted"),
    ).toBe(true);

    const badJsx = `<Eyebrow color="text-ink-muted" className="mb-0">`;
    expect([...badJsx.matchAll(/<Eyebrow\b[^>]*>/g)][0][0]).toContain("text-ink-muted");
  });

  /* The class attributes really are being extracted; if the regex broke, every
     assertion above would pass vacuously. */
  it("actually finds class attributes to inspect", () => {
    const all = FILES.flatMap((f) => classAttributes(readFileSync(f, "utf8")));
    expect(all.length).toBeGreaterThan(200);
    expect(all.some((a) => a.includes("uppercase"))).toBe(true);
    expect(all.some((a) => a.includes("text-orange-ink"))).toBe(true);
  });
});
