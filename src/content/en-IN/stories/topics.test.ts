import { describe, expect, it } from "vitest";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { topics } from "./topics";

/* The stories topics (architecture §6.1; stories.md folds 1-5): id (the hub anchor), title and
 * lead exactly as the approved hub shows them, in its order. */

const hub = new DOMParser().parseFromString(readRepoFile("mockup/stories.html"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("topics", () => {
  it("are the hub's four sections: anchor, heading and lead, in order", () => {
    const sections = Array.from(hub.querySelectorAll("section.mk-topic")).map((s) => ({
      id: s.id,
      title: norm(s.querySelector("h2")?.textContent),
      lead: norm(s.querySelector(".kh-heading__lead")?.textContent),
    }));
    expect(topics.map(({ id, title, lead }) => ({ id, title, lead }))).toEqual(sections);
  });

  it("are the hub's jump links, by the same names (stories.md fold 1)", () => {
    const chips = Array.from(hub.querySelectorAll(".mk-topics a")).map((a) => ({
      id: a.getAttribute("href")?.replace(/^#/, ""),
      title: norm(a.textContent),
    }));
    expect(topics.map(({ id, title }) => ({ id, title }))).toEqual(chips);
  });

  it("are the anchors the three article crumbs link to", () => {
    for (const slug of [
      "story-learning-toys-for-a-three-year-old",
      "story-what-to-look-for-in-a-safe-ai-toy",
      "story-talking-toys-and-late-talkers",
    ]) {
      const page = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
      const crumb = Array.from(page.querySelectorAll(".mk-crumbs a")).at(-1)!;
      const topic = topics.find((t) => `stories.html#${t.id}` === crumb.getAttribute("href"));
      expect(topic?.title, slug).toBe(norm(crumb.textContent));
    }
  });
});
