import { describe, expect, it } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import { TEAM_BYLINE } from "@/content/en-IN/organization";
import { articles } from "@/content/en-IN/stories/articles";
import { hubTopics } from "@/content/en-IN/stories/hub";
import { photos } from "@/content/en-IN/stories/photos";
import { topics } from "@/content/en-IN/stories/topics";
import type { Article, ArticlePart, ProseBlock } from "@/content/types";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { VOCABULARY } from "../../../test/fixtures/journal/vocabulary";
import { articleToPost, type ExportContext } from "./from-article";
import type { Post } from "./post";
import { readMinutes } from "./read-minutes";
import { postToArticle } from "./to-article";
import { editorialWarnings, POSES, TINTS, validatePosts, type JournalRules } from "./validate";

/**
 * The export (journal-pipeline §9.3): a guide module as a dashboard post, so the 20 rewritten guides can be written
 * into the snapshot (task 8b.2e) and imported into the dashboard after Gate B. Deleted with the modules. Its proof is
 * the round trip (§8.3): for every module, `postToArticle(articleToPost(m))` equals the module except the derivations
 * a post never stores (read time, no-wrap spans), whose differences are listed below for the main session to rule.
 */

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };
const GUIDES = Object.values(articles) as Article[];
const SLUGS = new Set(GUIDES.map((a) => a.slug));

/** A guide's topic title: the hub lists it under its topic (hub.ts), whose title is the post's theme. */
function themeOf(slug: string): string {
  const group = hubTopics.find((g) => g.featured === slug || (g.slugs as readonly string[]).includes(slug));
  return topics.find((t) => t.id === group?.topic)!.title;
}
const context = (slug: string): ExportContext => ({ theme: themeOf(slug), pose: POSES[0], tint: TINTS[0], vocabulary: VOCABULARY });
const exportOf = (article: Article) => articleToPost(article, context(article.slug));
const back = (post: Post) => postToArticle(post, { vocabulary: VOCABULARY, published: SLUGS, warn: () => {} });

/* ── A small guide to read the map on ─────────────────────────────────────────────────────────────── */

const { image: crown, card: crownCard } = photos["ira-04-paper-crown"];
const guide = (over: Partial<Article> = {}): Article => ({
  slug: "learning-toys-for-a-three-year-old",
  meta: { title: "Toys for a 3-year-old, skill by skill · Kheelona", description: "A description.", og: { image: crownCard!, alt: crown.alt } },
  card: { title: "Toys for a 3-year-old, skill by skill", summary: "The lead, as written." },
  related: ["should-kids-use-ai", "busy-hands-no-screens", "how-children-collect-words"],
  published: "2026-09-01",
  updated: "2026-09-02",
  head: { title: "Toys for a {nowrap:3-year-old,} {hand:skill by skill}", lead: "The lead, as written.", author: TEAM_BYLINE, readMinutes: 3, image: crown },
  answer: { question: "What is it for a {nowrap:3-year-old}?", answer: "An answer with a marker.[^1]" },
  body: [{ kind: "part", title: "A part", blocks: [{ kind: "p", text: "Words.[^1]" }] }],
  sources: [{ citation: "A source.", href: "https://example.org/a" }],
  close: "journal",
  ...over,
});
const nodes = (article: Article) => exportOf(article).body.content;
const part = (blocks: ProseBlock[], extra: Partial<ArticlePart> = {}): ArticlePart => ({ kind: "part", title: "A part", blocks, ...extra });

