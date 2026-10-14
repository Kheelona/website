import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import type { RedirectRule } from "@/config/redirects";
import { DEFAULT_OG, TEAM_BYLINE } from "@/content/en-IN/organization";
import { photos } from "@/content/en-IN/stories/photos";
import { topics } from "@/content/en-IN/stories/topics";
import type { Article, ArticlePart, FigureBlock, ProseBlock } from "@/content/types";
import { parseRichText } from "@/lib/content/rich-text";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { VOCABULARY } from "../../../test/fixtures/journal/vocabulary";
import { parseSnapshot, type Post, type PostBlock } from "./post";
import { readMinutes } from "./read-minutes";
import { readingOrder, ringOffers } from "./ring";
import { hubGroups, journalToArticles, postToArticle, type AdaptOptions } from "./to-article";
import type { JournalRules } from "./validate";

/**
 * The adapter (ADR-014; journal-pipeline §4, §5, §8.2): a dashboard post into the rebuild's `Article`, so the article
 * template, the hub, the sitemap and every article guard keep reading `Article`s. Proven on two fixture journals: 8b.2b's
 * four posts (test/fixtures/journal/posts.fixture.json) and this task's nine, one per block kind, an uploaded cover, a
 * video and a talking guide (block-kinds.fixture.json). Each of the adapter's rows of §8.2 is red on a planted post,
 * the message naming the post and the rule.
 */

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };
const load = (file: string) => parseSnapshot(JSON.parse(readFileSync(join(process.cwd(), "test/fixtures/journal", file), "utf8")), RULES).posts;
const KINDS = load("block-kinds.fixture.json");
const SYNC = load("posts.fixture.json");

/** A fresh, writable copy of a fixture post. */
type Writable<T> = { -readonly [K in keyof T]: T[K] };
const post = (slug: string, from: readonly Post[] = KINDS): Writable<Post> => structuredClone(from.find((p) => p.slug === slug)!);
const PUBLISHED = new Set(KINDS.map((p) => p.slug));
/** The ring over the fixture journal, which fills the related guides a post leaves out. */
const OFFERS = ringOffers(readingOrder(KINDS, topics.map((t) => t.title)));
const options = (warnings: string[] = [], slug = ""): AdaptOptions => ({ vocabulary: VOCABULARY, published: PUBLISHED, offers: OFFERS.get(slug), warn: (m) => warnings.push(m) });
const adapt = (p: Post, warnings: string[] = []) => postToArticle(p, options(warnings, p.slug));

const parts = (article: Article) => article.body.filter((b): b is ArticlePart => b.kind === "part");
const partTitled = (article: Article, title: string) => parts(article).find((p) => p.title === title)!;
const blocksOf = (article: Article): ProseBlock[] => article.body.flatMap((b) => (b.kind === "part" ? b.blocks : [b]));

/* ── §4, the field map ──────────────────────────────────────────────────────────────────────────── */

