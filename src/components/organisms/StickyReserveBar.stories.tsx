import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StickyReserveBar } from "./StickyReserveBar";

const meta = {
  title: "Organisms/StickyReserveBar",
  component: StickyReserveBar,
  parameters: { nextjs: { appDirectory: true }, viewport: { defaultViewport: "mobile1" } },
} satisfies Meta<typeof StickyReserveBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Phones only: widen the canvas past `md` and it disappears, by design. */
export const Default: Story = {};
