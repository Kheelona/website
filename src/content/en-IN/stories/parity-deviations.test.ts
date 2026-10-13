import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { STORIES_REMOVED_CARD, TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import { sentences } from "../../../../test/e2e/support/parity";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { ARTICLE_SLUGS } from "../routes";
import { articles } from "./articles";
import { hubPage, hubTopics } from "./hub";

/* The stories hub's approved parity deviation (wiki/qa/deviations.md V9; D053, task 6.5): the 3-6-9-12 guide left the
 * journal after Gate A, and its card left the hub's screen-time topic with it. The rules excuse exactly that card's two
 * lines of the approved hub and hide exactly its row there; the build holds none of its words. */

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
const excused = (lines: readonly string[]) => lines.filter((l) => (TEXT_DEVIATIONS.stories ?? []).some((r) => r.mockup.test(l)));
const accepted = (lines: readonly string[]) => lines.filter((l) => (TEXT_DEVIATIONS.stories ?? []).some((r) => r.build?.test(l)));
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

  it("excuse exactly the card's two lines of the approved hub's main, and accept nothing of the build", () => {
    expect(excused(mockupMain)).toEqual([title, summary]);
    expect(TEXT_DEVIATIONS.stories?.every((r) => r.build === undefined)).toBe(true);
    expect(accepted(contentSentences(hubPage))).toEqual([]);
  });

  it("hide the card's row in the approved hub only, leaving the build's screen-time guides in the build's order", () => {
    expect(VISUAL_HIDDEN.stories?.map((r) => [r.side, r.selector])).toEqual([["mockup", selector]]);
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
