import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoWall } from "./VideoWall";
import { VIDEO_MOMENTS } from "@/lib/video-moments";

const meta = {
  title: "Organisms/VideoWall",
  component: VideoWall,
  args: { moments: VIDEO_MOMENTS },
  parameters: { nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="kh-wrap py-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VideoWall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Library: Story = {};
export const OneFilm: Story = { args: { moments: VIDEO_MOMENTS.slice(0, 1) } };