describe("the field map (journal-pipeline §4)", () => {
  const paragraphs = adapt(post("kind-paragraphs"));

  it("keeps the slug, the description, the dates and the sources (label → citation, url → href)", () => {
    expect(paragraphs.slug).toBe("kind-paragraphs");
    expect(paragraphs.meta.description).toBe(post("kind-paragraphs").description);
    expect([paragraphs.published, paragraphs.updated]).toEqual(["2026-09-01", "2026-09-03"]);
    expect(paragraphs.sources).toEqual([{ citation: "Fixture source: a guide to reading with young children", href: "https://example.org/reading" }]);
  });

  it("derives the <title>: the h1 and the site's name when that fits in 60, else the h1, unless the post names one", () => {
    expect(paragraphs.meta.title).toBe("Paragraphs for a 3-year-old, in plain words · Kheelona");
    const long = post("kind-paragraphs");
    long.title = "A title long enough that the site's name would push it past sixty";
    long.accent = null;
    expect(adapt(long).meta.title).toBe("A title long enough that the site's name would push it past sixty");
    long.metaTitle = "The searched phrase, as written";
    expect(adapt(long).meta.title).toBe("The searched phrase, as written");
  });

  it("sets the h1 with the accent in the hand face and every age compound on one line", () => {
    expect(paragraphs.head.title).toBe("Paragraphs for a {nowrap:3-year-old,} in {hand:plain words}");
    expect(() => parseRichText(paragraphs.head.title)).not.toThrow();
  });

  it("leaves out an accent that is not in the title exactly once, with a warning (rule 23)", () => {
    const warnings: string[] = [];
    const p = post("kind-paragraphs");
    p.accent = "nowhere";
    expect(adapt(p, warnings).head.title).toBe("Paragraphs for a {nowrap:3-year-old,} in plain words");
    expect(warnings.filter((w) => w.endsWith("(rule 23)"))).toEqual(['post "kind-paragraphs": the accent "nowhere" is not in the title once; the h1 shows no accent (rule 23)']);
  });

  it("titles the card with the card title, else the h1; sums it up with the summary, else the lead, else the description", () => {
    expect(paragraphs.card).toEqual({ title: "Paragraphs in plain words", summary: "Every paragraph a writer can type in the dashboard, and how the page sets it." });
    const p = post("kind-paragraphs");
    p.cardTitle = null;
    p.summary = "The hub's own line.";
    expect(adapt(p).card).toEqual({ title: "Paragraphs for a 3-year-old, in plain words", summary: "The hub's own line." });
    p.summary = null;
    p.lead = null;
    expect(adapt(p).card.summary).toBe(p.description);
  });

  it("puts the lead under the h1, ages on one line", () => {
    const p = post("kind-paragraphs");
    p.lead = "For a 4-year-old, at home.";
    expect(adapt(p).head.lead).toBe("For a {nowrap:4-year-old,} at home.");
    p.lead = null;
    expect("lead" in adapt(p).head).toBe(false);
  });

  it("shows the team's byline as the team, and a founder by name", () => {
    expect(paragraphs.head.author).toBe(TEAM_BYLINE);
    expect(adapt(post("kind-lists")).head.author).toBe("Aman Soni");
  });

  it("derives the read time from the answer and the body (never stored)", () => {
    expect(paragraphs.head.readMinutes).toBe(readMinutes(post("kind-paragraphs")));
  });

  it("heads the guide with its DS photo by key, and shares that photo's card with the photo's words (§6)", () => {
    const { image, card } = photos["advik-01-counting-carriages"];
    expect(paragraphs.head.image).toBe(image);
    expect(paragraphs.meta.og).toEqual({ image: card, alt: image.alt });
  });

  it("heads a guide with no key with its uploaded cover, shared through this site's image optimiser at the size it serves", () => {
    const upload = adapt(post("kind-upload"));
    const cover = `${JOURNAL_IMAGES}kind-upload-cover.jpg`;
    expect(upload.head.image).toEqual({ src: cover, width: 1600, height: 900, alt: "A child's drawing of a sun on a fridge door" });
    expect(upload.meta.og).toEqual({
      image: `/_next/image?url=${encodeURIComponent(cover)}&w=1200&q=75`,
      alt: "A child's drawing of a sun on a fridge door",
      width: 1200,
      height: 675,
    });
    const small = post("kind-upload");
    small.heroWidth = 800;
    small.heroHeight = 600;
    expect(adapt(small).meta.og).toMatchObject({ width: 800, height: 600 });
  });

  it("gives a guide with neither the words alone and the default card (never on the talking topic, rule 18)", () => {
    const bare = post("kind-upload");
    bare.hero = null;
    bare.heroWidth = null;
    bare.heroHeight = null;
    bare.heroAlt = "";
    const article = adapt(bare);
    expect("image" in article.head).toBe(false);
    expect(article.meta.og).toEqual(DEFAULT_OG);
  });

  it("puts the answer card first and, on the talking topic, D025's line under it, from the topic (never stored)", () => {
    const talking = adapt(post("kind-talking"));
    const disclaimer = topics.find((t) => t.id === "talking")!.disclaimer;
    expect(talking.answer?.question).toBe("How long should you wait for a reply?");
    expect(talking.answer?.detail).toEqual([{ kind: "disclaimer", text: disclaimer }]);
    expect(adapt(post("kind-lists")).answer?.detail).toBeUndefined();
  });

  it("closes as the topic does: the talking topic keeps reading (B5), the rest close with the journal", () => {
    expect(adapt(post("kind-talking")).close).toBe("keep");
    for (const slug of ["kind-paragraphs", "kind-lists", "kind-facts", "kind-images"]) expect(adapt(post(slug)).close, slug).toBe("journal");
  });

  it("keeps the post's three related guides", () => {
    expect(adapt(post("kind-headings")).related).toEqual(["kind-lists", "kind-images", "kind-video"]);
  });

  it("prints the age note as a plain line at the end of the body (§5.4)", () => {
    const last = parts(adapt(post("kind-headings"))).at(-1)!;
    expect(last.blocks.at(-1)).toEqual({ kind: "disclaimer", text: "This fixture note closes the body as a plain line." });
  });
});

