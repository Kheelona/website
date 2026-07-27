import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TiltCard } from "./TiltCard";

const meta = {
  title: "Molecules/TiltCard",
  component: TiltCard,
  args: {
    className: "rounded-3xl bg-white p-8 shadow-soft max-w-sm",
    children: "Gentle pointer-tracked tilt on a non-interactive surface.",
    maxTilt: 5,
  },
  argTypes: {
    maxTilt: { control: { type: "number", min: 0, max: 15, step: 1 } },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const StrongerTilt: Story = { args: { maxTilt: 10 } };
