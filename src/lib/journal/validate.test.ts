import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import { topics } from "@/content/en-IN/stories/topics";
import { BANNED_PHRASES, findBanned } from "../../../test/guards/banned-phrases.data";
import {
  canonical,
  countProblem,
  diffPosts,
  editorialWarnings,
  MIN_POSTS,
  normalisePosts,
  type JournalRules,
  serialiseSnapshot,
  shrinkProblem,
  snapshotProblems,
  validatePosts,
} from "./validate";

/**
 * The gate a journal must pass before a build may ship it (ADR-014; journal-pipeline §2.3, §3, §8.2).
 *
 * Main's gate (main:tools/blog/validate.mjs, main:test/blog-sync.test.ts) ported with its cases, then
 * every prebuild row of §8.2 red on a planted post, the message naming the post and the rule, and the
 * editorial rules as warnings. The fixture (test/fixtures/journal/posts.fixture.json) is a valid
 * journal of four posts that between them use every node, mark and attribute of the contract.
 */

type Json = Record<string, unknown>;
type Post = Json & { slug: string; body: { type: "doc"; content: Json[] } };

const FIXTURE_PATH = join(process.cwd(), "test/fixtures/journal/posts.fixture.json");
const FIXTURE = JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as { generated: string; posts: Post[] };

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };

/** A fresh copy of the fixture's posts, so a planted fault never leaks into another case. */
const posts = (): Post[] => structuredClone(FIXTURE.posts);
const bySlug = (list: Post[], slug: string): Post => list.find((p) => p.slug === slug)!;

const AI = "fixture-ai-safety-guide";
const LEARNING = "fixture-learning-guide";
const SCREEN = "fixture-screen-time-guide";
const TALKING = "fixture-talking-guide";

/** The journal with one post changed by `plant`, and the problems the gate finds in it. */
function plant(slug: string, change: (post: Post) => void): string[] {
  const list = posts();
  change(bySlug(list, slug));
  return validatePosts(list, RULES);
}

const block = (post: Post, i: number) => post.body.content[i];
/** The value with every object's keys sorted, at every depth (what Postgres jsonb may return). */
const sortKeysDeep = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map(sortKeysDeep)
    : v && typeof v === "object"
      ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeysDeep((v as Json)[k])]))
      : v;
const para = (text: string): Json => ({ type: "paragraph", content: [{ type: "text", text }] });
const firstClaim = BANNED_PHRASES.find((b) => b.kind === "claim")!;
const firstOffer = BANNED_PHRASES.find((b) => b.kind === "offer")!;
const firstSpelling = BANNED_PHRASES.find((b) => b.kind === "spelling")!;

describe("the fixture journal", () => {
  it("passes every rule, structural and editorial", () => {
    expect(validatePosts(FIXTURE.posts, RULES)).toEqual([]);
    expect(snapshotProblems(FIXTURE, RULES)).toEqual([]);
    expect(editorialWarnings(FIXTURE.posts, RULES)).toEqual([]);
    expect(FIXTURE.posts.length).toBeGreaterThanOrEqual(MIN_POSTS);
  });

  it("is written in the sync's order: posts by slug, keys in the contract's order", () => {
    expect(serialiseSnapshot(FIXTURE.posts, FIXTURE.generated)).toBe(readFileSync(FIXTURE_PATH, "utf8"));
  });

  it("uses every block node, mark and attribute of the contract (§3)", () => {
    const seen = new Set<string>();
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      const n = node as Json;
      if (typeof n.type === "string") seen.add(n.type);
      for (const [k, v] of Object.entries((n.attrs as Json) ?? {})) seen.add(`${n.type}.${k}${k === "style" ? `=${v}` : ""}`);
      walk(n.content);
      walk(n.marks);
    };
    for (const p of FIXTURE.posts) walk(p.body);
    expect([...seen].sort()).toEqual(
      [
        "blockquote", "blockquote.icon", "blockquote.style=callout", "blockquote.style=questions",
        "bold", "bulletList", "bulletList.style=checks", "bulletList.style=facts", "bulletList.style=tips",
        "doc", "hardBreak", "heading", "heading.anchor", "heading.level", "horizontalRule",
        "image", "image.alt", "image.caption", "image.height", "image.photo", "image.src", "image.width",
        "link", "link.href", "listItem", "listItem.icon", "orderedList", "paragraph", "text",
        "videoEmbed", "videoEmbed.caption", "videoEmbed.provider", "videoEmbed.title", "videoEmbed.videoId",
      ].sort(),
    );
  });
});

