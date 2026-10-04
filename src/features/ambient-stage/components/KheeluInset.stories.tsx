import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import KheeluInset from "./KheeluInset";

// Owns its own <Canvas>, but the plush inside needs WebGL; catalog-only entry.
const meta = {
  title: "Ambient/KheeluInset",
  component: KheeluInset,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof KheeluInset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
