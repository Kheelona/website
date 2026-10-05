import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompareTable } from "./CompareTable";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";

const meta = {
  title: "Molecules/CompareTable",
  component: CompareTable,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof CompareTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The site's one comparison (lib/comparison.ts), as Home, the Kheelu page and
 *  the buyer's guide show it. */
export const Default: Story = {
  args: { columns: COMPARISON_COLUMNS, rows: COMPARISON_ROWS },
};