describe("articleToPost: the field map back (journal-pipeline §9.3)", () => {
  const post = exportOf(guide());

  it("writes the h1 without tokens as the title and its hand-lettered phrase as the accent", () => {
    expect(post.title).toBe("Toys for a 3-year-old, skill by skill");
    expect(post.accent).toBe("skill by skill");
  });

  it("leaves out what the adapter derives: a <title> that is the h1 and the site's name, a card title that is the h1, a summary that is the lead", () => {
    expect([post.metaTitle, post.cardTitle, post.summary]).toEqual([null, null, null]);
    const own = exportOf(guide({ meta: { ...guide().meta, title: "Learning toys for a 3-year-old" }, card: { title: "A card title", summary: "A card line." } }));
    expect([own.metaTitle, own.cardTitle, own.summary]).toEqual(["Learning toys for a 3-year-old", "A card title", "A card line."]);
  });

  it("writes the lead, the description, the dates, the related guides and the sources (citation → label, href → url)", () => {
    expect(post).toMatchObject({
      lead: "The lead, as written.",
      description: "A description.",
      published: "2026-09-01",
      updated: "2026-09-02",
      related: ["should-kids-use-ai", "busy-hands-no-screens", "how-children-collect-words"],
      sources: [{ label: "A source.", url: "https://example.org/a" }],
    });
  });

  it("names the topic by its title, the team as \"Kheelona\", the head photo by key with its alt, and no cover", () => {
    expect(post).toMatchObject({ theme: "Learning and play", author: "Kheelona", photo: "ira-04-paper-crown", hero: null, heroAlt: crown.alt, heroWidth: null, heroHeight: null });
    expect(exportOf(guide({ head: { ...guide().head, author: "Aman Soni" } })).author).toBe("Aman Soni");
  });

  it("copies the pose and the tint from the live post it replaces (main's validator still reads them)", () => {
    expect(articleToPost(guide(), { ...context("learning-toys-for-a-three-year-old"), pose: "joy", tint: "bg-orange/15" })).toMatchObject({ pose: "joy", tint: "bg-orange/15" });
  });

  it("writes the answer without its no-wrap spans; its tokens kept", () => {
    expect(post.answer).toEqual({ question: "What is it for a 3-year-old?", text: "An answer with a marker.[^1]" });
  });

  it("drops D025's line from a talking guide's answer, since the topic prints it", () => {
    const talking = articles["talking-toys-and-late-talkers"] as Article;
    const exported = exportOf(talking);
    expect(JSON.stringify(exported)).not.toContain("not a therapy or treatment");
    expect(exported.body.content[0].type).not.toBe("horizontalRule");
  });

  it("writes the answer's other detail above a rule that opens the body, so it returns to the answer card", () => {
    const detailed = guide({ answer: { ...guide().answer!, detail: [{ kind: "p", text: "A detail line." }] } });
    expect(nodes(detailed).slice(0, 3)).toEqual([
      { type: "paragraph", content: [{ type: "text", text: "A detail line." }] },
      { type: "horizontalRule" },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "A part" }] },
    ]);
  });

  it("writes an age note from a disclaimer line that ends the body", () => {
    const noted = guide({ body: [part([{ kind: "p", text: "Words.[^1]" }, { kind: "disclaimer", text: "Ages 3 to 7." }])] });
    const exported = exportOf(noted);
    expect(exported.ageNote).toBe("Ages 3 to 7.");
    expect(exported.body.content).toHaveLength(2);
  });
});

