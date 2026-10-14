import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { readRepoFile, ROOT } from "../../../../test/e2e/support/repo";
import { withFacts } from "../../../../test/support/mockup-facts";
import { articles } from "./articles";
import { hubTopics } from "./hub";
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

/* What a topic decides for every guide on it (ADR-014; journal-pipeline §4: `close` and `answer.detail` are derived
 * from the topic, never stored in a post): the close (B5: the talking guides carry no pre-order button) and the D025
 * line under the answer (D025: a guide about speech keeps the one-line disclaimer). Until the journal comes from the
 * dashboard (task 8b.2e), every guide module states both, so each is held to its topic here. */
describe("what a topic decides for its guides", () => {
  const guidesOf = (id: string) => {
    const group = hubTopics.find((g) => g.topic === id)!;
    return [...(group.featured ? [group.featured] : []), ...group.slugs].map((slug) => articles[slug]);
  };

  it("names each topic's close: keep for talking and language (B5), the journal close for the rest", () => {
    expect(Object.fromEntries(topics.map((t) => [t.id, t.close]))).toEqual({
      "screen-time": "journal",
      talking: "keep",
      "ai-and-safety": "journal",
      learning: "journal",
    });
  });

  it("is the close of every guide the hub lists under the topic", () => {
    for (const topic of topics) for (const guide of guidesOf(topic.id)) expect(guide.close, guide.slug).toBe(topic.close);
  });

  it("holds D025's line once, on the talking topic: the line every talking guide prints last under its answer", () => {
    const talking = topics.find((t) => t.id === "talking")!;
    expect(talking.disclaimer).toBe("Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.");
    for (const guide of guidesOf("talking")) expect(guide.answer?.detail?.at(-1), guide.slug).toEqual({ kind: "disclaimer", text: talking.disclaimer });
  });

  it("puts no D025 line on the other topics, and no guide of theirs prints one", () => {
    for (const topic of topics.filter((t) => t.id !== "talking")) {
      expect("disclaimer" in topic, topic.id).toBe(false);
      for (const guide of guidesOf(topic.id)) {
        expect(JSON.stringify(guide.answer?.detail ?? []), guide.slug).not.toContain('"kind":"disclaimer"');
      }
    }
  });

  it("are the dashboard's four themes by their titles, each once (journal-pipeline §3, B1)", () => {
    expect(topics.map((t) => t.title)).toEqual(["Screen time", "Talking and language", "AI toys and safety", "Learning and play"]);
  });
});

/* scripts/journal/sync-posts.mjs imports this file with Node's type stripping (its RULES.themes): an import, an enum
   or a namespace here would break the prebuild sync (journal-pipeline §2.2). */
describe("topics.ts stays importable by the sync script", () => {
  const path = "src/content/en-IN/stories/topics.ts";

  it("has no imports", () => {
    const source = readRepoFile(path);
    expect(source).not.toMatch(/^\s*import\b/m);
    expect(source).not.toMatch(/\bfrom\s+["']/);
    expect(source).not.toMatch(/\brequire\(|\bimport\(/);
  });

  it("loads in plain Node 24 with type stripping, with nothing but the file", () => {
    const script = `const m = await import(${JSON.stringify(join(ROOT, path))}); process.stdout.write(JSON.stringify(m.topics.map((t) => [t.title, t.close])));`;
    const out = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "--eval", script], {
      encoding: "utf8",
      env: { PATH: process.env.PATH ?? "", NODE_ENV: "test" },
    });
    expect(out.stderr).toBe("");
    expect(JSON.parse(out.stdout)).toEqual(topics.map((t) => [t.title, t.close]));
  });
});
