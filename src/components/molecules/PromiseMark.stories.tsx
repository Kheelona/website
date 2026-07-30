import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PromiseMark, PROMISE_MARK_COUNT } from "./PromiseMark";

const meta = {
  title: "Molecules/PromiseMark",
  component: PromiseMark,
} satisfies Meta<typeof PromiseMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = { args: { index: 0 } };

/** The full rotation, as a promise-card group would consume it. */
export const Rotation: Story = {
  args: { index: 0 },
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {Array.from({ length: PROMISE_MARK_COUNT }, (_, i) => (
        <PromiseMark key={i} index={i} />
      ))}
    </div>
  ),
};