describe("articleToPost: the body map back (journal-pipeline §5)", () => {
  it("opens each titled part with an h2 (its id the anchor), an untitled first part with nothing, a later one with a rule", () => {
    const body = [part([{ kind: "p", text: "Intro." }], { title: undefined }), part([{ kind: "p", text: "A." }], { id: "a-part" }), part([{ kind: "p", text: "B." }], { title: undefined })];
    expect(nodes(guide({ body }))).toEqual([
      { type: "paragraph", content: [{ type: "text", text: "Intro." }] },
      { type: "heading", attrs: { level: 2, anchor: "a-part" }, content: [{ type: "text", text: "A part" }] },
      { type: "paragraph", content: [{ type: "text", text: "A." }] },
      { type: "horizontalRule" },
      { type: "paragraph", content: [{ type: "text", text: "B." }] },
    ]);
  });

  it("writes a lead-in bold, a gut line all bold, links as link marks, and the tokens as text; no-wrap spans dropped", () => {
    const blocks: ProseBlock[] = [
      { kind: "p", lead: "Try this:", text: "read [the guide](/stories) to a {nowrap:3-year-old}.[^1]" },
      { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
      { kind: "p", text: "It costs {price:headline} and ships {delivery}." },
    ];
    expect(nodes(guide({ body: [part(blocks)] })).slice(1)).toEqual([
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Try this:", marks: [{ type: "bold" }] },
          { type: "text", text: " read " },
          { type: "text", text: "the guide", marks: [{ type: "link", attrs: { href: "/stories" } }] },
          { type: "text", text: " to a 3-year-old.[^1]" },
        ],
      },
      { type: "paragraph", content: [{ type: "text", text: "If your gut says ask, ask.", marks: [{ type: "bold" }] }] },
      { type: "paragraph", content: [{ type: "text", text: "It costs {price:headline} and ships {delivery}." }] },
    ]);
  });

  it("writes lists by style, items with their lead-ins and icons; facts with titles and their photo after them", () => {
    const blocks: ProseBlock[] = [
      { kind: "list", items: ["One.", { lead: "Two.", text: "Then three." }] },
      { kind: "list", variant: "checks", items: ["Checked."] },
      { kind: "list", variant: "tips", items: [{ text: "A tip.", icon: "clock" }] },
      { kind: "list", variant: "steps", items: ["First."] },
      { kind: "facts", items: [{ icon: "microphone", title: "A fact.", body: "Its words." }, { icon: "lock-simple", body: "No title." }], figure: photos["kheelu-belly-module"].image },
    ];
    const item = (content: unknown[], icon?: string) => ({ type: "listItem", ...(icon && { attrs: { icon } }), content });
    const para = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] });
    expect(nodes(guide({ body: [part(blocks, { variant: "breakout" })] })).slice(1)).toEqual([
      {
        type: "bulletList",
        content: [item([para("One.")]), item([{ type: "paragraph", content: [{ type: "text", text: "Two.", marks: [{ type: "bold" }] }, { type: "text", text: " Then three." }] }])],
      },
      { type: "bulletList", attrs: { style: "checks" }, content: [item([para("Checked.")])] },
      { type: "bulletList", attrs: { style: "tips" }, content: [item([para("A tip.")], "clock")] },
      { type: "orderedList", content: [item([para("First.")])] },
      {
        type: "bulletList",
        attrs: { style: "facts" },
        content: [
          item([{ type: "paragraph", content: [{ type: "text", text: "A fact.", marks: [{ type: "bold" }] }, { type: "text", text: " Its words." }] }], "microphone"),
          item([para("No title.")], "lock-simple"),
        ],
      },
      { type: "image", attrs: { src: "", alt: photos["kheelu-belly-module"].image.alt, caption: "", width: null, height: null, photo: "kheelu-belly-module" } },
    ]);
  });

  it("writes a callout and a group of questions as blockquotes, an h3 as a level-3 heading, a video as a videoEmbed", () => {
    const blocks: ProseBlock[] = [
      { kind: "h3", text: "A smaller heading" },
      { kind: "callout", icon: "book-open", lead: "Try this:", text: "pause." },
      { kind: "questions", items: [{ question: "Is it on?", answer: ["Ask.", "Then check."] }] },
      { kind: "video", provider: "youtube", videoId: "abcDEF12345", title: "A film" },
    ];
    expect(nodes(guide({ body: [part(blocks)] })).slice(1)).toEqual([
      { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "A smaller heading" }] },
      {
        type: "blockquote",
        attrs: { style: "callout", icon: "book-open" },
        content: [{ type: "paragraph", content: [{ type: "text", text: "Try this:", marks: [{ type: "bold" }] }, { type: "text", text: " pause." }] }],
      },
      {
        type: "blockquote",
        attrs: { style: "questions" },
        content: [
          { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Is it on?" }] },
          { type: "paragraph", content: [{ type: "text", text: "Ask." }] },
          { type: "paragraph", content: [{ type: "text", text: "Then check." }] },
        ],
      },
      { type: "videoEmbed", attrs: { provider: "youtube", videoId: "abcDEF12345", title: "A film", caption: "" } },
    ]);
  });

  it("writes a photo between parts as an image right before the next h2, by its key", () => {
    const body: Article["body"] = [part([{ kind: "p", text: "A." }]), { kind: "figure", variant: "wide", image: photos["advik-04-floor-train"].image }, part([{ kind: "p", text: "B." }], { title: "Next" })];
    expect(nodes(guide({ body })).slice(2, 4)).toEqual([
      { type: "image", attrs: { src: "", alt: photos["advik-04-floor-train"].image.alt, caption: "", width: null, height: null, photo: "advik-04-floor-train" } },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Next" }] },
    ]);
  });
});

describe("articleToPost refuses what a post cannot say, rather than lose it", () => {
  const refuses = (over: Partial<Article>, message: string) => expect(() => exportOf(guide(over))).toThrow(message);

  it("a quote, a toned callout, an accent or a marked word in the body, a link in the answer", () => {
    refuses({ body: [part([{ kind: "quote", quote: "Hi.", cite: "A parent" }])] }, 'guide "learning-toys-for-a-three-year-old": body[0].blocks[0]: a quote has no post node');
    refuses({ body: [part([{ kind: "callout", icon: "star", tone: "blue", text: "Hi." }])] }, "body[0].blocks[0]: a callout's tone has no post attribute");
    refuses({ body: [part([{ kind: "p", text: "A {mark:word}." }])] }, 'body[0].blocks[0]: "{mark:…}" has no post form');
    refuses({ answer: { question: "Why?", answer: "See [the guide](/stories)." } }, "answer: a link has no post form in the answer");
  });

  it("a photo between parts that no h2 follows, a part's last photo before an h2, an anchor on an untitled part, a breakout without facts", () => {
    const figure = { kind: "figure" as const, image: crown };
    refuses({ body: [part([{ kind: "p", text: "A." }]), figure] }, "body[1]: a photo between parts needs an h2 after it");
    refuses({ body: [part([{ kind: "p", text: "A." }, figure]), part([{ kind: "p", text: "B." }])] }, "body[0].blocks[1]: a photo that ends a part would show between the parts");
    refuses({ body: [part([{ kind: "p", text: "A." }], { title: undefined, id: "x" })] }, "body[0]: only a titled part takes an anchor");
    refuses({ body: [part([{ kind: "p", text: "A." }], { variant: "breakout" })] }, "body[0]: a part breaks out only around a facts list");
  });

  it("a photo the table does not hold, a byline the site does not list, a close or a D025 line its topic does not give", () => {
    refuses({ head: { ...guide().head, image: { src: "/x.jpg", width: 10, height: 10, alt: "x" } } }, "the head photo is not in the photo table");
    refuses({ head: { ...guide().head, author: "Someone" } }, 'the byline "Someone" is not one the site lists');
    refuses({ close: "keep" }, 'the close "keep" is not its topic\'s ("journal")');
    refuses({ answer: { ...guide().answer!, detail: [{ kind: "disclaimer", text: "A toy." }] } }, "answer.detail[0]: a disclaimer has no post form here");
  });
});

