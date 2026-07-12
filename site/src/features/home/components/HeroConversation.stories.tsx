import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroConversation } from "./HeroConversation";

const meta = {
  title: "Home/HeroConversation",
  component: HeroConversation,
  args: { className: "max-w-[420px]" },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof HeroConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
