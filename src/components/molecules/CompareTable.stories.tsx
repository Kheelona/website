import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompareTable } from "./CompareTable";

const meta = {
  title: "Molecules/CompareTable",
  component: CompareTable,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof CompareTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
