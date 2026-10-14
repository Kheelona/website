import { ICON_PATHS } from "@/assets/icons.generated";
import { JOURNAL_IMAGES } from "@/config/journal";
import type { Article } from "@/content/types";
import { parseSnapshot, type JournalSnapshot } from "@/lib/journal/post";
import { journalToArticles, type AdaptedJournal, type JournalVocabulary } from "@/lib/journal/to-article";
import type { JournalRules } from "@/lib/journal/validate";
import { DEFAULT_OG, organization, TEAM_BYLINE } from "../organization";
import { photos } from "./photos";
import snapshot from "./posts.generated.json";
import { topics, type TopicId } from "./topics";

/**
 * The journal registry (ADR-014; journal-pipeline §2, §4, §8.1; task 8b.2e): the articles of /stories, read from the
 * committed snapshot of the admin dashboard's published posts, `posts.generated.json`. Writers publish in the dashboard
 * (admin.kheelona.com → Blog); prebuild step 15 (scripts/journal/sync-posts.mjs) checks the file, or refreshes it from
 * the API on a production build once `JOURNAL_SOURCE` is "api"; this module turns each post into the rebuild's
 * `Article` with the one adapter (src/lib/journal/to-article.ts). The article route, the hub, the sitemap, the sticky
 * bar and every article guard read the articles from here, so a new story is a published post and nothing else.
 *
 * The three layers of §8.1: the gate in prebuild (structure, tokens, links, the count, banned claims and retired offer
 * terms, with test/guards/banned-phrases.data.ts), this module in `next build` (the snapshot's structure again, then the
 * site's vocabulary: topic, byline, photo keys, icon names, the talking rules; a refusal throws and names the post and
 * the rule), and `npm run verify` on the committed file (every rule as an error, journal.test.ts and
 * test/guards/journal-snapshot.test.ts). The banned list stays the gate's and verify's: `src` never imports test code.
 *
 * Never edit the snapshot by hand: refresh it with `BLOG_SYNC=on node scripts/journal/sync-posts.mjs`, run
 * `npm run verify`, commit it.
 */

/** The dashboard's byline for the company (main:src/lib/stories.ts:53-56), printed as the team's. */
const TEAM_AUTHOR = "Kheelona";

/** The site's vocabulary for the adapter: the topics (close, D025 line), the photo table, the 76 DS icon names, the
 *  founders' bylines and the team's, and the share card of a guide with neither a photo nor a cover. */
export const JOURNAL_VOCABULARY: JournalVocabulary = {
  topics,
  photos,
  icons: Object.keys(ICON_PATHS),
  people: organization.founders.map((founder) => founder.name),
  team: { author: TEAM_AUTHOR, byline: TEAM_BYLINE },
  defaultOg: DEFAULT_OG,
};

/** The gate's rules for the snapshot's structure. Banned claims are checked in prebuild and in verify (above). */
const RULES: JournalRules = {
  themes: topics.map((topic) => topic.title),
  imagesBase: JOURNAL_IMAGES,
  findBanned: () => [],
};

/** The committed snapshot, typed once it passes the gate (a throw lists every problem with its post and rule). */
export const journalSnapshot: JournalSnapshot = parseSnapshot(snapshot, RULES);

/** The journal as articles: redirect sources dropped (the redirect wins, §10), related guides filled from the ring. */
export const journal: AdaptedJournal = journalToArticles(journalSnapshot.posts, JOURNAL_VOCABULARY);

/* The build's warnings (§8.2's warning column): printed, and the build goes on; verify fails on any. */
for (const warning of journal.warnings) console.warn(`journal: ${warning}`);

/** The published articles' slugs, in the snapshot's order (by slug). */
export const JOURNAL_SLUGS: readonly string[] = journal.articles.map((article) => article.slug);

/** Every article, by slug. */
export const articles: Readonly<Record<string, Article>> = Object.freeze(Object.fromEntries(journal.articles.map((article) => [article.slug, article])));

/** The article for a URL slug, or undefined for anything the journal does not publish. */
export function getArticle(slug: string): Article | undefined {
  return Object.hasOwn(articles, slug) ? articles[slug] : undefined;
}

/** The topic an article's post names (its `theme`), by the topic's id; undefined for a slug the journal lacks. */
export function articleTopic(slug: string): TopicId | undefined {
  return journal.topicOf.get(slug) as TopicId | undefined;
}
