import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ParentQuotes } from "./ParentQuotes";

const meta = {
  title: "Organisms/ParentQuotes",
  component: ParentQuotes,
  args: { count: 3 },
  argTypes: {
    count: { control: "inline-radio", options: [2, 3] },
    from: { control: "inline-radio", options: ["white", "cream", "cool", "teal"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof ParentQuotes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoUp: Story = { args: { count: 2 } };
