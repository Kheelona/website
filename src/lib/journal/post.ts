/** A journal post, as the admin dashboard publishes it (ADR-014; journal-pipeline §3, the post contract).
 *
 *  Main's sixteen fields (main:src/lib/stories.ts:48-77) and the backend's additions (journal-pipeline §13, B1-B2).
 *  A post is a ProseMirror document whitelisted to eight block nodes; text may carry the site's tokens `[^n]`,
 *  `{price:…}` and `{delivery}` and nothing else in braces or brackets. The runtime half of the contract (what is
 *  refused, the snapshot's order) is `./validate.ts`; `parseSnapshot` below is the one typed way from the JSON to
 *  these types. `theme` and `author` are plain strings here: the topic titles and the bylines are content
 *  (src/content/en-IN), which `lib` never imports (structure §6); the gate and the adapter hold them to their lists. */

import { snapshotProblems, type JournalRules } from "./validate";

export type PostMark = { readonly type: "bold" } | { readonly type: "link"; readonly attrs: { readonly href: string } };

export type PostText = { readonly type: "text"; readonly text: string; readonly marks?: readonly PostMark[] };

export type PostInline = PostText | { readonly type: "hardBreak" };

export type PostParagraph = { readonly type: "paragraph"; readonly content?: readonly PostInline[] };

export type PostHeading = {
  readonly type: "heading";
  /** `anchor`: kebab-case, level 2 only (B2): the part's fragment, `#brain-development`. */
  readonly attrs: { readonly level: 2 | 3; readonly anchor?: string | null };
  readonly content?: readonly PostInline[];
};

/** One paragraph per item, never a nested list (B2). `icon`, a DS icon name, is required for tips and facts. */
export type PostListItem = {
  readonly type: "listItem";
  readonly attrs?: { readonly icon?: string | null };
  readonly content: readonly [PostParagraph];
};

export type PostListStyle = "bullets" | "checks" | "tips" | "facts";

export type PostBulletList = {
  readonly type: "bulletList";
  readonly attrs?: { readonly style?: PostListStyle };
  readonly content: readonly PostListItem[];
};

export type PostOrderedList = { readonly type: "orderedList"; readonly content: readonly PostListItem[] };

/** `callout` (the default): one paragraph and a DS icon. `questions`: level-3 headings, each followed by its answer's
 *  paragraphs. */
export type PostBlockquote = {
  readonly type: "blockquote";
  readonly attrs?: { readonly style?: "callout" | "questions"; readonly icon?: string | null };
  readonly content: readonly (PostParagraph | PostHeading)[];
};

export type PostHorizontalRule = { readonly type: "horizontalRule" };

/** A DS photo by key (`photo`, B2), whose alt comes from the site's photo table and whose `src` is ignored; or an
 *  upload under `JOURNAL_IMAGES` with its size and alt. */
export type PostImage = {
  readonly type: "image";
  readonly attrs: {
    readonly src: string;
    readonly alt: string;
    readonly caption: string;
    readonly width: number | null;
    readonly height: number | null;
    readonly photo?: string | null;
  };
};

export type PostVideo = {
  readonly type: "videoEmbed";
  readonly attrs: { readonly provider: "youtube" | "vimeo"; readonly videoId: string; readonly title: string; readonly caption: string };
};

export type PostBlock =
  | PostParagraph
  | PostHeading
  | PostBulletList
  | PostOrderedList
  | PostBlockquote
  | PostHorizontalRule
  | PostImage
  | PostVideo;

export type PostSource = { readonly label: string; readonly url: string };

/** The answer card: a question ending "?" and a 40-60 word answer (architecture §9.5). */
export type PostAnswer = { readonly question: string; readonly text: string };

export type Post = {
  readonly slug: string;
  /** The h1 and the BlogPosting headline. */
  readonly title: string;
  /** The meta description, at most 155 characters. */
  readonly description: string;
  /** A topic title of src/content/en-IN/stories/topics.ts. */
  readonly theme: string;
  /** A byline the site lists (organization.ts), or "Kheelona" for the team. */
  readonly author: string;
  /** YYYY-MM-DD; `updated` is never before `published`. */
  readonly published: string;
  readonly updated: string;
  /** Kept for the backend; the new design shows neither. */
  readonly pose: string;
  readonly tint: string;
  /** An upload under `JOURNAL_IMAGES` (with its size and alt), or null. */
  readonly hero: string | null;
  readonly heroAlt: string;
  readonly heroWidth: number | null;
  readonly heroHeight: number | null;
  readonly ageNote: string | null;
  readonly sources: readonly PostSource[];
  readonly body: { readonly type: "doc"; readonly content: readonly PostBlock[] };
  /* The additions (B1): nullable, and absent on a post the API returned before the backend change. */
  /** The <title> as written, at most 60 characters. */
  readonly metaTitle?: string | null;
  /** The hub card's title and other guides' related links. */
  readonly cardTitle?: string | null;
  /** A phrase that occurs once in `title`, set in the hand face. */
  readonly accent?: string | null;
  readonly lead?: string | null;
  /** The hub card's line. */
  readonly summary?: string | null;
  readonly answer?: PostAnswer | null;
  /** A DS image key the site publishes (the head photo and its share card). */
  readonly photo?: string | null;
  /** [] or three published slugs, not its own; the ring fills what is missing. */
  readonly related?: readonly string[];
};

/** The committed snapshot, `src/content/en-IN/stories/posts.generated.json` (journal-pipeline §2.4). */
export type JournalSnapshot = { readonly generated: string; readonly posts: readonly Post[] };

/** The snapshot, typed, once it passes the gate; otherwise a throw that lists every problem with its post and rule,
 *  so a build that imports a refused snapshot stops and says why. */
export function parseSnapshot(value: unknown, rules: JournalRules): JournalSnapshot {
  const problems = snapshotProblems(value, rules);
  if (problems.length) {
    throw new Error(`the journal snapshot is refused (journal-pipeline §8.2):\n${problems.map((p) => `  ${p}`).join("\n")}`);
  }
  return value as JournalSnapshot;
}