/* ── main's cases (main:test/blog-sync.test.ts:17-31), ported ─────────────────────────────────── */

describe("main's gate, ported", () => {
  it("refuses a post the pages could not render", () => {
    const good = FIXTURE.posts[0];
    expect(validatePosts([{ ...good, slug: "Bad Slug" }], RULES)[0]).toMatch(/bad slug/);
    expect(validatePosts([{ ...good, updated: "2020-01-01" }], RULES)[0]).toMatch(/updated before published/);
    expect(validatePosts([{ ...good, pose: "angry" }], RULES)[0]).toMatch(/unknown pose/);
    expect(validatePosts([{ ...good, body: { type: "doc", content: [{ type: "script" }] } }], RULES)[0]).toMatch(/unknown block/);
    expect(validatePosts([good, good], RULES)[0]).toMatch(/duplicate slug/);
    expect(validatePosts({ posts: [] }, RULES)).toEqual(["the posts are not a list (rule 1)"]);
  });

  it("refuses a journal that suddenly lost half its articles", () => {
    expect(shrinkProblem(22, 0)).toMatch(/returned 0 posts where the last build had 22/);
    expect(shrinkProblem(22, 10)).toMatch(/BLOG_ALLOW_SHRINK/);
    expect(shrinkProblem(22, 11)).toBeNull();
    expect(shrinkProblem(22, 25)).toBeNull();
  });

  it("applies the shrink rule only from a last count of 4", () => {
    expect(shrinkProblem(3, 0)).toBeNull();
    expect(shrinkProblem(4, 1)).toMatch(/\(rule 1\)$/);
    expect(shrinkProblem(4, 2)).toBeNull();
    expect(shrinkProblem(0, 22)).toBeNull();
  });
});

/* ── §8.2, the prebuild rows: each red on a planted post, naming the post and the rule ─────────── */

describe("rule 1: a list of at least 4 posts", () => {
  it.each([0, 1, 3])("refuses a journal of %i posts, always", (n) => {
    expect(countProblem(n)).toMatch(new RegExp(`has ${n} posts?; it needs at least 4.*\\(rule 1\\)$`));
  });

  it.each([4, 22])("accepts %i posts", (n) => {
    expect(countProblem(n)).toBeNull();
  });

  it.each([null, "posts", { data: [] }, undefined])("refuses %j as a list of posts", (value) => {
    expect(validatePosts(value, RULES)).toEqual(["the posts are not a list (rule 1)"]);
  });

  it("refuses a snapshot file that is not { generated, posts }, or holds too few posts", () => {
    expect(snapshotProblems([], RULES)).toEqual(["the snapshot is not { generated, posts } (rule 1)"]);
    expect(snapshotProblems({ posts: FIXTURE.posts }, RULES)).toEqual(['the snapshot\'s "generated" note is not text (rule 1)']);
    expect(snapshotProblems({ generated: "x", posts: FIXTURE.posts.slice(0, 3) }, RULES)).toEqual([
      expect.stringMatching(/has 3 posts; it needs at least 4.*\(rule 1\)$/),
    ]);
  });
});

