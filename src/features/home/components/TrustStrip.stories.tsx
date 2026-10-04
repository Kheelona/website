import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrustStrip } from "./TrustStrip";

const meta = {
  title: "Home/TrustStrip",
  component: TrustStrip,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TrustStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
