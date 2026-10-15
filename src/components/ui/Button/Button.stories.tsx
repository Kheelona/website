import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";

/* Every variant of the DS Button as the pages use it. "CtaWithArrow" is the story the D049 pick 6 spec
   (test/e2e/motion-button.spec.ts) opens: hover nudges the arrow with a fine pointer only. */
const STORE = "https://store.kheelona.com";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cta: Story = {
  args: { variant: "cta", cta: "sticky-bar", href: STORE, children: "Pre-order Kheelu" },
};

export const CtaWithArrow: Story = {
  args: { variant: "cta", cta: "hero", size: "l", id: "hero-cta", href: STORE, arrow: true, children: "Pre-order Kheelu" },
};

export const CtaBlockOnPhones: Story = {
  args: { variant: "cta", cta: "finale", size: "l", block: true, href: STORE, arrow: true, children: "Pre-order Kheelu" },
};

export const CtaSmall: Story = {
  args: { variant: "cta", cta: "navbar", size: "s", href: STORE, children: "Pre-order Kheelu" },
};

export const Primary: Story = {
  args: { variant: "primary", size: "l", block: true, type: "submit", children: "Save my address" },
};

export const Secondary: Story = {
  args: { variant: "secondary", href: "/safety", children: "See how we built safety in" },
};

export const SecondaryWithIcon: Story = {
  args: { variant: "secondary", icon: "whatsapp-logo", href: "https://wa.me/919187546483", children: "WhatsApp us" },
};

export const Ghost: Story = {
  args: { variant: "ghost", cta: "hero-learn", iconEnd: "arrow-right", href: "/products/kheelu", children: "See how it works" },
};

export const GhostLongLabel: Story = {
  name: "Ghost, long label (wraps at 360 px)",
  args: { variant: "ghost", iconEnd: "arrow-right", href: "/stories", children: "Read more: how children learn by talking" },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** A link that opens in a new tab with rel="noopener" (`target="_blank"`), as D061's share link opens WhatsApp (task
 *  8c.5); the message here is a stand-in. */
export const GhostNewTab: Story = {
  name: "Ghost, opens in a new tab",
  args: {
    variant: "ghost",
    cta: "share-whatsapp",
    href: "https://wa.me/?text=Kheelu",
    target: "_blank",
    children: "Know a parent who needs this? Share Kheelu on WhatsApp",
  },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete conversation" },
};

export const Loading: Story = {
  args: { variant: "primary", loading: true, children: "Saving" },
};

export const Disabled: Story = {
  args: { variant: "secondary", disabled: true, children: "Save my address" },
};
