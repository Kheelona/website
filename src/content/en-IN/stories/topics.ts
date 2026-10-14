/**
 * The four stories topics (architecture §6.1; strategy §5 "/stories"): the hub's sections, its
 * jump links and the articles' breadcrumbs all name a topic from here. `id` is the hub anchor
 * (`/stories#learning`) and never changes. Which articles sit under which topic is hub.ts.
 *
 * A topic also decides what a guide on it never stores (ADR-014; journal-pipeline §4): a dashboard post names its
 * topic by `title` (its `theme`, B1), and its close and the line under its answer come from here. The talking guides
 * close without the pre-order button (B5) and carry D025's line, once, here.
 *
 * NO IMPORTS, AND NOTHING BUT ERASABLE TYPESCRIPT: scripts/journal/sync-posts.mjs imports this file with Node's type
 * stripping for the themes a post may name (journal-pipeline §2.2). topics.test.ts fails first if it gains an import.
 */

export interface Topic {
  readonly id: string;
  /** The section heading, the jump link and the crumb; also a dashboard post's `theme`. */
  readonly title: string;
  readonly lead: string;
  /** How every guide on the topic closes: `journal`, the related guides and the pre-order button; `keep`, the
   *  keep-reading links and no button (B5). */
  readonly close: "journal" | "keep";
  /** The line under the answer of every guide on the topic: D025's disclaimer, on the talking topic only. */
  readonly disclaimer?: string;
}

export const topics = [
  {
    id: "screen-time",
    title: "Screen time",
    lead: "How much, what the guidelines say, and what to do when the screen goes off.",
    close: "journal",
  },
  {
    id: "talking",
    title: "Talking and language",
    lead: "Getting your child talking, late talkers, new words and two languages at home.",
    close: "keep",
    /* D025 (founder, 2026-10-10): a guide about speech keeps the one-line disclaimer; the talking guides' copy pages
       print it under the answer, word for word (story-talking-toys-and-late-talkers.md fold 2). */
    disclaimer: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
  },
  {
    id: "ai-and-safety",
    title: "AI toys and safety",
    lead: "What to check before an AI toy comes home, and what the law asks of the company behind it.",
    close: "journal",
  },
  {
    id: "learning",
    title: "Learning and play",
    lead: "What a young child is working on, and the toys and habits that serve it.",
    close: "journal",
  },
] as const satisfies readonly Topic[];

export type TopicId = (typeof topics)[number]["id"];
