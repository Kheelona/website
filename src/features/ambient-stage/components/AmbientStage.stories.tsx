import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AmbientStage from "./AmbientStage";

// R3F scene: renders inside a Canvas at runtime. Catalog-only entry.
const meta = {
  title: "Ambient/AmbientStage",
  component: AmbientStage,
  args: { tier: "full", onReady: () => {}, onFail: () => {} },
  argTypes: { tier: { control: "inline-radio", options: ["full", "lite"] } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof AmbientStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Lite: Story = { args: { tier: "lite" } };
