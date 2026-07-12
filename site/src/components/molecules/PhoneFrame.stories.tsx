import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhoneFrame } from "./PhoneFrame";

const meta = {
  title: "Molecules/PhoneFrame",
  component: PhoneFrame,
  args: {
    src: "/app/dashboard.png",
    alt: "The parent dashboard in the Kheelona app",
    width: 280,
  },
  argTypes: { width: { control: { type: "number", min: 200, max: 360 } } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof PhoneFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = { args: { width: 220 } };
