import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  args: {
    label: "Example",
    items: [
      { label: "First", panel: <p className="kh-body">The first panel.</p> },
      { label: "Second", panel: <p className="kh-body">The second panel.</p> },
      { label: "Third", panel: <p className="kh-body">The third panel.</p> },
    ],
  },
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="kh-wrap max-w-[560px] py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
