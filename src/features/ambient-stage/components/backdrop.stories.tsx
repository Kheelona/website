import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WashBackdrop } from "./backdrop";

// R3F scene helper (sets scene.background/fog): Canvas-only. Catalog entry.
const meta = {
  title: "Ambient/backdrop",
  component: WashBackdrop,
  argTypes: { mode: { control: "inline-radio", options: ["journey", "ambient"] } },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof WashBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Journey: Story = { args: { mode: "journey" } };
export const Ambient: Story = { args: { mode: "ambient" } };
