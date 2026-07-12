import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Slot } from "./slot";

// Slot renders its single child element, promoting it to a motion component and
// merging className/style/props onto it.
const meta = {
  title: "Vendor/Slot",
  component: Slot,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Slot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Slot className="inline-flex rounded-full bg-teal-deep px-4 py-2 text-white">
      <button type="button">Slotted button</button>
    </Slot>
  ),
};
