/* Visual and text parity helpers (task 1.1; ADR-011, tasks.md SPA 1 and 2, test plan §4.9).
 *
 * Visual: page height within 2 percent first, then each screen-height chunk at most 2 percent
 * differing pixels (Playwright's comparator, default per-pixel threshold). Chunks are viewport-size
 * screenshots taken after scrolling, because full-page captures over about 16k px clip or tile
 * (lessons §7). Text: the visible text of <main>, normalised, compared sentence by sentence.
 */
import type { Page } from "@playwright/test";
import { REVIEW_TOOL_SELECTOR } from "./mockup-text";

export const HEIGHT_TOLERANCE = 0.02;
export const CHUNK_MAX_DIFF_RATIO = 0.02;

export async function pageHeight(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollHeight);
}

/** Screen-height screenshots from the top: chunk i shows the page from y = i × viewport height. */
export async function captureChunks(page: Page, maxChunks = 40): Promise<Buffer[]> {
  const vh = page.viewportSize()?.height ?? 800;
  const height = await pageHeight(page);
  const out: Buffer[] = [];
  // Every image decoded once, up front, so a chunk never catches one mid-decode.
  // Only loaded images (a lazy image that never started would never settle), and never > 5 s.
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth > 0)
          .map((img) => img.decode().catch(() => undefined)),
      ),
      new Promise((done) => setTimeout(done, 5000)),
    ]).then(() => undefined),
  );
  for (let i = 0; i * vh < height && i < maxChunks; i++) {
    await page.evaluate(
      (y) =>
        new Promise<void>((done) => {
          window.scrollTo({ top: y, behavior: "instant" });
          requestAnimationFrame(() => requestAnimationFrame(() => done()));
        }),
      i * vh,
    );
    await page.waitForTimeout(150);
    out.push(await page.screenshot({ animations: "disabled", caret: "hide", scale: "css" }));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return out;
}

/** Text normalisation for parity: Unicode NFC, spaces collapsed, invisible characters dropped. */
export function normaliseText(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[­​‌‍﻿]/g, "")
    .replace(/[    ]/g, " ")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

/** Sentences of a normalised text, so line-break differences between mockup and build do not count. */
export function sentences(text: string): string[] {
  return text
    .split(/\n|(?<=[.?!])\s+(?=[A-Z0-9₹“"‘(\[])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** The visible text of <main>, with the review tool hidden (it is mockup-only). */
export async function mainText(page: Page): Promise<string> {
  const raw = await page.evaluate((reviewTool) => {
    document.querySelectorAll<HTMLElement>(reviewTool).forEach((el) => (el.style.display = "none"));
    const main = document.querySelector("main");
    return main ? main.innerText : "";
  }, REVIEW_TOOL_SELECTOR);
  return normaliseText(raw);
}

/** Sentence-level difference: what the mockup has that the build lacks, and the reverse. */
export function sentenceDiff(mockup: string[], build: string[]): { missing: string[]; extra: string[] } {
  const count = (list: string[]) => list.reduce((m, s) => m.set(s, (m.get(s) ?? 0) + 1), new Map<string, number>());
  const a = count(mockup);
  const b = count(build);
  const missing: string[] = [];
  const extra: string[] = [];
  for (const [s, n] of a) for (let i = 0; i < n - (b.get(s) ?? 0); i++) missing.push(s);
  for (const [s, n] of b) for (let i = 0; i < n - (a.get(s) ?? 0); i++) extra.push(s);
  return { missing, extra };
}
