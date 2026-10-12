import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PreorderButton } from "./PreorderButton";

/* The store button in each shape the approved pages use it. The label comes from content/en-IN/cta.ts in
   the build; the story passes the approved wording (D041). */
const meta = {
  title: "UI/PreorderButton",
  component: PreorderButton,
  parameters: { layout: "padded" },
  args: { label: "Pre-order Kheelu" },
} satisfies Meta<typeof PreorderButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeHero: Story = { args: { cta: "hero", id: "hero-cta", size: "l", block: true, arrow: true } };
export const ProductHero: Story = { args: { cta: "product-top", size: "l", block: true, arrow: true } };
export const Close: Story = { args: { cta: "finale", size: "l" } };
export const StickyBar: Story = { args: { cta: "sticky-bar" } };
export const LaptopNav: Story = { args: { cta: "navbar", size: "s" } };
export const Drawer: Story = { args: { cta: "navbar-mobile", size: "l", block: true } };
