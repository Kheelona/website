import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_ARROW_RIGHT, ICON_CARET_LEFT, ICON_SHIELD_CHECK } from "@/assets/icons.generated";
import { Glyph } from "./Glyph";

/* Glyph (task 2.11): the DS icon markup from one named path constant, decorative, labelled and with a composition
 * class; the client-safe way to draw an icon inside a client island. */
const meta = {
  title: "UI/Icon/Glyph",
  component: Glyph,
  parameters: { layout: "padded" },
  args: { d: ICON_ARROW_RIGHT },
} satisfies Meta<typeof Glyph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Decorative: Story = {};
export const Labelled: Story = { args: { d: ICON_SHIELD_CHECK, label: "Safe" } };
export const WithClass: Story = { args: { d: ICON_CARET_LEFT, className: "ks-btn__arrow" } };
