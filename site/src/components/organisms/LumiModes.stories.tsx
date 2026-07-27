import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LumiModes } from "./LumiModes";

const meta = {
  title: "Organisms/LumiModes",
  component: LumiModes,
  argTypes: { variant: { control: "inline-radio", options: ["cards", "strip"] } },
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "The three modes: AI mode, Kheelu mode, Bluetooth mode. Replaced the old personality chips (Companion / Storyteller / Teacher) because a parent deciding on a pre-order asks what it does, not what it is like. The parent verb leads and the founder's product term sits under it. Bluetooth is presented as a mode, never as a subscription fallback (gate V3-b).",
      },
    },
  },
} satisfies Meta<typeof LumiModes>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {};
export const Strip: Story = { args: { variant: "strip" } };
