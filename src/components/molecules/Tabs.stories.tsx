import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs } from "./Tabs";

const meta = {
  title: "Molecules/Tabs",
  component: Tabs,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Ages",
    items: [
      { label: "Age 3", panel: <p>Asking why, and why again.</p> },
      { label: "Age 4", panel: <p>Playing with ideas.</p> },
      { label: "Age 5", panel: <p>Words, numbers, confidence.</p> },
    ],
  },
};
