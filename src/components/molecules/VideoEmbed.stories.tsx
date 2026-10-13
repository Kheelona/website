import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoEmbed } from "./VideoEmbed";

const meta = {
  title: "Molecules/VideoEmbed",
  component: VideoEmbed,
} satisfies Meta<typeof VideoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const YouTube: Story = {
  args: {
    provider: "youtube",
    videoId: "dQw4w9WgXcQ",
    title: "How Kheelu answers a why question",
    caption: "Press play: nothing loads from YouTube until you do.",
  },
};

export const Vimeo: Story = {
  args: { provider: "vimeo", videoId: "76979871", title: "", caption: "" },
};
