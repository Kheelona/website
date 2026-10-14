import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import { topics } from "@/content/en-IN/stories/topics";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { parseSnapshot, type JournalSnapshot, type Post, type PostBlock } from "./post";
import { POST_KEYS, type JournalRules } from "./validate";

/**
 * The post contract (journal-pipeline §3) as types, and the one typed way in: `parseSnapshot` checks the snapshot with
 * the gate (./validate.ts) and only then hands back `Post`s, so a reader never casts unchecked JSON (as main's
 * `data as Story[]` did, main:src/lib/stories.ts:79).
 */

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };
const FIXTURE: unknown = JSON.parse(readFileSync(join(process.cwd(), "test/fixtures/journal/posts.fixture.json"), "utf8"));

describe("the post contract's types", () => {
  it("names every key the snapshot orders, and no other (POST_KEYS is keyof Post)", () => {
    expectTypeOf<(typeof POST_KEYS)[number]>().toEqualTypeOf<keyof Post>();
  });

  it("takes the eight block nodes of the contract and no other", () => {
    expectTypeOf<PostBlock["type"]>().toEqualTypeOf<
      "paragraph" | "heading" | "bulletList" | "orderedList" | "blockquote" | "horizontalRule" | "image" | "videoEmbed"
    >();
  });
});

describe("parseSnapshot", () => {
  it("hands back the fixture's posts, typed, once they pass the gate", () => {
    const snapshot: JournalSnapshot = parseSnapshot(FIXTURE, RULES);
    expect(snapshot.posts.map((p) => p.slug)).toEqual([
      "fixture-ai-safety-guide",
      "fixture-learning-guide",
      "fixture-screen-time-guide",
      "fixture-talking-guide",
    ]);
    expectTypeOf(snapshot.posts[0].body.content).toEqualTypeOf<readonly PostBlock[]>();
  });

  it("throws on a snapshot the gate refuses, listing every problem with its post and rule", () => {
    const bad = structuredClone(FIXTURE) as { posts: Record<string, unknown>[] };
    bad.posts[0].theme = "Safety";
    bad.posts[1].pose = "angry";
    expect(() => parseSnapshot(bad, RULES)).toThrow(
      /the journal snapshot is refused \(journal-pipeline §8\.2\):\n {2}post "fixture-ai-safety-guide": theme "Safety" .*\(rule 10\)\n {2}post "fixture-learning-guide": unknown pose "angry" \(rule 4\)$/,
    );
  });

  it("throws on a snapshot of too few posts", () => {
    const short = structuredClone(FIXTURE) as { posts: unknown[] };
    short.posts.length = 3;
    expect(() => parseSnapshot(short, RULES)).toThrow(/has 3 posts; it needs at least 4/);
  });
});
