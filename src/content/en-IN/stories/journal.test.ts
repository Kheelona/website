import { basename } from "node:path";
import { describe, expect, it } from "vitest";
import { JOURNAL_IMAGES, JOURNAL_SNAPSHOT, JOURNAL_SOURCE } from "@/config/journal";
import type { Article } from "@/content/types";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import { journalToArticles } from "@/lib/journal/to-article";
import { canonical, editorialWarnings, normalisePosts, serialiseSnapshot, snapshotProblems, type JournalRules } from "@/lib/journal/validate";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { APPROVED_POSTS } from "../../../../test/fixtures/journal/approved";
import { VOCABULARY } from "../../../../test/fixtures/journal/vocabulary";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { faqs } from "../faqs";
import { RETENTION_LINE } from "../policies";
import { product } from "../products/kheelu/product";
import { seller } from "../seller";
import { articles, articleTopic, getArticle, JOURNAL_SLUGS, JOURNAL_VOCABULARY, journal, journalSnapshot } from "./journal";
import { photos } from "./photos";
import { topics } from "./topics";

/* The journal registry (ADR-014; journal-pipeline §2.4, §4, §8; task 8b.2e): the committed snapshot of the dashboard's
 * published posts, through the gate and the adapter, is the site's journal. Pages, the hub, the sitemap, the sticky bar
 * and every article guard read its articles. This file holds the registry, the snapshot to every rule of §8.2 as an
 * error (the verify layer, §8.1: the build only warns on the editorial ones), and the journal-wide rules that the
 * per-guide tests held before the guides left their modules (rows 20, 21 and 24). */

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };
const FILE_TEXT = readRepoFile(JOURNAL_SNAPSHOT);
const FILE = JSON.parse(FILE_TEXT) as { generated: string; posts: { slug: string }[] };
const ALL = Object.values(articles) as Article[];

/* ── The registry ────────────────────────────────────────────────────────────────────────────────── */

describe("the journal registry", () => {
  it("adapts every post of the committed snapshot, under its own slug, in the snapshot's order (by slug)", () => {
    const slugs = FILE.posts.map((p) => p.slug);
    expect(JOURNAL_SLUGS).toEqual(slugs);
    expect(Object.keys(articles)).toEqual(slugs);
    for (const slug of slugs) expect(articles[slug].slug, slug).toBe(slug);
    expect(slugs).toEqual([...slugs].sort());
    expect(slugs).toHaveLength(20);
  });

  it("reads the snapshot through the gate: the posts it holds are the file's", () => {
    expect(canonical(journalSnapshot.posts)).toBe(canonical(FILE.posts));
  });

  it("assembles the site's vocabulary from the content modules, as the adapter's fixtures do", () => {
    expect(JOURNAL_VOCABULARY).toEqual(VOCABULARY);
    expect(JOURNAL_VOCABULARY.team).toEqual({ author: "Kheelona", byline: "The Kheelona team" });
  });

  it("is exactly the adapter's journal for the snapshot: no second renderer, no edit after the adapter", () => {
    expect(ALL).toEqual(journalToArticles(journalSnapshot.posts, VOCABULARY).articles);
  });

  it("finds an article by its URL slug, and nothing outside the journal", () => {
    expect(getArticle("talking-toys-and-late-talkers")).toBe(articles["talking-toys-and-late-talkers"]);
    /* The last two are redirect sources (D041, D053): the redirect wins (§10). */
    for (const slug of ["no-such-guide", "constructor", "__proto__", "toString", "", "screen-time-rules-parents-swear-by", "brain-development-toys-for-a-2-year-old"]) {
      expect(getArticle(slug), slug).toBeUndefined();
    }
  });

  it("gives each article the topic its post names, by the topic's id", () => {
    for (const post of journalSnapshot.posts) expect(articleTopic(post.slug), post.slug).toBe(topics.find((t) => t.title === post.theme)?.id);
    expect(articleTopic("no-such-guide")).toBeUndefined();
  });
});

/* ── The committed snapshot, held to every rule as an error (§8.1 layer 3) ──────────────────────── */

