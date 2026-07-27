import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eyebrow } from "./Eyebrow";

const meta = {
  title: "Atoms/Eyebrow",
  component: Eyebrow,
  args: { children: "How it works" },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomColor: Story = {
  args: { color: "text-white", children: "On a dark band" },
};
