import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyMobileCTA } from "./StickyMobileCTA";

const meta = {
  title: "Organisms/StickyMobileCTA",
  component: StickyMobileCTA,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof StickyMobileCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
