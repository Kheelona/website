import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { JOURNAL_IMAGES } from "@/config/journal";
import { topics } from "@/content/en-IN/stories/topics";
import type { Article } from "@/content/types";
import { parseSnapshot, type Post } from "@/lib/journal/post";
import { journalToArticles } from "@/lib/journal/to-article";
import type { JournalRules } from "@/lib/journal/validate";
import { ROOT } from "../../../e2e/support/repo";
import { findBanned } from "../../../guards/banned-phrases.data";
import { VOCABULARY } from "../vocabulary";

/**
 * The approved export (journal-pipeline §8.3, §9.3; task 8b.2e): the 20 rewritten guides as the export wrote them into
 * the snapshot, frozen one post per file (`<slug>.json`, in the snapshot's key order). It is what the founder signs at
 * Gate B, so the tests that held each guide to its copy page (D013) and to its approved mockup read it from here: the
 * dashboard owns the words of the published journal (src/content/en-IN/stories/posts.generated.json), and these files
 * keep the approved words and the template's proof whatever a writer publishes later. Never edited by hand; a guide the
 * founder re-signs is re-frozen from its post with the sync's own order (`--split`).
 *
 * Test support only: the files go through the same gate and adapter as the snapshot, with the site's vocabulary.
 */

export const APPROVED_DIR = join(ROOT, "test/fixtures/journal/approved");

const RULES: JournalRules = { themes: topics.map((t) => t.title), imagesBase: JOURNAL_IMAGES, findBanned };

/** The frozen posts, by slug. */
export const APPROVED_POSTS: readonly Post[] = parseSnapshot(
  {
    generated: "test/fixtures/journal/approved",
    posts: readdirSync(APPROVED_DIR)
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => JSON.parse(readFileSync(join(APPROVED_DIR, file), "utf8")) as unknown),
  },
  RULES,
).posts;

const adapted = journalToArticles(APPROVED_POSTS, VOCABULARY);
if (adapted.warnings.length > 0) throw new Error(`the approved export raises warnings:\n${adapted.warnings.join("\n")}`);

/** The approved export as articles, by slug: each guide as the site renders it from its frozen post. */
export const APPROVED_ARTICLES: Readonly<Record<string, Article>> = Object.fromEntries(adapted.articles.map((a) => [a.slug, a]));

/** One approved guide as an article, or a throw naming the slug. */
export function approvedArticle(slug: string): Article {
  if (!Object.hasOwn(APPROVED_ARTICLES, slug)) throw new Error(`no approved export for "${slug}" in test/fixtures/journal/approved`);
  return APPROVED_ARTICLES[slug];
}

/** One approved guide's frozen post, or a throw naming the slug. */
export function approvedPost(slug: string): Post {
  const post = APPROVED_POSTS.find((p) => p.slug === slug);
  if (post === undefined) throw new Error(`no approved export for "${slug}" in test/fixtures/journal/approved`);
  return post;
}
