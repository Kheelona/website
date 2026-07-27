import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ColorwayPicker } from "./ColorwayPicker";

const meta = {
  title: "Lumi/ColorwayPicker",
  component: ColorwayPicker,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof ColorwayPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click a swatch or use arrow keys: the plush swaps with no layout shift. */
export const Default: Story = {};
