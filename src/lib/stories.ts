import data from "./stories.data.json";

/** The journal (kheelona.com/stories). Since 2026-10-13 every article is written in the
 *  admin dashboard (admin.kheelona.com → Blog): writers draft, an admin publishes, and
 *  publishing rebuilds this site. `tools/blog/sync.mjs` pulls the published posts into
 *  `stories.data.json` before `next build`, so every article is still a static page.
 *
 *  The 22 articles that used to be typed into this file (and `stories-expansion.ts`)
 *  were imported into the dashboard with their slugs, dates, bylines, covers, sources
 *  and words unchanged; `stories.data.json` was first written from them, verbatim.
 *  Their history is in git before the commit that deleted them. */

/** A post body: a ProseMirror document, sanitised by the backend to these nodes. */
export type StoryText = {
  type: "text";
  text: string;
  marks?: ({ type: "bold" } | { type: "link"; attrs: { href: string } })[];
};
export type StoryInline = StoryText | { type: "hardBreak" };
export type StoryBlock =
  | { type: "paragraph"; content?: StoryInline[] }
  | { type: "heading"; attrs: { level: 2 | 3 }; content?: StoryInline[] }
  | { type: "bulletList" | "orderedList"; content: StoryListItem[] }
  | { type: "blockquote"; content: StoryBlock[] }
  | { type: "horizontalRule" }
  | {
      type: "image";
      attrs: {
        src: string;
        alt: string;
        caption: string;
        width: number | null;
        height: number | null;
      };
    }
  | {
      type: "videoEmbed";
      attrs: {
        provider: "youtube" | "vimeo";
        videoId: string;
        title: string;
        caption: string;
      };
    };
export type StoryListItem = { type: "listItem"; content: StoryBlock[] };
export type StoryDoc = { type: "doc"; content: StoryBlock[] };

export type Story = {
  slug: string;
  title: string;
  description: string;
  theme: string;
  /** Byline: one of the four people on /team, or "Kheelona" for the company. Every
   *  author resolves to an entity in `lib/seo` (§8.35-d); the dashboard only offers
   *  those names, and `authorRef` throws on anything else so a drift fails the build. */
  author: string;
  /** ISO date the article first went live. Set once, on its first publish (the
   *  imported articles keep the git-derived dates they had, §8.35-a). */
  published: string;
  /** ISO date of the last reader-visible change that went live. Feeds
   *  `dateModified`, the visible byline and the sitemap `lastmod`. */
  updated: string;
  pose: "curious" | "silly" | "joy" | "bliss" | "grumpy" | "sad";
  tint: string;
  /** Cover image: a path under /public (the imported articles) or our blog storage. */
  hero: string | null;
  heroAlt: string;
  heroWidth: number | null;
  heroHeight: number | null;
  /** An age caveat, shown as an aside under the article, for pieces whose SUBJECT is a
   *  child younger than Kheelu's band (agency audit 2026-09-05). */
  ageNote: string | null;
  /** The documents the piece leans on, rendered under it AND emitted as the
   *  BlogPosting `citation` from this one array (§8.35-c). */
  sources: readonly { label: string; url: string }[];
  body: StoryDoc;
};

export const STORIES: Story[] = data as Story[];

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}

/** The text of a block, inline runs joined: a link counts as its label. */
function inlineText(content: StoryInline[] | undefined): string {
  return (content ?? [])
    .map((n) => (n.type === "text" ? n.text : " "))
    .join("");
}

/** Every readable block's text, in order: headings, paragraphs, list items, quotes.
 *  Captions and alt text are not read as prose and do not count. */
export function storyText(story: Pick<Story, "body">): string[] {
  const out: string[] = [];
  const walk = (block: StoryBlock | StoryListItem) => {
    if (block.type === "paragraph" || block.type === "heading")
      out.push(inlineText(block.content));
    else if ("content" in block && Array.isArray(block.content)) {
      for (const child of block.content as (StoryBlock | StoryListItem)[])
        walk(child);
    }
  };
  story.body.content.forEach(walk);
  return out;
}

/** Words a reader actually reads: headings, paragraphs, lists and quotes. */
export function wordCount(story: Pick<Story, "body">): number {
  return storyText(story).reduce(
    (n, text) => n + text.split(/\s+/).filter(Boolean).length,
    0,
  );
}

/** Read time DERIVED from the words, never typed (§8.35-b). 200 words a minute is
 *  the usual adult reading pace for plain prose; the floor is one minute. */
export function readingMinutes(story: Pick<Story, "body">): number {
  return Math.max(1, Math.round(wordCount(story) / 200));
}

