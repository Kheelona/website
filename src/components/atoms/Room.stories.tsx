import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Room } from "./Room";

const meta = {
  title: "Atoms/Room",
  component: Room,
  args: {
    children: "Content lives in contained rooms on the warm backdrop.",
  },
  argTypes: {
    fill: {
      control: "inline-radio",
      options: ["white", "cream", "cool", "sun", "orange"],
    },
    reveal: {
      control: "inline-radio",
      options: ["none", "left", "right", "pop"],
    },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Room>;

export default meta;
type Story = StoryObj<typeof meta>;

export const White: Story = { args: { fill: "white" } };
export const Cream: Story = { args: { fill: "cream" } };
export const Cool: Story = { args: { fill: "cool" } };
export const Orange: Story = { args: { fill: "orange" } };
export const WithGuideLine: Story = {
  args: { fill: "cool", guide: "curious", say: "Read this bit slowly." },
};
