import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AgeTabs } from "./AgeTabs";

const meta = {
  title: "Home/AgeTabs",
  component: AgeTabs,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof AgeTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
