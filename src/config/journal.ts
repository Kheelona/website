/** The journal's source switch and addresses (ADR-014; journal-pipeline §2.1, §2.2, §6).
 *
 *  The journal's words are written in the admin dashboard (admin.kheelona.com → Blog). The build reads a committed
 *  snapshot of the published posts, `JOURNAL_SNAPSHOT`, which `scripts/journal/sync-posts.mjs` refreshes from the API
 *  only on a production build with `JOURNAL_SOURCE === "api"` (or by hand, `BLOG_SYNC=on`). Everything else (verify,
 *  dev, e2e, beta, the Gate B dry run) reads the committed file and makes no request.
 *
 *  🔴 NO IMPORTS, AND NOTHING BUT ERASABLE TYPESCRIPT, like `src/config/env.ts`: `next.config.ts` imports this file by
 *  relative path (Next resolves no `@/` alias in the config's own import graph) and the sync script imports it with
 *  Node's type stripping. test/journal-sync.test.ts fails first if it gains an import or an enum. */

export type JournalSource = "snapshot" | "api";

/** "snapshot" until the 20 guides are imported into the dashboard after Gate B and
 *  `node scripts/journal/sync-posts.mjs --check` proves the API returns the committed file unchanged (journal-pipeline
 *  §9.1 steps 6-8, D059 item 3). Then one commit, with the founder's OK, flips it to "api". */
export const JOURNAL_SOURCE: JournalSource = "snapshot";

/** The dashboard's API. `BLOG_API_URL` overrides it for one run (main's name, kept). */
export const JOURNAL_API = "https://api.kheelona.com/v1";

/** The published posts, under `JOURNAL_API`: `{ status, data: { posts } }`. */
export const JOURNAL_POSTS_PATH = "/public/blog/posts";

/** Where an uploaded cover or body image lives. The one remote image source of the journal: `next.config.ts`
 *  allows exactly this path in `images.remotePatterns`, and the validator refuses an upload anywhere else. A literal
 *  type (`as const`), so content/types.ts derives `JournalImageUrl` from it. */
export const JOURNAL_IMAGES = `${JOURNAL_API}/public/blog/images/` as const;

/** YouTube stills for the journal's videos (`ui/VideoEmbed`): fetched by our image optimiser, never by the reader's
 *  browser before a press (journal-pipeline §7). Allowed in `images.remotePatterns` beside `JOURNAL_IMAGES`. */
export const VIDEO_STILLS = "https://i.ytimg.com/vi/";

/** The committed snapshot, from the repo root. Generated: never edited by hand (journal-pipeline §2.4). */
export const JOURNAL_SNAPSHOT = "src/content/en-IN/stories/posts.generated.json";
