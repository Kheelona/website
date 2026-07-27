import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LumiInset from "./LumiInset";

// Owns its own <Canvas>, but the plush inside needs WebGL; catalog-only entry.
const meta = {
  title: "Ambient/LumiInset",
  component: LumiInset,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof LumiInset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
