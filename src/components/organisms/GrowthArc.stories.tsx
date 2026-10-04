import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GrowthArc } from "./GrowthArc";

const meta = {
  title: "Organisms/GrowthArc",
  component: GrowthArc,
} satisfies Meta<typeof GrowthArc>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Home growth room (BUILD-V6 D2): data lives in lib/growth-arc. */
export const Home: Story = {};
