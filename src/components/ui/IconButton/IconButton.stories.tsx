import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_CARET_LEFT, ICON_CARET_RIGHT, ICON_DOTS_THREE, ICON_PLAY, ICON_WHATSAPP_LOGO, ICON_X } from "@/assets/icons.generated";
import { IconButton } from "./IconButton";

/* Every variant and size of the DS IconButton as the approved pages use it, each icon a named constant (2.11). */
const meta = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: { layout: "padded" },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GhostClose: Story = { args: { icon: ICON_X, label: "Close menu", title: "Close menu" } };
export const OutlinePrevious: Story = { args: { icon: ICON_CARET_LEFT, label: "Previous video", variant: "outline" } };
export const OutlineNext: Story = { args: { icon: ICON_CARET_RIGHT, label: "Next video", variant: "outline" } };
export const OutlineDisabled: Story = { args: { icon: ICON_CARET_LEFT, label: "Previous video", variant: "outline", disabled: true } };
export const PrimaryPlayLarge: Story = { args: { icon: ICON_PLAY, label: "Play: Learning by asking", variant: "primary", size: "l" } };
export const Small: Story = { args: { icon: ICON_DOTS_THREE, label: "More options", size: "s" } };
export const AsLink: Story = {
  args: { icon: ICON_WHATSAPP_LOGO, label: "Chat with us on WhatsApp", size: "l", href: "https://wa.me/919187546483", target: "_blank", rel: "noopener" },
};
