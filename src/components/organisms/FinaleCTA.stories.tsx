import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinaleCTA } from "./FinaleCTA";

const meta = {
  title: "Organisms/FinaleCTA",
  component: FinaleCTA,
  args: { variant: "full" },
  argTypes: {
    variant: { control: "inline-radio", options: ["full", "compact"] },
    from: { control: "inline-radio", options: ["white", "cream", "cool", "sun"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof FinaleCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = { args: { variant: "full" } };
export const Compact: Story = { args: { variant: "compact" } };
export const WithKheeluLine: Story = {
  args: { variant: "full", kheeluLine: "Your spot is one tap away." },
};
