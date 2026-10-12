import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DefinitionList } from "./DefinitionList";

const meta = {
  title: "UI/DefinitionList",
  component: DefinitionList,
  args: {
    rows: [
      { term: "Ages", value: "3 to 7" },
      { term: "What it is", value: "A cream plush rabbit with a speaker in its tummy and rainbow-lined ears" },
      { term: "Screen", value: "None" },
      { term: "Size and weight", value: <span className="ks-placeholder">[PLACEHOLDER F4: size and weight]</span> },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof DefinitionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The product page's spec table (two columns from 720 px). */
export const Specs: Story = {};
/** The declarations card (always stacked). */
export const Stack: Story = {
  args: {
    variant: "stack",
    rows: [
      { term: "MRP", value: "₹7,999 (incl. of all taxes)" },
      { term: "Country of origin", value: "India" },
    ],
  },
};
/** The confirmation's order rows. */
export const Order: Story = {
  args: {
    variant: "order",
    rows: [
      { term: "Paid today", value: "₹499" },
      { term: "Due before delivery", value: "₹4,500, of the ₹4,999 price (incl. GST)" },
      { term: "Delivery", value: "Deliveries start mid-November" },
    ],
  },
};
