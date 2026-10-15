import type { Copy, RichTextString } from "@/content/types";

/* ExampleConversation's configuration (task 8c.3; D061, the main session's rulings): a written example of what asking
 * back sounds like, labelled as one (home.md fold 2 variant b; DS 08-accessibility "Children's privacy": conversation
 * snippets in marketing are written by us and clearly illustrative). Since task Q2.10 (the D2C plan v2 §3 fold 6,
 * ruling 6) the product page shows three exchanges as labelled DS Tabs, each under the same label; a single exchange
 * stays the section's plain form. */

/** One line of the exchange: who says it ("Your child", "Kheelu") and the words, in their quotation marks. */
export interface ExampleConversationLine {
  readonly speaker: "child" | "kheelu";
  readonly who: string;
  readonly text: RichTextString;
}

/** An exchange, in order: at least one line. */
export type ExampleConversationLines = readonly [ExampleConversationLine, ...ExampleConversationLine[]];

/** One exchange on its tab (task Q2.10): its tab is `tab-<id>` and its panel `panel-<id>`. */
export interface ExampleConversationTab {
  readonly id: string;
  /** The tab's words ("The moon"), also the panel's heading while the panels are stacked (no JavaScript). */
  readonly label: string;
  readonly lines: ExampleConversationLines;
}

/** The exchanges on DS Tabs: the tab row's accessible name and the exchanges, the first selected. */
export interface ExampleConversationTabs {
  readonly label: string;
  readonly items: readonly [ExampleConversationTab, ...ExampleConversationTab[]];
}

interface ExampleConversationBase {
  /** The fold's heading; its id names the section ("example-title" by default). */
  readonly heading: { readonly eyebrow?: Copy; readonly title: Copy; readonly id?: string };
  /** The label above each exchange, never removed: "Illustrative example, not a recording." It also names the list. */
  readonly note: string;
  /** The line after the exchange, or under the tabs ("Hear it in two languages: …"). */
  readonly after?: Copy;
  /** The section's anchor. */
  readonly id?: string;
  /** The cream band. */
  readonly band?: boolean;
}

/** One exchange (`lines`), or several on labelled tabs (`tabs`), never both. */
export type ExampleConversationConfig = ExampleConversationBase &
  (
    | { readonly lines: ExampleConversationLines; readonly tabs?: never }
    | { readonly tabs: ExampleConversationTabs; readonly lines?: never }
  );
