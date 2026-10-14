import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { kheeluPage } from "@/content/en-IN/products/kheelu/page";
import { buildOffer } from "@/lib/offer/offer";
import { ExampleConversation } from "./ExampleConversation";
import type { ExampleConversationConfig } from "./example-conversation.types";

/* ExampleConversation (task 8c.3): the product page's own fold, read from its content (products/kheelu/page.ts), so the
   story shows what the page publishes: home.md fold 2 variant b, the label above the exchange. */

const fold = kheeluPage.sections.find((s) => s.kind === "example-conversation");
if (fold?.kind !== "example-conversation") throw new Error("the product page lists no example conversation");
const PRODUCT: ExampleConversationConfig = fold.config;

const meta = {
  title: "Sections/ExampleConversation",
  component: ExampleConversation,
  args: { ...PRODUCT, offer: buildOffer("token") },
} satisfies Meta<typeof ExampleConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The product page's fold, right after its four steps, on the page surface. */
export const Product: Story = {};

/** The same fold on the cream band: the child's lines switch to the page cream. */
export const OnBand: Story = { args: { band: true } };
