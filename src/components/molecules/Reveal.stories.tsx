import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Reveal } from "./Reveal";

const meta = {
  title: "Molecules/Reveal",
  component: Reveal,
  args: {
    children: "This content slides calmly into view on scroll.",
  },
  argTypes: {
    mode: { control: "inline-radio", options: ["rise", "fade"] },
    as: { control: "inline-radio", options: ["div", "li"] },
    delay: { control: { type: "number", min: 0, max: 1, step: 0.1 } },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rise: Story = { args: { mode: "rise" } };
export const Fade: Story = { args: { mode: "fade" } };
export const WithDelay: Story = { args: { delay: 0.2 } };
