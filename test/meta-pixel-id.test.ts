import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { META_PIXEL_ID } from "@/config/site";

/**
 * 🔴 THE PIXEL ID AND THE SESSION ENTRY POINT MUST AGREE (§8.41, 2026-09-20).
 *
 * This guard exists because of a gap the migration exposed: **nothing in the
 * suite failed when the pixel ID changed.** The only assertion anywhere was a
 * shape regex, so the ID could drift from every document describing it and the
 * build would stay green — which is precisely how a future reader ends up
 * debugging against a number that has not been true for months.
 *
 * Same shape as the doc-versus-code guard added in §8.40-j, and for the same
 * reason: a claim in a document is worth nothing if the code can contradict it
 * silently.
 *
 * `CLAUDE.md` is checked because it is loaded at the start of every session and
 * is the first thing anyone reads. `docs/checkpoints/` is deliberately EXEMPT:
 * a checkpoint records what was true on its own date, and rewriting history to
 * satisfy a test would destroy the thing checkpoints are for.
 */
const ROOT = process.cwd();
const CLAUDE_MD = readFileSync(join(ROOT, "CLAUDE.md"), "utf8");
const LAWS = readFileSync(join(ROOT, "docs/website-steps.md"), "utf8");

/** Any 15-16 digit run: the shape of a Meta pixel id. */
const PIXEL_SHAPED = /\b\d{15,16}\b/g;

describe("the pixel id cannot drift from the documents", () => {
  it("is the shape Meta issues", () => {
    expect(META_PIXEL_ID).toMatch(/^\d{15,16}$/);
  });

  it("is the id CLAUDE.md names", () => {
    expect(
      CLAUDE_MD,
      `CLAUDE.md does not mention ${META_PIXEL_ID}, so the session entry point is describing a pixel the code no longer uses`,
    ).toContain(META_PIXEL_ID);
  });

  /* The half that actually catches a migration: a STALE id still sitting there.
     Containing the right one is not enough if the wrong one is beside it. */
  it("names no OTHER pixel id in CLAUDE.md", () => {
    /* An id may stay in the file only if it is explicitly marked retired.
       Markdown-tolerant: the docs wrap ids in backticks, so the marker is
       allowed to sit across a backtick and whitespace rather than forcing the
       prose into an unnatural shape to satisfy a regex. */
    const retired = (n: string) => new RegExp(`${n}\`?\\s*\\(retired`).test(CLAUDE_MD);
    const others = [...new Set(CLAUDE_MD.match(PIXEL_SHAPED) ?? [])].filter(
      (n) => n !== META_PIXEL_ID && !retired(n),
    );
    expect(
      others,
      `CLAUDE.md still names ${others.join(", ")} beside the live id ${META_PIXEL_ID}. Mark a retired id "<id> (retired …)" or remove it.`,
    ).toEqual([]);
  });

  it("is the id the §8.30 laws name", () => {
    expect(LAWS).toContain(META_PIXEL_ID);
  });
});
