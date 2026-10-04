import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PriceTable } from "./PriceTable";

const meta = {
  title: "Molecules/PriceTable",
  component: PriceTable,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof PriceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every value comes from `config/site`, so there is nothing to vary here: the
 *  table has exactly one correct rendering at any moment, and that is the
 *  point of it. */
export const Default: Story = {};

/** On the sun-filled pricing room it sits on, to check the borders read against
 *  a tinted wash rather than only on white. */
export const OnWash: Story = {
  decorators: [
    (Story) => (
      <div className="bg-sun p-8">
        <Story />
      </div>
    ),
  ],
};
