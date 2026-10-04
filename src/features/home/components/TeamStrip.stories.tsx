import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamStrip } from "./TeamStrip";

const meta = {
  title: "Home/TeamStrip",
  component: TeamStrip,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TeamStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
