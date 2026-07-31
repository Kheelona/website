import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RecognitionStrip } from "./RecognitionStrip";

const meta = {
  title: "Organisms/RecognitionStrip",
  component: RecognitionStrip,
  args: { label: "Recognised by" },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof RecognitionStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
