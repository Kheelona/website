import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MeetLumi } from "./MeetLumi";

const meta = {
  title: "Home/MeetLumi",
  component: MeetLumi,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof MeetLumi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
