import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KheeluOrbit } from "./KheeluOrbit";

const meta = {
  title: "Home/KheeluOrbit",
  component: KheeluOrbit,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof KheeluOrbit>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop + motion: the ring spins slowly, cards stay upright, hover
 *  pauses. Narrow the viewport for the static two-column fallback. */
export const Default: Story = {};
