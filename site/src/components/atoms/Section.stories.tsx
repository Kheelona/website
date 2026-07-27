import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "./Section";

const meta = {
  title: "Atoms/Section",
  component: Section,
  args: {
    children: "A full-bleed section with an A-concept wash.",
  },
  argTypes: {
    wash: {
      control: "inline-radio",
      options: ["white", "cream", "cool", "sun", "teal", "orange"],
    },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const White: Story = { args: { wash: "white" } };
export const Cream: Story = { args: { wash: "cream" } };
export const Teal: Story = { args: { wash: "teal" } };
export const Orange: Story = { args: { wash: "orange" } };
