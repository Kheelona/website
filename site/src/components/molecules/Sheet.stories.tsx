import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sheet } from "./Sheet";

const nav = (
  <nav className="flex flex-col gap-4 px-6 pb-8 pt-2 text-ink-head">
    <a href="/products/lumi">Meet Lumi</a>
    <a href="/playos">PlayOS</a>
    <a href="/safety">Safety</a>
  </nav>
);

const meta = {
  title: "Molecules/Sheet",
  component: Sheet,
  args: {
    open: true,
    onOpenChange: () => {},
    title: "Main menu",
    trigger: (
      <button type="button" className="rounded-full border border-line px-4 py-2">
        Menu
      </button>
    ),
    children: nav,
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const Closed: Story = { args: { open: false } };
