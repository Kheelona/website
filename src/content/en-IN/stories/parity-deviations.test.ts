import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { CLOSES_ALIKE, COPY_FIXES, STORIES_REMOVED_CARD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { ARTICLE_SLUGS } from "../routes";
import { articles } from "./articles";
import { hubPage, hubTopics } from "./hub";

/* The stories hub's approved parity deviation (wiki/qa/deviations.md V9; D053, task 6.5): the 3-6-9-12 guide left the
 * journal after Gate A, and its card left the hub's screen-time topic with it. The card's rules excuse exactly that
 * card's two lines of the approved hub and hide exactly its row there; the build holds none of its words. V9 as amended
 * in task 7.1b adds the topic's line, which promised that guide (CMO reviews A M5, B m1; COPY_FIXES.stories, proven in
 * src/content/en-IN/pages/parity-deviations.test.ts with the other copy fixes). */

/** Every string of a content module, in order. */
const stringsOf = (value: unknown): string[] =>
  typeof value === "string"
    ? [value]
    : Array.isArray(value)
      ? value.flatMap(stringsOf)
      : value && typeof value === "object"
        ? Object.values(value).flatMap(stringsOf)
        : [];
const TOKEN = buildOffer("token");
const contentSentences = (module: unknown) => stringsOf(module).flatMap((s) => sentences(toPlainText(s, TOKEN)));
const html = readRepoFile("mockup/stories.html");
const hub = new DOMParser().parseFromString(html, "text/html");
const mockupMain = sentences(htmlToText(hub.querySelector("main")!.outerHTML));
/** The later rules on the hub: the topic line's (task 7.1b), then the close's eyebrow and ghost link (task Q2.15, proven in
 *  src/content/en-IN/pages/parity-deviations.test.ts with the consistency review's other pages). */
const LATER = new Set<string>([COPY_FIXES.stories.approvedBy, CLOSES_ALIKE.stories.approvedBy]);
/** The card's rules: every stories rule but the later ones. */
const cardRules = (TEXT_DEVIATIONS.stories ?? []).filter((r) => !LATER.has(r.approvedBy));
const excused = (lines: readonly string[]) => lines.filter((l) => cardRules.some((r) => r.mockup.test(l)));
const accepted = (lines: readonly string[]) => lines.filter((l) => cardRules.some((r) => r.build?.test(l)));
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const { title, summary, selector } = STORIES_REMOVED_CARD;
const titleOf = (row: Element) => norm(row.querySelector(".kh-listitem__title")?.textContent);

describe("stories parity deviations (V9)", () => {
  it("name the approved hub's 3-6-9-12 card: one row, its title and summary as the hub prints them", () => {
    const rows = hub.querySelectorAll(selector);
    expect(rows).toHaveLength(1);
    expect(titleOf(rows[0])).toBe(title);
    expect(norm(rows[0].querySelector(".kh-listitem__sub")?.textContent)).toBe(summary);
  });

  it("are three text rules: the card's, then the topic line's (V9 as amended in task 7.1b), then the close's (task Q2.15)", () => {
    expect(TEXT_DEVIATIONS.stories?.map((r) => r.approvedBy)).toEqual([cardRules[0].approvedBy, COPY_FIXES.stories.approvedBy, CLOSES_ALIKE.stories.approvedBy]);
    expect(cardRules).toHaveLength(1);
  });

  it("excuse exactly the card's two lines of the approved hub's main, and accept nothing of the build", () => {
    expect(excused(mockupMain)).toEqual([title, summary]);
    expect(cardRules.every((r) => r.build === undefined)).toBe(true);
    expect(accepted(contentSentences(hubPage))).toEqual([]);
  });

  it("accept the topic line hub.ts renders for the screen-time topic (task 7.1b), and only that line of the build", () => {
    const [lineRule] = (TEXT_DEVIATIONS.stories ?? []).filter((r) => r.approvedBy === COPY_FIXES.stories.approvedBy);
    expect(contentSentences(hubPage).filter((l) => lineRule.build?.test(l))).toEqual([...COPY_FIXES.stories.build]);
  });

  it("hide the card's row in the approved hub only, leaving the build's screen-time guides in the build's order", () => {
    const cardHides = (VISUAL_HIDDEN.stories ?? []).filter((r) => !LATER.has(r.approvedBy));
    expect(cardHides.map((r) => [r.side, r.selector])).toEqual([["mockup", selector]]);
    // Beside it, only the topic line's hide on both sides (task 7.1b; proven with the other copy fixes).
    const lineHides = (VISUAL_HIDDEN.stories ?? []).filter((r) => r.approvedBy === COPY_FIXES.stories.approvedBy);
    expect(lineHides.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", "#screen-time .kh-heading__lead"],
      ["build", "#screen-time .kh-heading__lead"],
    ]);
    const rest = Array.from(hub.querySelectorAll("section#screen-time li.kh-listitem")).filter((row) => !row.matches(selector));
    const screenTime = hubTopics.find((g) => g.topic === "screen-time")!;
    expect(rest.map(titleOf)).toEqual(screenTime.slugs.map((slug) => toPlainText(articles[slug].card.title)));
  });

  it("cover a card the build no longer has: no hub line and no guide of the URL plan carries its words (D053)", () => {
    const built = contentSentences(hubPage);
    expect(built).not.toContain(title);
    expect(built).not.toContain(summary);
    const cards = ARTICLE_SLUGS.flatMap((slug) => [articles[slug].card.title, articles[slug].card.summary].map((s) => toPlainText(s)));
    expect(cards.filter((line) => line === title || line === summary)).toEqual([]);
  });
});