/* Each row: [rule, what is planted, post, the change, the message]. One problem each. */
const PLANTED: [number, string, string, (p: Post) => void, RegExp][] = [
  [2, "a slug with capitals and spaces", AI, (p) => (p.slug = "Bad Slug"), /^post "Bad Slug": bad slug "Bad Slug"/],
  [2, "a slug with a trailing hyphen", AI, (p) => (p.slug = "trailing-"), /^post "trailing-": bad slug/],
  [3, "an empty title", AI, (p) => (p.title = " "), /^post "fixture-ai-safety-guide": missing title/],
  [3, "no description", AI, (p) => delete p.description, /: missing description/],
  [3, "no theme", AI, (p) => (p.theme = ""), /: missing theme/],
  [3, "no author", AI, (p) => (p.author = null), /: missing author/],
  [3, "a date that is not YYYY-MM-DD", AI, (p) => (p.published = "2026-8-20"), /: bad dates/],
  [3, "a date that does not exist", AI, (p) => (p.updated = "2026-02-30"), /: bad dates/],
  [3, "updated before published", AI, (p) => (p.updated = "2026-01-01"), /: updated before published/],
  [4, "an unknown pose", AI, (p) => (p.pose = "angry"), /: unknown pose "angry"/],
  [4, "an unknown tint", AI, (p) => (p.tint = "bg-red/15"), /: unknown tint "bg-red\/15"/],
  [4, "a hero that is neither text nor null", AI, (p) => (p.hero = 42), /: bad hero/],
  [4, "heroAlt missing", LEARNING, (p) => delete p.heroAlt, /: heroAlt is not text/],
  [4, "a hero size that is not a whole number", LEARNING, (p) => (p.heroWidth = "1440"), /: heroWidth is not a positive whole number or null/],
  [4, "an empty ageNote", LEARNING, (p) => (p.ageNote = ""), /: ageNote is empty/],
  [4, "sources that are not a list", AI, (p) => (p.sources = "none"), /: sources is not a list/],
  [4, "a source without a label", AI, (p) => ((p.sources as Json[])[0].label = ""), /: sources\[0\] needs a label and a url/],
  [4, "a body that is not a document", AI, (p) => (p.body = { type: "doc" } as Post["body"]), /: body is not a document/],
  [4, "an unknown block", AI, (p) => p.body.content.push({ type: "table" }), /: body\[6\]: unknown block "table"/],
  [4, "an unknown key on a node", SCREEN, (p) => (block(p, 0).id = "x"), /: body\[0\] \(paragraph\): unknown key "id"/],
  [4, "an attribute a paragraph does not take", SCREEN, (p) => (block(p, 0).attrs = { textAlign: "left" }), /: body\[0\] \(paragraph\): unknown attribute "textAlign"/],
  [4, "a level-4 heading", SCREEN, (p) => ((block(p, 1).attrs as Json).level = 4), /: body\[1\] \(heading\): level 4; a heading is level 2 or 3/],
  [4, "an anchor that is not kebab-case", SCREEN, (p) => ((block(p, 1).attrs as Json).anchor = "Brain Development"), /: body\[1\] \(heading\): anchor "Brain Development" is not kebab-case/],
  [4, "an anchor on a level-3 heading", TALKING, (p) => ((block(p, 5).attrs as Json).anchor = "two-languages"), /: body\[5\] \(heading\): only a level-2 heading takes an anchor/],
  [4, "a heading with no words", SCREEN, (p) => (block(p, 1).content = []), /: body\[1\] \(heading\): a heading needs words/],
  [4, "an unknown mark", SCREEN, (p) => (((block(p, 0).content as Json[])[0].marks as Json[])[0] = { type: "italic" }), /: body\[0\]\.content\[0\]: unknown mark "italic"/],
  [4, "a link mark without an address", SCREEN, (p) => (((block(p, 2).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: {} }), /: body\[2\]\.content\[1\]: a link needs an href/],
  [4, "a text node with no text", SCREEN, (p) => ((block(p, 0).content as Json[])[1].text = ""), /: body\[0\]\.content\[1\]: a text node needs text/],
  [4, "an unknown inline node", SCREEN, (p) => (block(p, 0).content as Json[]).push({ type: "emoji" }), /: body\[0\]\.content\[2\]: unknown inline node "emoji"/],
  [4, "a list item of two paragraphs", SCREEN, (p) => ((block(p, 4).content as Json[])[0].content as Json[]).push(para("Two.")), /: body\[4\]\.content\[0\] \(listItem\): a list item holds exactly one paragraph/],
  [4, "a list nested in a list item", SCREEN, (p) => ((block(p, 4).content as Json[])[0].content = [{ type: "bulletList", content: [] }]), /: body\[4\]\.content\[0\] \(listItem\): a list item holds exactly one paragraph/],
  [4, "an empty list", SCREEN, (p) => (block(p, 4).content = []), /: body\[4\] \(orderedList\): a list needs at least one item/],
  [4, "an unknown list style", SCREEN, (p) => (block(p, 3).attrs = { style: "stars" }), /: body\[3\] \(bulletList\): unknown style "stars"/],
  [4, "a tip without an icon", SCREEN, (p) => delete (block(p, 3).content as Json[])[1].attrs, /: body\[3\]\.content\[1\] \(listItem\): a tips item needs an icon/],
  [4, "a fact without an icon", LEARNING, (p) => (((block(p, 2).content as Json[])[0].attrs as Json).icon = null), /: body\[2\]\.content\[0\] \(listItem\): a facts item needs an icon/],
  [4, "a callout without an icon", TALKING, (p) => (block(p, 2).attrs = { style: "callout" }), /: body\[2\] \(blockquote\): a callout needs an icon/],
  [4, "a callout without a style (callout is the default) and without an icon", TALKING, (p) => delete block(p, 2).attrs, /: body\[2\] \(blockquote\): a callout needs an icon/],
  [4, "a callout of two paragraphs", TALKING, (p) => (block(p, 2).content as Json[]).push(para("More.")), /: body\[2\] \(blockquote\): a callout holds exactly one paragraph/],
  [4, "a questions block that starts with a paragraph", TALKING, (p) => (block(p, 4).content as Json[]).unshift(para("First.")), /: body\[4\] \(blockquote\): a questions block starts with a level-3 heading/],
  [4, "a question without an answer", TALKING, (p) => (block(p, 4).content as Json[]).splice(4, 1), /: body\[4\] \(blockquote\): every question needs a paragraph after it/],
  [4, "a level-2 heading inside a questions block", TALKING, (p) => (((block(p, 4).content as Json[])[3].attrs as Json).level = 2), /: body\[4\] \(blockquote\): a questions block holds level-3 headings and paragraphs only/],
  [4, "a blockquote inside a blockquote", TALKING, (p) => (block(p, 4).content as Json[]).push({ type: "blockquote", attrs: { icon: "star" }, content: [para("x")] }), /: body\[4\] \(blockquote\): a questions block holds level-3 headings and paragraphs only/],
  [4, "an unknown blockquote style", TALKING, (p) => ((block(p, 2).attrs as Json).style = "aside"), /: body\[2\] \(blockquote\): unknown style "aside"/],
  [4, "an image without a caption", AI, (p) => delete (block(p, 1).attrs as Json).caption, /: body\[1\] \(image\): caption is not text/],
  [4, "an empty photo key", LEARNING, (p) => ((block(p, 3).attrs as Json).photo = ""), /: body\[3\] \(image\): photo is empty/],
  [4, "an empty metaTitle", AI, (p) => (p.metaTitle = ""), /: metaTitle is empty: write it or leave it null/],
  [4, "a cardTitle that is not text", AI, (p) => (p.cardTitle = 7), /: cardTitle is not text or null/],
  [4, "an answer without a question", AI, (p) => (p.answer = { text: "x" }), /: answer needs a question and a text/],
  [4, "related that is not a list", AI, (p) => (p.related = "fixture-learning-guide"), /: related is not a list of slugs/],
  [4, "a photo key that is not text", SCREEN, (p) => (p.photo = 7), /: photo is not text or null/],
  [5, "a placeholder token", SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = "Ask about {ph:F4 battery} first."), /: body\[2\]\.content\[0\]: "\{ph:F4 battery\}" is not a token a post may hold/],
  [5, "an accent token typed into body text", SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = "A {hand:big} day."), /"\{hand:big\}" is not a token a post may hold/],
  [5, "a link typed as text", SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = "See [the hub](/stories)."), /"\[the hub\]" is not a token a post may hold/],
  [5, "an unknown price", LEARNING, (p) => ((block(p, 0).content as Json[])[1].text = "It is {price:discount}."), /"\{price:discount\}" is not a token a post may hold/],
  [5, "a stray closing brace", SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = "A stray } brace."), /: body\[2\]\.content\[0\]: a "\}" with no opening/],
  [5, "a typed rupee amount", SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = "It costs ₹2,999."), /: body\[2\]\.content\[0\]: a typed ₹; write \{price:…\}/],
  [5, "a marker inside a link label", SCREEN, (p) => ((block(p, 2).content as Json[])[1].text = "the hub[^1]"), /: body\[2\]\.content\[1\]: a source marker cannot sit inside a link/],
  [5, "a marker in a plain field (the title)", AI, (p) => (p.title = "What to ask[^1] before a talking toy comes home"), /: title is plain text: no \{, \}, \[ or \]/],
  [5, "a brace in a source label", AI, (p) => ((p.sources as Json[])[0].label = "A {guide}"), /: sources\[0\]\.label is plain text: no \{, \}, \[ or \]/],
  [5, "a typed rupee in the description", AI, (p) => (p.description = "Kheelu costs ₹7,999 in full."), /: description: a typed ₹; write \{price:…\}/],
  [6, "a marker past the last source", AI, (p) => ((block(p, 0).content as Json[])[0].text = "A claim.[^2] Read "), /: marker \[\^2\] but the post lists 1 source/],
  [6, "a marker in the answer past the last source", TALKING, (p) => ((p.answer as Json).text = `${(p.answer as Json).text} See this.[^3]`), /: marker \[\^3\] but the post lists 1 source/],
  [8, "an http link", AI, (p) => (((block(p, 0).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "http://example.org/x" } }), /: body\[0\]\.content\[1\]: link "http:\/\/example\.org\/x": use \/path, #anchor, https:\/\/, mailto: or tel:/],
  [8, "a protocol-relative link", AI, (p) => (((block(p, 0).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "//evil.example/x" } }), /link "\/\/evil\.example\/x": use \/path/],
  [8, "a script link", AI, (p) => (((block(p, 0).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "javascript:alert(1)" } }), /link "javascript:alert\(1\)": use \/path/],
  [8, "a site path with a space", SCREEN, (p) => (((block(p, 2).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "/stories/a b" } }), /link "\/stories\/a b": use \/path/],
  [8, "a link to an .html page", SCREEN, (p) => (((block(p, 2).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "/stories.html" } }), /link "\/stories\.html": use \/path/],
  [8, "a source that is not https", AI, (p) => ((p.sources as Json[])[0].url = "http://example.org/x"), /: sources\[0\]\.url "http:\/\/example\.org\/x" is not an https:\/\/ address/],
  [10, "a theme that is not a topic title (a live theme)", AI, (p) => (p.theme = "Safety"), /: theme "Safety" is not a topic title \(Screen time, Talking and language, AI toys and safety, Learning and play\)/],
  [13, "a cover at a site path (main's /stories/<slug>.jpg)", AI, (p) => (p.hero = "/stories/fixture-ai-safety-guide.jpg"), /: hero "\/stories\/fixture-ai-safety-guide\.jpg" is a site path; an uploaded cover lives under https:\/\/api\.kheelona\.com\/v1\/public\/blog\/images\//],
  [13, "a cover on another host", AI, (p) => (p.hero = "https://images.example.org/cover.jpg"), /: hero "https:\/\/images\.example\.org\/cover\.jpg" is not under https:\/\/api\.kheelona\.com\/v1\/public\/blog\/images\//],
  [13, "a cover with a query string", AI, (p) => (p.hero = `${JOURNAL_IMAGES}cover.jpg?v=2`), /: hero ".*\?v=2" is not under/],
  [13, "a cover that climbs out of the image folder", AI, (p) => (p.hero = `${JOURNAL_IMAGES}../posts`), /: hero ".*\.\.\/posts" is not under/],
  [13, "a cover without its size", AI, (p) => (p.heroHeight = null), /: an uploaded cover needs heroWidth, heroHeight and heroAlt/],
  [13, "a cover without alt text", AI, (p) => (p.heroAlt = ""), /: an uploaded cover needs heroWidth, heroHeight and heroAlt/],
  [13, "a body image on another host", AI, (p) => ((block(p, 1).attrs as Json).src = "https://images.example.org/x.jpg"), /: body\[1\] \(image\): src "https:\/\/images\.example\.org\/x\.jpg" is not under/],
  [13, "a body upload without its size", AI, (p) => ((block(p, 1).attrs as Json).width = null), /: body\[1\] \(image\): an uploaded image needs width, height and alt/],
  [14, "an unknown video provider", AI, (p) => ((block(p, 4).attrs as Json).provider = "dailymotion"), /: body\[4\] \(videoEmbed\): provider "dailymotion" is not youtube or vimeo/],
  [14, "a YouTube id that is not 11 characters", AI, (p) => ((block(p, 4).attrs as Json).videoId = "short"), /: body\[4\] \(videoEmbed\): "short" is not a YouTube video id/],
  [14, "a Vimeo id that is not a number", LEARNING, (p) => ((block(p, 6).attrs as Json).videoId = "abc"), /: body\[6\] \(videoEmbed\): "abc" is not a Vimeo video id/],
  [14, "a video without a title", AI, (p) => ((block(p, 4).attrs as Json).title = ""), /: body\[4\] \(videoEmbed\): a video needs a title/],
  [15, `a banned claim (${firstClaim.id}) in the body`, SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = firstClaim.planted), new RegExp(`: body\\[2\\]: banned ${firstClaim.id} "`)],
  [15, `a retired offer term (${firstOffer.id}) in the lead`, AI, (p) => (p.lead = firstOffer.planted), new RegExp(`: lead: banned ${firstOffer.id} "`)],
  [15, "a banned claim in the answer", TALKING, (p) => ((p.answer as Json).question = `${firstClaim.planted} Why?`), new RegExp(`: answer\\.question: banned ${firstClaim.id} "`)],
  [15, "a banned claim in a source label", AI, (p) => ((p.sources as Json[])[0].label = firstClaim.planted), new RegExp(`: sources\\[0\\]\\.label: banned ${firstClaim.id} "`)],
  [15, "a banned claim in an image caption", AI, (p) => ((block(p, 1).attrs as Json).caption = firstClaim.planted), new RegExp(`: body\\[1\\]\\.caption: banned ${firstClaim.id} "`)],
];

describe("§8.2's prebuild rows, each red on a planted post", () => {
  it.each(PLANTED)("rule %i: refuses %s", (rule, _what, slug, change, message) => {
    const problems = plant(slug, change);
    expect(problems, problems.join("\n")).toHaveLength(1);
    expect(problems[0]).toMatch(message);
    expect(problems[0]).toMatch(/^post "[^"]+": /);
    expect(problems[0]).toMatch(new RegExp(`\\(rule ${rule}\\)$`));
  });

  it("refuses a post that is not an object, naming its place", () => {
    expect(validatePosts([...posts(), "x"], RULES)).toEqual(["post #5 is not an object (rule 4)"]);
  });

  it("refuses a duplicate slug once, naming it", () => {
    const list = posts();
    list.push(structuredClone(list[0]));
    expect(validatePosts(list, RULES)).toEqual(['post "fixture-ai-safety-guide": duplicate slug (rule 2)']);
  });

  it("lists every problem, not only the first", () => {
    const problems = plant(AI, (p) => {
      p.theme = "Safety";
      p.pose = "angry";
    });
    expect(problems).toHaveLength(2);
  });

  it("accepts a post written before the backend gained the new fields (B1): absent means null", () => {
    const list = posts();
    for (const key of ["metaTitle", "cardTitle", "accent", "lead", "summary", "answer", "photo", "related"]) delete bySlug(list, LEARNING)[key];
    expect(validatePosts(list, RULES)).toEqual([]);
  });

  it("accepts the tokens a post may hold: [^n], {price:…} for the six prices, {delivery}", () => {
    for (const key of ["token", "balance", "headline", "full", "mrp", "launch"]) {
      expect(plant(LEARNING, (p) => ((block(p, 0).content as Json[])[1].text = `It is {price:${key}}, {delivery}.[^1]`))).toEqual([]);
    }
  });

  it("accepts an in-page anchor link, as the rich-text parser does", () => {
    expect(plant(SCREEN, (p) => (((block(p, 2).content as Json[])[1].marks as Json[])[0] = { type: "link", attrs: { href: "#limits" } }))).toEqual([]);
  });

  it("ignores an image's src when it names a DS photo (the site shows the photo)", () => {
    expect(plant(LEARNING, (p) => ((block(p, 3).attrs as Json).src = "anything"))).toEqual([]);
  });

  it("holds the spelling rule to a warning, not an error (rule 16 is editorial)", () => {
    expect(plant(SCREEN, (p) => ((block(p, 2).content as Json[])[0].text = firstSpelling.planted))).toEqual([]);
  });
});

/* ── the editorial rules: warnings at build, errors in verify (§2.3, §8.2) ──────────────────────── */

const WARNED: [number, string, string, (p: Post, all: Post[]) => void, RegExp][] = [
  [7, "a source no marker cites", AI, (p) => (p.sources as Json[]).push({ label: "Another source", url: "https://example.org/another" }), /: source 2 is never cited by a \[\^2\] marker/],
  [16, "a US spelling in the lead", SCREEN, (p) => (p.lead = firstSpelling.planted), new RegExp(`: lead: spelling ${firstSpelling.id} "`)],
  [16, "a US spelling in the body", SCREEN, (p) => (block(p, 4).content as Json[]).push({ type: "listItem", content: [para(firstSpelling.planted)] }), new RegExp(`: body\\[4\\]\\.content\\[2\\]\\.content\\[0\\]: spelling ${firstSpelling.id} "`)],
  [19, "two related guides, not three", AI, (p) => (p.related = ["fixture-learning-guide", "fixture-talking-guide"]), /: related lists 2 guides; it lists none or three, and the ring fills the rest/],
  [19, "a related guide that is not published", AI, (p) => ((p.related as string[])[0] = "no-such-guide"), /: related "no-such-guide" is not a published post/],
  [19, "itself as a related guide", AI, (p) => ((p.related as string[])[0] = AI), /: related lists the post itself/],
  [19, "the same related guide twice", AI, (p) => ((p.related as string[])[1] = (p.related as string[])[0]), /: related lists "fixture-learning-guide" twice/],
  [22, "no answer", AI, (p) => (p.answer = null), /: no answer card \(a question and a 40-60 word answer\)/],
  [22, "a question without a question mark", AI, (p) => ((p.answer as Json).question = "What to ask"), /: the answer's question does not end with "\?"/],
  [22, "an answer of 13 words", AI, (p) => ((p.answer as Json).text = "Ask who hears the voice and how long it is kept.[^1] Then decide."), /: the answer is 13 words; it is 40 to 60/],
  [23, "a meta title over 60 characters", AI, (p) => (p.metaTitle = "x".repeat(61)), /: the meta title is 61 characters; at most 60/],
  [23, "a title over 60 characters with no meta title", TALKING, (p) => (p.title = `${p.title} and keeping a long conversation going`), /: the meta title is \d+ characters; at most 60/],
  [23, "a description over 155 characters", AI, (p) => (p.description = "y".repeat(156)), /: the description is 156 characters; at most 155/],
  [23, "a meta title another post uses", AI, (p, all) => (p.metaTitle = bySlug(all, SCREEN).metaTitle), /: the meta title is also "fixture-screen-time-guide"'s/],
  [23, "a description another post uses", AI, (p, all) => (p.description = bySlug(all, SCREEN).description), /: the description is also "fixture-screen-time-guide"'s/],
  [23, "an accent the title does not hold", AI, (p) => (p.accent = "goes home"), /: the accent "goes home" is not in the title once; the h1 shows no accent/],
  [23, "an accent the title holds twice", AI, (p) => {
    p.title = "Home sweet home, a talking toy comes home";
    p.accent = "home";
  }, /: the accent "home" is not in the title once/],
];

describe("the editorial rules: a warning names the post and the rule, and the build goes on", () => {
  it.each(WARNED)("rule %i: warns on %s", (rule, _what, slug, change, message) => {
    const list = posts();
    change(bySlug(list, slug), list);
    expect(validatePosts(list, RULES), "an editorial rule is never a build error").toEqual([]);
    const warnings = editorialWarnings(list, RULES).filter((w) => w.startsWith(`post "${slug}"`));
    expect(warnings, warnings.join("\n")).toHaveLength(1);
    expect(warnings[0]).toMatch(message);
    expect(warnings[0]).toMatch(new RegExp(`\\(rule ${rule}\\)$`));
  });

  it("accepts an empty related list (the ring fills it)", () => {
    const list = posts();
    bySlug(list, AI).related = [];
    expect(editorialWarnings(list, RULES)).toEqual([]);
  });
});

/* ── the snapshot's order and the data compare (main:tools/blog/sync.mjs:76-88) ─────────────────── */

describe("order and compare", () => {
  it("orders posts by slug and keys in the contract's order, whatever order the API returns", () => {
    const shuffled = posts().reverse().map((p) => Object.fromEntries(Object.entries(p).reverse()));
    expect(JSON.stringify(normalisePosts(shuffled))).toBe(JSON.stringify(FIXTURE.posts));
  });

  it("keeps a key the contract does not name, after the contract's keys, and adds none", () => {
    const list = posts();
    (list[0] as Json).zeta = 1;
    (list[0] as Json).alpha = 2;
    delete list[0].metaTitle;
    const keys = Object.keys(normalisePosts(list)[0] as Json);
    expect(keys.slice(-2)).toEqual(["alpha", "zeta"]);
    expect(keys).not.toContain("metaTitle");
  });

  it("compares data, not text: Postgres jsonb reorders keys, which is no change", () => {
    const reordered = posts().map((p) => sortKeysDeep(p) as Post);
    expect(canonical(normalisePosts(reordered))).toBe(canonical(FIXTURE.posts));
    const changed = posts();
    changed[0].title = "Another title";
    expect(canonical(normalisePosts(changed))).not.toBe(canonical(FIXTURE.posts));
  });

  it("names every difference by post and field", () => {
    const after = posts();
    after[0].title = "Another title";
    after[1].answer = null;
    after.splice(3, 1);
    after.push({ ...structuredClone(after[2]), slug: "fixture-new-guide" });
    expect(diffPosts(FIXTURE.posts, after)).toEqual({
      added: ["fixture-new-guide"],
      removed: ["fixture-talking-guide"],
      changed: [
        { slug: "fixture-ai-safety-guide", fields: ["title"] },
        { slug: "fixture-learning-guide", fields: ["answer"] },
      ],
    });
    expect(diffPosts(FIXTURE.posts, posts().reverse())).toEqual({ added: [], removed: [], changed: [] });
  });

  it("writes the snapshot as { generated, posts }, two-space JSON with a final newline, no timestamp", () => {
    const text = serialiseSnapshot(posts().reverse(), "NOTE");
    expect(Object.keys(JSON.parse(text))).toEqual(["generated", "posts"]);
    expect(text.endsWith("}\n")).toBe(true);
    expect(text.startsWith('{\n  "generated": "NOTE",\n  "posts": [\n')).toBe(true);
  });
});
