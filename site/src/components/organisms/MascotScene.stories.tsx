import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MascotScene } from "./MascotScene";

const meta = {
  title: "Organisms/MascotScene",
  component: MascotScene,
  args: { pose: "hero-wink", width: 360 },
  argTypes: {
    pose: {
      control: "select",
      options: ["hero-wink", "curious", "grumpy", "sad", "silly", "joy", "bliss"],
    },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof MascotScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeroWink: Story = { args: { pose: "hero-wink", priority: true } };
export const Joy: Story = { args: { pose: "joy" } };
export const Bliss: Story = { args: { pose: "bliss" } };
