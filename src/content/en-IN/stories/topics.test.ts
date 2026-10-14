import { describe, expect, it } from "vitest";
import { COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { withFacts } from "../../../../test/support/mockup-facts";
import { topics } from "./topics";

/* The stories topics (architecture §6.1; stories.md folds 1-5): id (the hub anchor), title and
 * lead exactly as the approved hub shows them, in its order, with the screen-time line that task 7.1b
 * changed (CMO reviews A M5, B m1; deviation V9 as amended; deviations.ts COPY_FIXES.stories). */

const hub = new DOMParser().parseFromString(readRepoFile("mockup/stories.html"), "text/html");
const approvedHub = withFacts(hub.querySelector("main")!, COPY_FIXES.stories.edits);
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("topics", () => {
  it("are the hub's four sections: anchor, heading and lead, in order", () => {
    const sections = Array.from(approvedHub.querySelectorAll("section.mk-topic")).map((s) => ({
      id: s.id,
      title: norm(s.querySelector("h2")?.textContent),
      lead: norm(s.querySelector(".kh-heading__lead")?.textContent),
    }));
    expect(topics.map(({ id, title, lead }) => ({ id, title, lead }))).toEqual(sections);
  });

  it("change only the screen-time line from the frozen hub (task 7.1b)", () => {
    const leads = (root: ParentNode) => Array.from(root.querySelectorAll("section.mk-topic .kh-heading__lead")).map((p) => norm(p.textContent));
    const frozen = leads(hub);
    expect(frozen[0]).toBe(COPY_FIXES.stories.mockup[0]);
    expect(leads(approvedHub)).toEqual([COPY_FIXES.stories.build[0], ...frozen.slice(1)]);
    expect(topics[0].lead).toBe(COPY_FIXES.stories.build[0]);
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
