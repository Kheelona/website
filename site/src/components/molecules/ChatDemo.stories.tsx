import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatDemo, MOON_EXCHANGE } from "./ChatDemo";

const meta = {
  title: "Molecules/ChatDemo",
  component: ChatDemo,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof ChatDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MoonExchange: Story = { args: { turns: MOON_EXCHANGE } };
export const TwoTurns: Story = {
  args: { turns: MOON_EXCHANGE.slice(0, 2) },
};
