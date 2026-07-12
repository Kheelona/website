import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StageShell } from "./StageShell";

// The shared fixed full-page Canvas holder + error boundary. Catalog-only entry.
const meta = {
  title: "Ambient/StageShell",
  component: StageShell,
  args: { tier: "full", onFail: () => {}, children: null },
  argTypes: { tier: { control: "inline-radio", options: ["full", "lite"] } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof StageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