/* ── The 20 guides: the export passes the gate, and the round trip ──────────────────────────────── */

describe("the 20 guides exported (journal-pipeline §9.3)", () => {
  const posts = GUIDES.map(exportOf);

  it("exports every guide of the registry", () => {
    expect(posts.map((p) => p.slug)).toEqual(GUIDES.map((a) => a.slug));
    expect(posts).toHaveLength(20);
  });

  it("passes the gate a build runs on the snapshot: structure, tokens, links, banned claims (§8.2 prebuild rows)", () => {
    expect(validatePosts(posts, RULES)).toEqual([]);
  });

  it("raises no editorial warning (§8.2 rows 7, 16, 19, 22, 23)", () => {
    expect(editorialWarnings(posts, RULES)).toEqual([]);
  });
});

/** A value with every no-wrap span unwrapped (`{nowrap:x}` → x) and the read time left out: what a post never stores. */
function withoutDerivations(value: unknown): unknown {
  if (typeof value === "string") return value.replace(/\{nowrap:([^{}]*)\}/g, "$1");
  if (Array.isArray(value)) return value.map(withoutDerivations);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "readMinutes").map(([key, v]) => [key, withoutDerivations(v)]));
  }
  return value;
}

/** Each string that differs only in its no-wrap spans, by path. */
function nowrapDifferences(before: unknown, after: unknown, path = ""): string[] {
  if (typeof before === "string" && typeof after === "string") return before === after ? [] : [path];
  if (before && after && typeof before === "object" && typeof after === "object") {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((key) => (key === "readMinutes" ? [] : nowrapDifferences((before as Record<string, unknown>)[key], (after as Record<string, unknown>)[key], `${path}.${key}`)));
  }
  return [];
}

describe("the round trip: postToArticle(articleToPost(m)) equals each of the 20 modules (journal-pipeline §8.3)", () => {
  it.each(GUIDES.map((a) => [a.slug, a] as const))("%s, except the read time and the no-wrap spans", (_slug, article) => {
    expect(withoutDerivations(back(exportOf(article)))).toEqual(withoutDerivations(article));
  });

  /* The listed set, for the main session's ruling: where the derived read time or no-wrap spans differ from what the
     module stores. Pinned, so a new difference (a guide edited, a derivation changed) is red until it is ruled. The three
     no-wrap lines are spans the adapter adds to a phrase the module leaves bare; it drops none. */
  it("lists every difference of the derivations, and nothing else differs", () => {
    const listed = GUIDES.flatMap((article) => {
      const derived = back(exportOf(article));
      const minutes = derived.head.readMinutes === article.head.readMinutes ? [] : [`${article.slug}: read time ${article.head.readMinutes} → ${derived.head.readMinutes} min`];
      const spans = nowrapDifferences(article, derived).map((path) => `${article.slug}: no-wrap ${path}`);
      return [...minutes, ...spans];
    });
    expect(listed).toEqual([
      "talking-toys-and-late-talkers: no-wrap .body.0.blocks.0.text",
      "the-gentle-way-off-the-phone: read time 3 → 4 min",
      "the-gentle-way-off-the-phone: no-wrap .body.0.blocks.0.text",
      "busy-hands-no-screens: no-wrap .body.2.blocks.0.text",
      "should-kids-use-ai: read time 5 → 4 min",
    ]);
  });

  it("derives the read time from the exported words, as the adapter will at every build", () => {
    for (const article of GUIDES) expect(back(exportOf(article)).head.readMinutes, article.slug).toBe(readMinutes(exportOf(article)));
  });
});
