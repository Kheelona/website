import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinaleCTA } from "./FinaleCTA";

const meta = {
  title: "Organisms/FinaleCTA",
  component: FinaleCTA,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof FinaleCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};
export const ProductPage: Story = {
  args: { title: "Reserve your Kheelu.", line: "Fully refundable. Ships 20 October 2026." },
};
export const NoShare: Story = { args: { share: false } };
