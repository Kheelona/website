import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroStage } from "./HeroStage";

const meta = {
  title: "Home/HeroStage",
  component: HeroStage,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof HeroStage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Interim composed art (Kheelu + plush) until the founder-generated
 *  whisper artwork lands (gemini-handoff/hero-2026-07). */
export const InterimComposition: Story = {};
