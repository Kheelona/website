import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ThreeStage from "./ThreeStage";

// The Home journey world (dolly rig, GLB mascot + plush, sun). Canvas-only, so
// this is a catalog-only entry.
const meta = {
  title: "Ambient/ThreeStage",
  component: ThreeStage,
  args: { tier: "full", onReady: () => {}, onFail: () => {} },
  argTypes: { tier: { control: "inline-radio", options: ["full", "lite"] } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof ThreeStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Lite: Story = { args: { tier: "lite" } };
