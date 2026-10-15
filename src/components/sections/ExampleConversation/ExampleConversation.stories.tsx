import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { kheeluPage } from "@/content/en-IN/products/kheelu/page";
import { buildOffer } from "@/lib/offer/offer";
import { ExampleConversation } from "./ExampleConversation";
import type { ExampleConversationConfig } from "./example-conversation.types";

/* ExampleConversation (task 8c.3; tabs since task Q2.10): the product page's own fold, read from its content
   (products/kheelu/page.ts), so the story shows what the page publishes: three exchanges on labelled DS Tabs, the label
   above each exchange (the D2C plan v2 §3 fold 6). The page's CTA block is the section registry's, so it is not here. */

const fold = kheeluPage.sections.find((s) => s.kind === "example-conversation");
if (fold?.kind !== "example-conversation") throw new Error("the product page lists no example conversation");
const PRODUCT: ExampleConversationConfig = fold.config;
if (PRODUCT.tabs === undefined) throw new Error("the product page's example conversation has no tabs");

const meta = {
  title: "Sections/ExampleConversation",
  component: ExampleConversation,
  args: { ...PRODUCT, offer: buildOffer("token") },
} satisfies Meta<typeof ExampleConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The product page's fold, right after its four steps, on the page surface: three exchanges on tabs. */
export const Product: Story = {};

/** The same fold on the cream band: the child's lines switch to the page cream. */
export const OnBand: Story = { args: { band: true } };

/** The section's plain form: one exchange, no tabs (the product page's first tab, alone). */
export const OneExchange: Story = {
  args: { tabs: undefined, lines: PRODUCT.tabs.items[0].lines, after: undefined } as Partial<ExampleConversationConfig>,
};
