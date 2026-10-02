import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyReserveBar } from "./StickyReserveBar";

const meta = {
  title: "Organisms/StickyReserveBar",
  component: StickyReserveBar,
  args: { shipShort: "20 Oct" },
  parameters: { nextjs: { appDirectory: true }, viewport: { defaultViewport: "mobile1" } },
} satisfies Meta<typeof StickyReserveBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
