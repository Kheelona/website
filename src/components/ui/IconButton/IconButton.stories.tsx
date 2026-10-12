import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "./IconButton";

/* Every variant and size of the DS IconButton as the approved pages use it. */
const meta = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: { layout: "padded" },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GhostClose: Story = { args: { icon: "x", label: "Close menu", title: "Close menu" } };
export const OutlinePrevious: Story = { args: { icon: "caret-left", label: "Previous video", variant: "outline" } };
export const OutlineNext: Story = { args: { icon: "caret-right", label: "Next video", variant: "outline" } };
export const OutlineDisabled: Story = { args: { icon: "caret-left", label: "Previous video", variant: "outline", disabled: true } };
export const PrimaryPlayLarge: Story = { args: { icon: "play", label: "Play: Learning by asking", variant: "primary", size: "l" } };
export const Small: Story = { args: { icon: "dots-three", label: "More options", size: "s" } };
export const AsLink: Story = {
  args: { icon: "whatsapp-logo", label: "Chat with us on WhatsApp", size: "l", href: "https://wa.me/919187546483", target: "_blank", rel: "noopener" },
};
