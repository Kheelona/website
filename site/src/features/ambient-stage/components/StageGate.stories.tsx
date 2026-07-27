import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageGate } from "./StageGate";

// The whole-page stage gate. It renders null until every capability gate passes
// and an idle slot opens, so in Storybook it is intentionally invisible dressing
// mounted at the page root.
const meta = {
  title: "Ambient/StageGate",
  component: StageGate,
  args: { stage: "ambient" },
  argTypes: { stage: { control: "inline-radio", options: ["journey", "ambient"] } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof StageGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ambient: Story = {};
export const Journey: Story = { args: { stage: "journey" } };
