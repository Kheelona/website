/**
 * The four stories topics (architecture §6.1; strategy §5 "/stories"): the hub's sections, its
 * jump links and the articles' breadcrumbs all name a topic from here. `id` is the hub anchor
 * (`/stories#learning`) and never changes. Which articles sit under which topic is hub.ts.
 */

export interface Topic {
  readonly id: string;
  /** The section heading, the jump link and the crumb. */
  readonly title: string;
  readonly lead: string;
}

export const topics = [
  {
    id: "screen-time",
    title: "Screen time",
    lead: "How much, what the guidelines say, and what to do when the screen goes off.",
  },
  {
    id: "talking",
    title: "Talking and language",
    lead: "Getting your child talking, late talkers, new words and two languages at home.",
  },
  {
    id: "ai-and-safety",
    title: "AI toys and safety",
    lead: "What to check before an AI toy comes home, and what the law asks of the company behind it.",
  },
  {
    id: "learning",
    title: "Learning and play",
    lead: "What a young child is working on, and the toys and habits that serve it.",
  },
] as const satisfies readonly Topic[];

export type TopicId = (typeof topics)[number]["id"];
