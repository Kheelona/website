import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PriceRoom } from "./PriceRoom";

const meta = {
  title: "Home/PriceRoom",
  component: PriceRoom,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof PriceRoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