/* ── §5, the body map ───────────────────────────────────────────────────────────────────────────── */

describe("the body map (journal-pipeline §5)", () => {
  it("puts the nodes above a rule that opens the body into the answer card, under the answer (the detail paragraphs)", () => {
    const article = adapt(post("kind-paragraphs"));
    expect(article.answer?.detail).toEqual([{ kind: "p", text: "These lines sit inside the answer card, under the answer." }]);
  });

  it("makes the nodes before the first h2 an untitled part, and each h2 a titled part", () => {
    const article = adapt(post("kind-paragraphs"));
    expect(article.body.map((b) => (b.kind === "part" ? (b.title ?? "(untitled)") : b.kind))).toEqual(["(untitled)", "Where the parts begin"]);
  });

  it("sets paragraphs: a bold lead-in, a whole bold line as the gut line, links and tokens kept, a hard break splitting, empty ones skipped", () => {
    const warnings: string[] = [];
    const [untitled] = parts(adapt(post("kind-paragraphs"), warnings));
    expect(untitled.blocks).toEqual([
      { kind: "p", lead: "Start here:", text: "a bold run at the start of a paragraph is its lead-in." },
      { kind: "p", variant: "gut", text: "Ask, then wait." },
      { kind: "p", text: "Read the [hub of guides](/stories) for more, or [write to us](mailto:help@example.org).[^1]" },
      { kind: "p", text: "A hard break starts a new paragraph for a {nowrap:3-year-old,} too." },
      { kind: "p", text: "Bold in the middle of a line shows as plain words." },
      { kind: "p", text: "When it ships: {delivery}." },
    ]);
    expect(warnings.filter((w) => w.endsWith("(§5.2)"))).toEqual(['post "kind-paragraphs": body[6]: bold inside a line shows as plain text; only a lead-in or a whole line can be bold (§5.2)']);
    for (const block of untitled.blocks) if (block.kind === "p") expect(() => parseRichText(block.text ?? "")).not.toThrow();
  });

  it("keeps a phone link on one line, as every page sets it (seller.ts: `{nowrap:[…](tel:…)}`), and no other link", () => {
    const p = post("kind-paragraphs");
    const line = p.body.content[4] as Extract<PostBlock, { type: "paragraph" }>;
    p.body = {
      type: "doc",
      content: [
        ...p.body.content.slice(0, 4),
        {
          ...line,
          content: [
            { type: "text", text: "Or " },
            { type: "text", text: "call +91 91875 46483", marks: [{ type: "link", attrs: { href: "tel:+919187546483" } }] },
            { type: "text", text: "." },
          ],
        },
      ],
    };
    expect(parts(adapt(p))[0].blocks.at(-1)).toEqual({ kind: "p", text: "Or {nowrap:[call +91 91875 46483](tel:+919187546483)}." });
    expect(() => parseRichText("Or {nowrap:[call +91 91875 46483](tel:+919187546483)}.")).not.toThrow();
  });

  it("gives a part its anchor as its id, keeps h3 inside the part, and starts an untitled part after a rule", () => {
    const article = adapt(post("kind-headings"));
    expect(parts(article)).toEqual([
      {
        kind: "part",
        id: "first-part",
        title: "The first part",
        blocks: [
          { kind: "p", text: "A heading of level two starts a part.[^1]" },
          { kind: "h3", text: "A smaller heading" },
          { kind: "p", text: "A heading of level three stays inside its part." },
        ],
      },
      { kind: "part", title: "The second part", blocks: [{ kind: "p", text: "A part without an anchor gets its id from its place." }] },
      {
        kind: "part",
        blocks: [
          { kind: "p", text: "After a rule, the words sit in a part with no heading." },
          { kind: "disclaimer", text: "This fixture note closes the body as a plain line." },
        ],
      },
    ]);
  });

  it("sets bullets (an item's bold lead-in kept), checks, tips with their icons and numbered steps", () => {
    const article = adapt(post("kind-lists"));
    expect(partTitled(article, "Bullets").blocks).toEqual([{ kind: "list", items: [{ lead: "Morning.", text: "A walk before breakfast." }, "A song in the bath."] }]);
    expect(partTitled(article, "Checks").blocks).toEqual([{ kind: "list", variant: "checks", items: ["Check the age on the box.", "Ask what the toy does when it is quiet."] }]);
    expect(partTitled(article, "Tips").blocks).toEqual([
      {
        kind: "list",
        variant: "tips",
        items: [
          { text: "Give a five-minute warning.", icon: "clock" },
          { text: "Read one page more, then stop.", icon: "book-open" },
        ],
      },
    ]);
    expect(partTitled(article, "Steps").blocks).toEqual([{ kind: "list", variant: "steps", items: ["Agree the time together.", "Set a timer you can both see.[^1]"] }]);
  });

  it("sets a facts list with its icons and titles, takes the DS photo right after it as its figure, and lets its part break out", () => {
    const part = partTitled(adapt(post("kind-facts")), "The facts");
    expect(part.variant).toBe("breakout");
    expect(part.blocks).toEqual([
      { kind: "p", text: "Each fact has an icon, a bold title and its words.[^1]" },
      {
        kind: "facts",
        items: [
          { icon: "microphone", title: "The first fact.", body: "It sits in a card with its own icon." },
          { icon: "lock-simple", body: "The second fact has no title." },
        ],
        figure: photos["kheelu-belly-module"].image,
      },
      { kind: "p", text: "The facts widen out of the column on a laptop." },
    ]);
  });

  it("keeps a facts list's photo as its figure even when an h2 comes right after it", () => {
    const p = post("kind-facts");
    p.body = { type: "doc", content: [...p.body.content.slice(0, 5), { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Next" }] }, p.body.content[5]] };
    const article = adapt(p);
    expect(article.body.map((b) => b.kind)).toEqual(["part", "part", "part"]);
    expect(partTitled(article, "The facts").blocks.at(-1)).toMatchObject({ kind: "facts", figure: photos["kheelu-belly-module"].image });
  });

  it("sets a callout with its icon and lead-in, and a group of questions each with its answer's paragraphs", () => {
    const article = adapt(post("kind-blockquotes"));
    expect(partTitled(article, "A callout").blocks).toEqual([
      { kind: "p", text: "A callout sets one line apart.[^1]" },
      { kind: "callout", icon: "question", lead: "Try this:", text: "ask what the toy does when nobody is talking to it." },
    ]);
    expect(partTitled(article, "Questions to ask").blocks).toEqual([
      {
        kind: "questions",
        items: [
          { question: "Who hears it?", answer: ["Ask the company, and ask how long it keeps what it hears.", "Then ask how you can see it."] },
          { question: "Can I switch it off?", answer: ["Ask where the switch is."] },
        ],
      },
      { kind: "p", text: "A paragraph after the questions closes the part." },
    ]);
  });

  it("keeps a DS photo among a part's paragraphs inside the part, and puts the one right before an h2 between the parts, wide by its shape", () => {
    const article = adapt(post("kind-images"));
    expect(article.body.map((b) => b.kind)).toEqual(["part", "figure", "part"]);
    expect(parts(article)[0].blocks[1]).toEqual({ kind: "figure", image: photos["ira-01-story-on-the-bed"].image, caption: "Stories at bedtime." });
    expect(article.body[1]).toEqual({ kind: "figure", image: photos["advik-04-floor-train"].image, variant: "wide" });
  });

  it("sets an uploaded body photo at its own size and words, wide only by its shape", () => {
    const figure = blocksOf(adapt(post("kind-upload"))).find((b): b is FigureBlock => b.kind === "figure")!;
    expect(figure).toEqual({ kind: "figure", image: { src: `${JOURNAL_IMAGES}kind-upload-body.jpg`, width: 800, height: 1000, alt: "Crayons in a steel tumbler" }, caption: "Crayons, ready." });
  });

  it("sets a video as the new video block, its caption left out when empty", () => {
    const videos = blocksOf(adapt(post("kind-video"))).filter((b) => b.kind === "video");
    expect(videos).toEqual([
      { kind: "video", provider: "youtube", videoId: "abcDEF12345", title: "Building a tower together", caption: "Two minutes, no sound needed." },
      { kind: "video", provider: "vimeo", videoId: "123456789", title: "A tower, built twice" },
    ]);
  });

  it("adapts 8b.2b's sync fixture too: every post of it becomes an article whose text parses", () => {
    const { articles } = journalToArticles(SYNC, VOCABULARY);
    expect(articles.map((a) => a.slug)).toEqual(SYNC.map((p) => p.slug));
    for (const article of articles) {
      for (const block of blocksOf(article)) if (block.kind === "p") expect(() => parseRichText(block.text ?? ""), article.slug).not.toThrow();
    }
  });
});

/* ── §8.2, the adapter's rows, each red on a planted post ──────────────────────────────────────── */

describe("the adapter's rows of §8.2, each red on a planted post", () => {
  const refused = (p: Post) => () => adapt(p);

  it("rule 10: a theme that is not a topic title", () => {
    const p = post("kind-lists");
    (p as Record<string, unknown>).theme = "Safety";
    expect(refused(p)).toThrow('post "kind-lists": theme "Safety" is not a topic title (rule 10)');
  });

  it("rule 11: a byline the site does not list (Ria Mangala Rewari is off the site)", () => {
    const p = post("kind-lists");
    (p as Record<string, unknown>).author = "Ria Mangala Rewari";
    expect(refused(p)).toThrow(/^post "kind-lists": the byline "Ria Mangala Rewari" is not one the site lists \(Kheelona, Apoorva Sahu, Aman Soni, Kashyap C\.R\) \(rule 11\)$/);
  });

  it("rule 12: an unknown head photo, a body-only image as the head, an unknown body photo, an unknown icon", () => {
    const head = post("kind-lists");
    head.photo = "no-such-photo";
    expect(refused(head)).toThrow('post "kind-lists": photo "no-such-photo" is not in the photo table (src/content/en-IN/stories/photos.ts) (rule 12)');
    head.photo = "kheelu-belly-module";
    expect(refused(head)).toThrow('post "kind-lists": photo "kheelu-belly-module" has no share card, so it cannot head a guide (rule 12)');

    const body = post("kind-images");
    ((body.body.content[2] as Extract<PostBlock, { type: "image" }>).attrs as Record<string, unknown>).photo = "no-such-photo";
    expect(refused(body)).toThrow('post "kind-images": body[2]: photo "no-such-photo" is not in the photo table (src/content/en-IN/stories/photos.ts) (rule 12)');

    const tip = post("kind-lists");
    const tips = tip.body.content[5] as Extract<PostBlock, { type: "bulletList" }>;
    (tips.content[0].attrs as Record<string, unknown>).icon = "no-such-icon";
    expect(refused(tip)).toThrow('post "kind-lists": body[5].content[0]: icon "no-such-icon" is not a DS icon (rule 12)');

    const callout = post("kind-blockquotes");
    ((callout.body.content[2] as Extract<PostBlock, { type: "blockquote" }>).attrs as Record<string, unknown>).icon = "no-such-icon";
    expect(refused(callout)).toThrow('post "kind-blockquotes": body[2]: icon "no-such-icon" is not a DS icon (rule 12)');
  });

  it("rule 13: an upload outside the dashboard's image folder", () => {
    const p = post("kind-upload");
    p.hero = "https://example.org/cover.jpg";
    expect(refused(p)).toThrow(`post "kind-upload": the cover "https://example.org/cover.jpg" is not under ${JOURNAL_IMAGES} (rule 13)`);
  });

  it("rule 17: a post at a redirect's source is dropped from the journal, with a warning; the redirect wins", () => {
    const redirects: RedirectRule[] = [{ source: "/stories/kind-lists", destination: "/stories", permanent: true }];
    const { articles, dropped, warnings } = journalToArticles(KINDS, VOCABULARY, { redirects });
    expect(dropped).toEqual(["kind-lists"]);
    expect(articles.map((a) => a.slug)).not.toContain("kind-lists");
    expect(warnings).toContain('post "kind-lists": its address is a redirect\'s source (src/config/redirects.ts), so the post is left out; unpublish it (rule 17)');
    for (const article of articles) expect(article.related, article.slug).not.toContain("kind-lists");
  });

  it("rule 17 reads the site's one redirect table by default: the two dropped guides of D041 and D053 never become pages", () => {
    const ghost = (slug: string) => ({ ...post("kind-lists"), slug });
    const journal = [...KINDS, ghost("screen-time-rules-parents-swear-by"), ghost("brain-development-toys-for-a-2-year-old")];
    expect(journalToArticles(journal, VOCABULARY).dropped).toEqual(["screen-time-rules-parents-swear-by", "brain-development-toys-for-a-2-year-old"]);
  });

  it("rule 18: a talking guide that links a product page or the store, or has no head photo or cover, or no answer card", () => {
    const linking = (href: string) => {
      const p = post("kind-talking");
      const last = p.body.content.at(-1) as Extract<PostBlock, { type: "paragraph" }>;
      ((last.content![1] as unknown as { marks: { attrs: { href: string } }[] }).marks[0].attrs as { href: string }).href = href;
      return p;
    };
    for (const href of ["/products/kheelu", "/store", "https://store.kheelona.com/", "https://betastore.kheelona.com/x"]) {
      expect(refused(linking(href)), href).toThrow(`post "kind-talking": a guide on the talking topic never links "${href}" (no pitch, B5) (rule 18)`);
    }
    expect(refused(linking("/stories#talking"))).not.toThrow();

    const bare = post("kind-talking");
    bare.photo = null;
    expect(refused(bare)).toThrow('post "kind-talking": a guide on the talking topic needs a head photo or a cover, or its share card would be the product shot (P19) (rule 18)');

    const unanswered = post("kind-talking");
    unanswered.answer = null;
    expect(refused(unanswered)).toThrow('post "kind-talking": a guide on the talking topic needs its answer card, under which D025\'s line prints (rule 18)');
  });

  it("rule 19: related guides that are missing, not published or the post itself are filled from the ring, with a warning", () => {
    const warnings: string[] = [];
    const p = post("kind-headings");
    p.related = ["kind-lists", "kind-headings", "gone"];
    const article = postToArticle(p, { ...options(warnings), offers: ["kind-facts", "kind-lists", "kind-video"] });
    expect(article.related).toEqual(["kind-lists", "kind-facts", "kind-video"]);
    expect(warnings).toEqual(['post "kind-headings": related filled from the ring: kind-facts, kind-video (rule 19)']);
  });

  it("rule 19: where no post names its own, the journal's ring gives every guide three and every guide is offered by three", () => {
    const { articles } = journalToArticles(
      KINDS.map((p) => ({ ...p, related: [] })),
      VOCABULARY,
    );
    const incoming = new Map(articles.map((a) => [a.slug, 0]));
    for (const article of articles) {
      expect(new Set(article.related).size, article.slug).toBe(3);
      expect(article.related, article.slug).not.toContain(article.slug);
      for (const slug of article.related) incoming.set(slug, incoming.get(slug)! + 1);
    }
    expect([...incoming.values()].every((n) => n === 3)).toBe(true);
  });

  it("collects every refused post into one error, so a build lists them all", () => {
    const a = post("kind-lists");
    (a as Record<string, unknown>).theme = "Safety";
    const b = post("kind-facts");
    (b as Record<string, unknown>).author = "Someone Else";
    const journal = KINDS.map((p) => (p.slug === a.slug ? a : p.slug === b.slug ? b : p));
    expect(() => journalToArticles(journal, VOCABULARY)).toThrow(
      /^the journal is refused \(journal-pipeline §8\.2\):\n {2}post "kind-facts": the byline "Someone Else" .*\(rule 11\)\n {2}post "kind-lists": theme "Safety" .*\(rule 10\)$/,
    );
  });

  it("refuses a video in the answer card, which renders its detail without the play word", () => {
    const p = post("kind-video");
    p.body = { type: "doc", content: [p.body.content[2], { type: "horizontalRule" }, ...p.body.content] };
    expect(refused(p)).toThrow('post "kind-video": body[0]: the answer card holds no video; put it after the rule (rule 4)');
  });
});

/* ── row 25: the hub's groups ───────────────────────────────────────────────────────────────────── */

describe("hubGroups (§4 hub featured and order; §8.2 row 25)", () => {
  const { articles, topicOf } = journalToArticles(KINDS, VOCABULARY);

  it("keeps the hub's order and featured guide, and adds a post the hub does not list to its topic, newest first", () => {
    const { groups, warnings } = hubGroups(articles, topicOf, VOCABULARY.topics, [
      { topic: "screen-time", featured: "kind-paragraphs", slugs: ["kind-lists"] },
      { topic: "talking", slugs: ["kind-talking"] },
      { topic: "ai-and-safety", slugs: ["kind-facts", "kind-blockquotes"] },
      { topic: "learning", featured: "kind-images", slugs: ["kind-headings"] },
    ]);
    expect(groups).toEqual([
      { topic: "screen-time", featured: "kind-paragraphs", slugs: ["kind-lists", "kind-upload"] },
      { topic: "talking", slugs: ["kind-talking"] },
      { topic: "ai-and-safety", slugs: ["kind-facts", "kind-blockquotes"] },
      { topic: "learning", featured: "kind-images", slugs: ["kind-headings", "kind-video"] },
    ]);
    expect(warnings).toEqual([]);
  });

  it("skips a featured or listed guide that left the journal or has no photo, and warns of a topic with no guide (row 25)", () => {
    const withoutTalking = articles.filter((a) => a.slug !== "kind-talking");
    const { groups, warnings } = hubGroups(withoutTalking, topicOf, VOCABULARY.topics, [
      { topic: "screen-time", featured: "kind-upload", slugs: ["gone"] },
      { topic: "talking", featured: "kind-talking", slugs: [] },
      { topic: "ai-and-safety", slugs: [] },
      { topic: "learning", slugs: [] },
    ]);
    expect(groups[0]).toEqual({ topic: "screen-time", featured: "kind-upload", slugs: ["kind-lists", "kind-paragraphs"] });
    expect(groups[1]).toEqual({ topic: "talking", slugs: [] });
    expect(warnings).toEqual([
      'hub: "gone" left the journal; skipped (rule 25)',
      'hub: the featured "kind-talking" left the journal; skipped (rule 25)',
      'hub: the topic "talking" has no guide (rule 25)',
    ]);
    const bare = withoutTalking.map((a) => (a.slug === "kind-upload" ? { ...a, head: { ...a.head, image: undefined } } : a));
    expect(hubGroups(bare, topicOf, VOCABULARY.topics, [{ topic: "screen-time", featured: "kind-upload", slugs: [] }]).warnings).toContain(
      'hub: the featured "kind-upload" has no head photo; skipped (rule 25)',
    );
  });
});
