import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextLink } from "./TextLink";

const meta = {
  title: "Molecules/TextLink",
  component: TextLink,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { href: "/how", children: "Read the research" } };
export const External: Story = {
  args: { href: "https://wa.me/919187546483", external: true, children: "Ask us on WhatsApp" },
};
