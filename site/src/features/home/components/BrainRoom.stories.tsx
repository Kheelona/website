import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BrainRoom } from "./BrainRoom";

const meta = {
  title: "Home/BrainRoom",
  component: BrainRoom,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof BrainRoom>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
