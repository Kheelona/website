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

export const Default: Story = {};

/** The Home and Kheelu comparison (CMO merge, 2026-10-04). */
export const ProductTypes: Story = {
  args: { columns: COMPARISON_COLUMNS, rows: COMPARISON_ROWS },
};
