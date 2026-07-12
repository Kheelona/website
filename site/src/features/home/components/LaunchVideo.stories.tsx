import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LaunchVideo } from "./LaunchVideo";

const meta = {
  title: "Home/LaunchVideo",
  component: LaunchVideo,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof LaunchVideo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
