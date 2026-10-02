import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TwoReasons } from "./TwoReasons";

const meta = {
  title: "Organisms/TwoReasons",
  component: TwoReasons,
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="kh-wrap py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TwoReasons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Phone: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
