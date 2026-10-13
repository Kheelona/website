import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { navigation } from "@/content/en-IN/navigation";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { StorePaymentsLine } from "./StorePaymentsLine";

/* StorePaymentsLine (task 4.8): D042's payments line, the last line of the store page's and /thanks's main
 * (wiki/qa/deviations.md V1), in the shared words of content/en-IN/store/payments-line.ts. */

const meta = {
  title: "Sections/Store/StorePaymentsLine",
  component: StorePaymentsLine,
  parameters: { layout: "fullscreen" },
  args: { content: paymentsLine, newTabNote: navigation.labels.newTabNote },
} satisfies Meta<typeof StorePaymentsLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The store page's line. */
export const Store: Story = {};

/** /thanks: the same line inside ph-no-capture (no visible difference). */
export const Thanks: Story = { args: { noCapture: true } };