describe("the committed snapshot", () => {
  it("passes the gate a build runs on it: structure, tokens, links, uploads, the topic, banned claims (§8.2 prebuild rows)", () => {
    expect(snapshotProblems(FILE, RULES)).toEqual([]);
  });

  it("raises no editorial warning: markers, spelling, related, answer length, meta lengths (§8.2 rows 7, 16, 19, 22, 23)", () => {
    expect(editorialWarnings(FILE.posts, RULES)).toEqual([]);
  });

  it("raises no adapter warning and drops no post (rows 17, 19, 23: a redirect source, a filled ring, a bad accent)", () => {
    expect(journal.warnings).toEqual([]);
    expect(journal.dropped).toEqual([]);
  });

  it("is in the sync's order, so a refresh diffs cleanly (never edited by hand, §2.4)", () => {
    expect(serialiseSnapshot(FILE.posts, FILE.generated)).toBe(FILE_TEXT);
  });

  it("says it is the export of task 8b.2e while the journal is the committed file (until the flip, §9.5)", () => {
    if (JOURNAL_SOURCE === "snapshot") expect(FILE.generated).toMatch(/^GENERATED by the export of task 8b\.2e /);
  });

  /* The founder signs the export at Gate B (§9.1 step 4), and the copy-page and mockup tests read it from the frozen
     fixtures (§8.3). While the journal is the committed file, what ships is that export, guide by guide, so those tests
     still prove the shipped pages. Once a writer edits a guide after the flip, the main session rules (§12, "article
     parity once a writer edits"). */
  it("equals the approved export, guide by guide, while JOURNAL_SOURCE is \"snapshot\" (test/fixtures/journal/approved)", () => {
    if (JOURNAL_SOURCE !== "snapshot") return;
    expect(APPROVED_POSTS.map((p) => p.slug)).toEqual(FILE.posts.map((p) => p.slug));
    const approved = new Map((normalisePosts(APPROVED_POSTS) as { slug: string }[]).map((p) => [p.slug, canonical(p)]));
    for (const post of normalisePosts(FILE.posts) as { slug: string }[]) expect(canonical(post), post.slug).toBe(approved.get(post.slug));
  });
});

/* ── Journal-wide rules (§8.2 rows 20, 21, 24), moved from the per-guide tests ──────────────────── */

const all = (list: readonly RichNode[]): RichNode[] => list.flatMap((n) => [n, ...("children" in n ? all(n.children) : [])]);

/** Every content string of an article (images' addresses left out). */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, v]) => (key === "src" ? [] : strings(v)));
  return [];
}

function nodes(value: unknown): RichNode[] {
  return strings(value).flatMap((s) => {
    try {
      return all(parseRichText(s));
    } catch {
      return []; // an icon name or a variant, not text
    }
  });
}

const readingStrings = (a: Article) => [a.answer ?? {}, a.body];
const headPhoto = (a: Article) => {
  const src = a.head.image?.src as unknown;
  return src === undefined ? undefined : basename(decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src));
};
/** The guides an article sends readers to: its related list and the article paths linked in its text. */
const linkedGuides = (a: Article): string[] => [
  ...a.related,
  ...nodes(readingStrings(a)).flatMap((n) => (n.kind === "link" && n.href.startsWith("/stories/") ? [n.href.slice("/stories/".length).split("#")[0]] : [])),
];

describe("the journal's photos (rows 20 and 21; from screen-time-articles.test.tsx)", () => {
  it("give each head photo one alt, wherever it heads a guide: the photo table's (row 21)", () => {
    for (const a of ALL) {
      const entry = Object.values(photos).find((p) => p.image.src === a.head.image?.src);
      expect(entry, `${a.slug} is headed by a photo of the table`).toBeDefined();
      expect(a.head.image!.alt, a.slug).toBe(entry!.image.alt);
      const heads = ALL.filter((other) => headPhoto(other) === headPhoto(a));
      expect(new Set(heads.map((other) => other.head.image!.alt)), `${headPhoto(a)} heads ${heads.map((o) => o.slug).join(", ")}`).toEqual(new Set([a.head.image!.alt]));
    }
  });

  it("never share a head photo with a guide they link to, or that links to them (row 20, every guide of the journal)", () => {
    for (const article of ALL) {
      const photo = headPhoto(article);
      const linked = ALL.filter((other) => other.slug !== article.slug && (linkedGuides(article).includes(other.slug) || linkedGuides(other).includes(article.slug)));
      expect(linked.filter((other) => headPhoto(other) === photo).map((other) => other.slug), `${article.slug} (${photo})`).toEqual([]);
    }
  });
});

describe("the journal's markers (D026; from approved-articles.test.tsx, now on every guide)", () => {
  it("each guide cites every note it lists, in reading order, and every marker names a note", () => {
    for (const a of ALL) {
      const order = nodes(readingStrings(a)).flatMap((n) => (n.kind === "source" ? [n.n] : []));
      expect(order.filter((n, i) => order.indexOf(n) === i), a.slug).toEqual(a.sources.map((_, i) => i + 1));
    }
  });
});

