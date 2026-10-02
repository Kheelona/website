import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { href: "#", children: "Reserve Kheelu for \u20b9499" },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "ghost", "green", "onDark", "ghostOnAccent"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Green: Story = { args: { variant: "green", children: "Ask us on WhatsApp" } };
export const Small: Story = { args: { size: "sm" } };
export const OnAccent: Story = {
  args: { variant: "onDark" },
  decorators: [
    (Story) => (
      <div className="kh-final">
        <Story />
      </div>
    ),
  ],
};
