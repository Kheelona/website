import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Stage from "./Stage";

// The single dynamic entry that forks to ThreeStage/AmbientStage; both are
// Canvas scenes, so this is a catalog-only entry.
const meta = {
  title: "Ambient/Stage",
  component: Stage,
  args: { stage: "ambient", tier: "full", onReady: () => {}, onFail: () => {} },
  argTypes: {
    stage: { control: "inline-radio", options: ["ambient", "journey"] },
    tier: { control: "inline-radio", options: ["full", "lite"] },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ambient: Story = {};
export const Journey: Story = { args: { stage: "journey" } };