/* Row 24: facts other pages print. In a module a guide read them from their own modules; in a post they are literal
   text (§5.3), so a post that prints one must print today's (policies.ts, seller.ts, faqs.ts, product.ts). Each finder
   is proven on a retired wording first, so a rule that finds nothing is never green by accident. */
describe("the facts a guide shares with other pages are today's (row 24)", () => {
  const texts = ALL.flatMap((a) => strings([a.head, a.answer ?? {}, a.body]).map((text) => ({ slug: a.slug, text })));
  /** A text's sentences; a source marker stays with the sentence it ends. */
  const sentencesOf = (text: string) => text.split(/(?<=[.?!](?:\[\^\d+\])*)\s+/);

  /** The retention line: a sentence about chats kept for months, or deleted automatically. */
  const RETENTION = /\bmonths, then\b|deleted automatically/;
  /** The help line: a WhatsApp or call link. */
  const HELP = /\]\((?:tel:|https:\/\/wa\.me\/)/;
  /** The age-3 sentence (D057 item 3): a child of 3 and a grown-up nearby, in one sentence. */
  const AGE_3 = /\b(?:3|three)(?:-year-olds?)?\b[^.]*\bgrown-up (?:nearby|near|close|around|present)/i;
  /** The languages line (questions-parents-ask-about-ai-toys): the languages Kheelu speaks at launch. */
  const LANGUAGES = /languages at launch/;

  it("finds each fact in its retired wording (the finders are not vacuous)", () => {
    expect("Your child’s conversations stay in your parent app for 24 months, then they’re deleted automatically.").toMatch(RETENTION);
    expect("Delete them in one tap. They’re deleted automatically after 36 months.").toMatch(RETENTION);
    expect("you can ask us anything: [WhatsApp](https://wa.me/910000000000) or [call](tel:+910000000000).").toMatch(HELP);
    expect("For 3-year-olds, we advise having a grown-up nearby.").toMatch(AGE_3);
    expect("At three, have a grown-up close by while they play.").toMatch(AGE_3);
    expect("Add enough sleep and a calm grown-up nearby on hard days.").not.toMatch(AGE_3);
    expect("That is what help looks like at 3: a patient grown-up who answers every why.").not.toMatch(AGE_3);
    expect("For three year olds, no more than an hour a day, always supervised by a caregiver.").not.toMatch(AGE_3);
    expect("It speaks English and Hindi, with up to 8 languages at launch.").toMatch(LANGUAGES);
  });

  it("prints the retention line as policies.ts words it, wherever a guide gives it", () => {
    const found = texts.filter(({ text }) => RETENTION.test(text));
    expect(found.length).toBeGreaterThan(0);
    for (const { slug, text } of found) expect(text, slug).toContain(RETENTION_LINE);
  });

  /* D063 item 2 (D064 item 11; task Q2.3): the number shows only on /contact and the legal pages, so a guide offers
     WhatsApp or the email, as seller.ts words the phrase (`support.reach`), and never a call link. */
  it("prints the contact phrase as seller.ts words it (WhatsApp or email), wherever a guide gives a WhatsApp or call link", () => {
    const found = texts.filter(({ text }) => HELP.test(text));
    expect(found.length).toBeGreaterThan(0);
    for (const { slug, text } of found) {
      expect(text, slug).toContain(seller.support.reach);
      expect(text, slug).not.toMatch(/\]\(tel:|91875 46483/);
    }
  });

  it("words the age-3 line as every FAQ answer does: \"If your child is 3, keep a grown-up nearby\" (D057 item 3)", () => {
    const today = "if your child is 3, keep a grown-up nearby";
    expect(faqs["what-ages"].answer as string).toContain("If your child is 3, keep a grown-up nearby.");
    const found = texts.flatMap(({ slug, text }) => sentencesOf(text).filter((s) => AGE_3.test(s)).map((sentence) => ({ slug, sentence })));
    expect(found.length).toBeGreaterThan(0);
    for (const { slug, sentence } of found) expect(sentence.toLowerCase(), slug).toContain(today);
  });

  it("names the languages as product.ts does, wherever a guide lists them", () => {
    const names = product.languages.map((l) => l.name);
    const line = `It speaks ${names.slice(0, -1).join(", ")} and ${names.at(-1)}, with up to ${product.languageCeiling} languages at launch.`;
    const found = texts.flatMap(({ slug, text }) => sentencesOf(text).filter((s) => LANGUAGES.test(s)).map((sentence) => ({ slug, sentence })));
    expect(found.length).toBeGreaterThan(0);
    for (const { slug, sentence } of found) expect(sentence, slug).toBe(line);
  });
});
