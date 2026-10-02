import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Room } from "./Room";

const meta = {
  title: "Atoms/Room",
  component: Room,
  args: {
    children: "A full-bleed page band with the 1180px content column inside it.",
  },
  argTypes: {
    fill: { control: "inline-radio", options: ["white", "cream", "cool", "sun"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Room>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surface: Story = { args: { fill: "white" } };
export const Cream: Story = { args: { fill: "cream" } };
