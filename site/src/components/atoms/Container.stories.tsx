import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container } from "./Container";

const meta = {
  title: "Atoms/Container",
  component: Container,
  args: {
    children: "Centered content column, max 1200px wide.",
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExtraClasses: Story = {
  args: { className: "py-10 text-center" },
};
