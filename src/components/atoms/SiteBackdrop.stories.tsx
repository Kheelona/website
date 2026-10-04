import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteBackdrop } from "./SiteBackdrop";

const meta = {
  title: "Atoms/SiteBackdrop",
  component: SiteBackdrop,
  parameters: { nextjs: { appDirectory: true }, layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "60vh", position: "relative" }}>
        <Story />
        <p style={{ position: "relative", zIndex: 10, padding: 24 }}>
          Content floats above the fixed warm sky.
        </p>
      </div>
    ),
  ],
} satisfies Meta<typeof SiteBackdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
