import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrustRoom } from "./TrustRoom";

const meta = {
  title: "Home/TrustRoom",
  component: TrustRoom,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TrustRoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
