import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AudioMoments } from "./AudioMoments";
import { AUDIO_MOMENTS, KHEELU_PAGE_MOMENTS } from "@/lib/audio-moments";

const meta = {
  title: "Molecules/AudioMoments",
  component: AudioMoments,
} satisfies Meta<typeof AudioMoments>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The Home grid: all four teaching moments. */
export const HomeGrid: Story = { args: { moments: AUDIO_MOMENTS } };

/** The compact pair used inside /products/kheelu's Story-mode room. */
export const CompactPair: Story = { args: { moments: KHEELU_PAGE_MOMENTS } };
