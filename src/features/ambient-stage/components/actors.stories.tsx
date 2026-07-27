import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MascotModel } from "./actors";

// Pure R3F scene primitives: they only paint inside a <Canvas>, so this is a
// catalog-only entry (do not wrap in a real Canvas). See sweep-conventions.md.
const meta = {
  title: "Ambient/actors",
  component: MascotModel,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof MascotModel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
