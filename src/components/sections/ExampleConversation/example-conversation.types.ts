import type { Copy, RichTextString } from "@/content/types";

/* ExampleConversation's configuration (task 8c.3; D061, the main session's rulings): a written example of what asking
 * back sounds like, labelled as one (home.md fold 2 variant b; DS 08-accessibility "Children's privacy": conversation
 * snippets in marketing are written by us and clearly illustrative). The product page shows it right after its four
 * steps. */

/** One line of the exchange: who says it ("Your child", "Kheelu") and the words, in their quotation marks. */
export interface ExampleConversationLine {
  readonly speaker: "child" | "kheelu";
  readonly who: string;
  readonly text: RichTextString;
}

export interface ExampleConversationConfig {
  /** The fold's heading; its id names the section ("example-title" by default). */
  readonly heading: { readonly eyebrow?: Copy; readonly title: Copy; readonly id?: string };
  /** The label above the exchange, never removed: "Illustrative example, not a recording." It also names the list. */
  readonly note: string;
  /** The exchange, in order: at least one line. */
  readonly lines: readonly [ExampleConversationLine, ...ExampleConversationLine[]];
  /** The line after the exchange ("It answers first, then asks a question back. …"). */
  readonly after?: Copy;
  /** The section's anchor. */
  readonly id?: string;
  /** The cream band. */
  readonly band?: boolean;
}
