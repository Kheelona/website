import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KheeluIntro } from "./KheeluIntro";

const meta = {
  title: "Home/KheeluIntro",
  component: KheeluIntro,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof KheeluIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
