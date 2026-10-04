import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParentAppSection } from "./ParentAppSection";

const meta = {
  title: "Home/ParentAppSection",
  component: ParentAppSection,
  args: { from: "white", kheelu: false },
  argTypes: {
    from: { control: "inline-radio", options: ["white", "cream", "cool", "teal"] },
    kheelu: { control: "boolean" },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof ParentAppSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithKheeluNarrator: Story = { args: { kheelu: true } };
