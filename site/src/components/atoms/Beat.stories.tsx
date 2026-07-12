import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Beat } from "./Beat";

const meta = {
  title: "Atoms/Beat",
  component: Beat,
  args: {
    id: "hero",
    children: "A content beat on the journey.",
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Beat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAnchor: Story = {
  args: { id: "meet-lumi", anchor: "meet-lumi" },
};
