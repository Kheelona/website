import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { href: "#", children: "Reserve Lumi" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "ghost", "onDark"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const OnDark: Story = { args: { variant: "onDark" } };
export const Large: Story = { args: { size: "lg" } };
