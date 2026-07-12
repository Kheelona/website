import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CurveDivider } from "./CurveDivider";

const meta = {
  title: "Atoms/CurveDivider",
  component: CurveDivider,
  args: { from: "cream" },
  argTypes: {
    from: {
      control: "inline-radio",
      options: ["white", "cream", "cool", "sun", "teal", "orange"],
    },
    flip: { control: "boolean" },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof CurveDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const FromTeal: Story = { args: { from: "teal" } };
export const Flipped: Story = { args: { from: "orange", flip: true } };
