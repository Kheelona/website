import { describe, expect, it } from "vitest";
import { JOURNAL_SNAPSHOT } from "@/config/journal";
import type { Post, PostBlock, PostInline } from "@/lib/journal/post";
import { readRepoFile } from "../e2e/support/repo";
import { BANNED_PHRASES, findBanned } from "./banned-phrases.data";

/* banned-phrases over the journal (journal-pipeline §8.3, the banned-phrases row; §8.2 rows 15 and 16; task 8b.2e).
 *
 * Until task 8b.2e the 20 guides were content modules, so test/guards/banned-phrases.test.ts (item 4: every string of
 * src/content/**) read their words. Now they are the committed snapshot of the dashboard's posts, a JSON file that scan
 * never parsed, so this guard reads every text field of every post: the words a reader sees (titles, lead, summary,
 * answer, every block's text as one run, captions and alts, source labels, the age note), each through findBanned with
 * all three kinds (claims, retired offer terms, en-IN spelling), as item 4 does. The build's gate checks claims and
 * offer terms too (prebuild step 15); spelling is a build warning there and an error here (§8.1). A second test proves
 * the walk reaches every string of a post that is not an address, a key or a date, so a new field is never skipped. */

const SNAPSHOT = JSON.parse(readRepoFile(JOURNAL_SNAPSHOT)) as { posts: Post[] };

/** The keys whose strings are not words a reader sees: addresses, keys, slugs, dates, names of icons and styles. */
const NOT_TEXT = new Set([
  "slug", "theme", "author", "published", "updated", "pose", "tint", "hero", "url", "href", "src", "photo", "icon",
  "style", "anchor", "provider", "videoId", "type", "related",
]);

interface Text {
  readonly where: string;
  readonly text: string;
}

const run = (content: readonly PostInline[] | undefined) => (content ?? []).map((n) => (n.type === "text" ? n.text : " ")).join("");

/** Every block's words: a paragraph or heading as one run (a phrase never hides across a link), an item, a caption. */
function blockTexts(block: PostBlock, where: string): Text[] {
  switch (block.type) {
    case "paragraph":
    case "heading":
      return [{ where, text: run(block.content) }];
    case "bulletList":
    case "orderedList":
      return block.content.map((item, i) => ({ where: `${where}.content[${i}]`, text: run(item.content[0].content) }));
    case "blockquote":
      return block.content.flatMap((child, i) => blockTexts(child, `${where}.content[${i}]`));
    case "image":
      return [
        { where: `${where}.alt`, text: block.attrs.alt },
        { where: `${where}.caption`, text: block.attrs.caption },
      ];
    case "videoEmbed":
      return [
        { where: `${where}.title`, text: block.attrs.title },
        { where: `${where}.caption`, text: block.attrs.caption },
      ];
    case "horizontalRule":
      return [];
  }
}

/** Every text field of a post. */
function postTexts(post: Post): Text[] {
  const fields = (["title", "description", "heroAlt", "ageNote", "metaTitle", "cardTitle", "accent", "lead", "summary"] as const).flatMap(
    (key): Text[] => (typeof post[key] === "string" ? [{ where: key, text: post[key] as string }] : []),
  );
  return [
    ...fields,
    ...(post.answer ? [{ where: "answer.question", text: post.answer.question }, { where: "answer.text", text: post.answer.text }] : []),
    ...post.sources.map((source, i) => ({ where: `sources[${i}].label`, text: source.label })),
    ...post.body.content.flatMap((block, i) => blockTexts(block, `body[${i}]`)),
  ];
}

/** Every string leaf of a value whose key is not in NOT_TEXT, by path. */
function stringLeaves(value: unknown, path = ""): Text[] {
  if (typeof value === "string") return [{ where: path, text: value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => stringLeaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, v]) => (NOT_TEXT.has(key) ? [] : stringLeaves(v, path ? `${path}.${key}` : key)));
  }
  return [];
}

function problems(posts: readonly Post[]): string[] {
  return posts.flatMap((post) =>
    postTexts(post).flatMap(({ where, text }) => findBanned(text).map((h) => `post "${post.slug}" ${where} ${h.id}: "${h.match}" in "${h.sentence}"`)),
  );
}

describe("the journal snapshot carries no banned phrase (journal-pipeline §8.3)", () => {
  it("reads all 20 posts of the committed snapshot", () => {
    expect(SNAPSHOT.posts).toHaveLength(20);
  });

  it("checks every text field of every post: no banned claim, retired offer term or US spelling", () => {
    const found = problems(SNAPSHOT.posts);
    console.log(`[journal-snapshot] ${BANNED_PHRASES.length} entries; scanned ${SNAPSHOT.posts.length} posts.`);
    expect(found, found.join("\n")).toEqual([]);
  });

  it("reaches every string of a post that a reader can see: each one is inside a text it scans", () => {
    for (const post of SNAPSHOT.posts) {
      const scanned = postTexts(post).map((t) => t.text).join("\n");
      const missed = stringLeaves(post).filter(({ text }) => !scanned.includes(text));
      expect(missed, post.slug).toEqual([]);
    }
  });

  it("is red on a planted claim, offer term and spelling, in a field, a paragraph across a link, a caption and a source", () => {
    const post = structuredClone(SNAPSHOT.posts[0]) as { -readonly [K in keyof Post]: Post[K] };
    const planted: Post = {
      ...post,
      lead: "Kheelu listens only for its wake word.",
      sources: [...post.sources, { label: "The Color of words, 2026.", url: "https://example.org/x" }],
      body: {
        type: "doc",
        content: [
          ...post.body.content,
          { type: "paragraph", content: [{ type: "text", text: "Kheelu wakes " }, { type: "text", text: "to a word", marks: [{ type: "link", attrs: { href: "/safety" } }] }, { type: "text", text: "." }] },
          { type: "image", attrs: { src: "", alt: "A child.", caption: "Kheelu's mic is off the rest of the time.", width: null, height: null, photo: "ira-04-paper-crown" } },
        ],
      },
    };
    const found = problems([planted]).map((p) => p.replace(/: ".*$/, ":"));
    expect(found).toEqual(expect.arrayContaining([
      expect.stringMatching(/^post "[a-z0-9-]+" lead wake-word:$/),
      expect.stringMatching(/^post "[a-z0-9-]+" body\[\d+\] wakes-to-a-word:$/),
      expect.stringMatching(/^post "[a-z0-9-]+" body\[\d+\]\.caption mic-off-rest-of-time:$/),
      expect.stringMatching(/^post "[a-z0-9-]+" body\[\d+\]\.caption mic-is-off:$/),
      expect.stringMatching(/^post "[a-z0-9-]+" sources\[\d+\]\.label [a-z-]+:$/),
    ]));
  });
});
