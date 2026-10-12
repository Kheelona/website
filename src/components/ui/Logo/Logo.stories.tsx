import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "./Logo";

/* The DS logo in its three placements: nav and drawer (home link), footer (image only), store header (a link
   to the site, named on the link). */
const meta = {
  title: "UI/Logo",
  component: Logo,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavHomeLink: Story = { args: { href: "/", alt: "Kheelona, home" } };
export const Footer: Story = { args: { alt: "Kheelona" } };
export const StoreHeader: Story = { args: { href: "https://kheelona.com", linkLabel: "Kheelona home", alt: "Kheelona" } };
