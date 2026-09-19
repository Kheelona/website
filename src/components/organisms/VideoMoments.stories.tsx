import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoMoments } from "./VideoMoments";
import { VIDEO_ASPECT, type VideoMoment } from "@/lib/video-moments";

/** Fixtures, never real footage.
 *
 *  `VIDEO_MOMENTS` is empty until the founder supplies files, and seeding it
 *  to make a story look good is exactly what lib/video-moments.ts forbids. So
 *  these rows point at paths that do not exist, which has a useful side
 *  effect: the default story IS the broken-asset story, and it shows the
 *  degradation the component promises (still and label survive, the play
 *  control goes) rather than a wall of alt text. */
function fixture(id: string, chip: string, label: string): VideoMoment {
  return {
    id,
    chip,
    label,
    alt: `Placeholder still for ${chip}.`,
    src: `/video/moments/${id}.mp4`,
    poster: `/video/moments/${id}.jpg`,
    preview: `/video/moments/${id}.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
  };
}

const FIXTURES: readonly VideoMoment[] = [
  fixture("one", "A parent in Pune", "Her three year old asks the same question four times."),
  fixture("two", "Sent in by a family", "Bedtime, and the story is answering back."),
  fixture("three", "A parent in Bengaluru", "Counting to ten in two languages, out loud."),
  fixture("four", "Sent in by a family", "The first morning after it arrived."),
  fixture("five", "A parent in Chennai", "Naming a big feeling instead of hiding it."),
];

const meta = {
  title: "Organisms/VideoMoments",
  component: VideoMoments,
  parameters: { layout: "padded" },
} satisfies Meta<typeof VideoMoments>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Five videos: three across on a wide screen, one with a peek on a phone. */
export const Carousel: Story = { args: { moments: FIXTURES } };

/** Exactly at the minimum. The dots still say how many there are. */
export const AtTheMinimum: Story = { args: { moments: FIXTURES.slice(0, 3) } };

/** Below the minimum: the component renders nothing at all, and both pages
 *  leave the whole section out. An empty canvas here is the correct result. */
export const BelowTheMinimum: Story = { args: { moments: FIXTURES.slice(0, 2) } };

/** No library yet, which is the state the live site is in today. */
export const Empty: Story = { args: { moments: [] } };