/** Every link in the body (internal-link and citation guards read this). */
export function storyLinks(
  story: Pick<Story, "body">,
): { label: string; href: string }[] {
  const out: { label: string; href: string }[] = [];
  const walk = (
    node: { type: string; content?: unknown[] } & Partial<StoryText>,
  ) => {
    if (node.type === "text") {
      for (const m of node.marks ?? [])
        if (m.type === "link")
          out.push({ label: node.text ?? "", href: m.attrs.href });
    }
    for (const child of (node.content ?? []) as (typeof node)[]) walk(child);
  };
  walk(story.body as unknown as Parameters<typeof walk>[0]);
  return out;
}

/** The ISO date as schema.org and Open Graph want it: a full datetime with a
 *  timezone. Google's Rich Results Test flagged the bare "2026-07-28" on every
 *  article as "missing a timezone" (non-critical, 2026-09-05). The articles were
 *  committed on Indian time and we know the day, not the minute, so the honest
 *  precision is the start of that day in IST. The data keeps the bare date;
 *  only the emitted markup carries the time. */
export function schemaDate(iso: string): string {
  return `${iso}T00:00:00+05:30`;
}

/** "28 July 2026" from "2026-07-28". UTC so the day never shifts with the
 *  build machine's timezone; en-IN for the day-month-year order this site uses. */
export function formatStoryDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** The journal's freshness line: the most recent `updated` across the journal,
 *  derived from the data so the /stories lede cannot go stale on its own. */
export function latestUpdated(stories: readonly Story[] = STORIES): string {
  return stories.map((s) => s.updated).sort().at(-1) ?? "";
}

/** The journal in reading order: grouped by theme, original order kept inside
 *  each group, themes in the order they first appear. Pure derivation of
 *  STORIES, so adding an article cannot make it drift. */
const BY_THEME: Story[] = (() => {
  const themes = [...new Set(STORIES.map((s) => s.theme))];
  return themes.flatMap((theme) => STORIES.filter((s) => s.theme === theme));
})();

/** The three articles to offer at the foot of a piece.
 *
 *  WHY THIS EXISTS (2026-08-12). Every article was a dead end. Fifteen of the
 *  nineteen had exactly ONE incoming internal link, all of them from /stories,
 *  and no article linked to any other — so crawl equity pooled on Home and
 *  never reached the pages the journal is written to rank. Ahrefs flagged it as
 *  "only one dofollow incoming internal link"; a crawl of the live sitemap
 *  confirmed the shape exactly.
 *
 *  It is a RING over the theme-sorted journal: each article offers the one
 *  before it and the next two after it, wrapping at the ends. That one decision
 *  buys three properties that matter more than they look:
 *
 *  1. **Even coverage, by construction.** If everyone offers three, everyone is
 *     offered by exactly three. No article can be starved, which is the whole
 *     defect. The obvious design — "same theme first, then fill" — was written
 *     first and FAILED here: articles in the four large themes filled all three
 *     slots from their own theme and never reached the fill, so "Safety" and
 *     "Languages at home", which hold one article each, ended up with ZERO
 *     incoming links. The guard in test/internal-links.test.ts caught it.
 *  2. **Theme relevance, without theme prisons.** Neighbours in a theme-sorted
 *     list are nearly always same-theme, so a reader who finished a screen-time
 *     piece is offered more screen-time pieces. Reaching BACKWARDS by one is
 *     what makes that hold at the edges: an article at the end of its theme
 *     group would otherwise look only forwards, into the next theme, and get no
 *     same-theme offer at all. With the backward step, every article in a theme
 *     of two or more always has at least one true neighbour. The crossings that
 *     remain are the feature that stops the journal fragmenting into six
 *     islands a crawler cannot get between.
 *  3. **One connected cycle.** Every article is reachable from every other by
 *     following the block, so a crawler that lands anywhere can walk the lot.
 *
 *  Deliberately no randomness. `Math.random` here would hand a different link
 *  graph to every build, so the internal linking a crawler saw last week would
 *  not be the one it sees today, and the guard could not prove anything. */
export function getRelatedStories(slug: string, count = 3): Story[] {
  const index = BY_THEME.findIndex((s) => s.slug === slug);
  if (index === -1) return [];

  const n = BY_THEME.length;
  const wanted = Math.min(count, n - 1);
  /* One step back, then forward. Every offset is used by every article, so each
     article is offered by exactly `wanted` others: the coverage guarantee is
     arithmetic, not a heuristic that happens to work on today's nineteen. */
  const offsets = [-1, ...Array.from({ length: wanted - 1 }, (_, i) => i + 1)];
  return offsets.slice(0, wanted).map((offset) => BY_THEME[(index + offset + n) % n]);
}
