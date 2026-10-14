import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { VideoEmbed } from "./VideoEmbed";

/* VideoEmbed (task 8b.2c; journal-pipeline §7): a journal post's video, a still in the DS photo frame at 16:9 with the DS
 * primary play button until a press, then the player. The ids are the providers' own player-documentation samples and
 * the words are story data only. In Storybook next/image does not optimise, so YouTube's still loads straight from
 * i.ytimg.com here; on the site it comes through /_next/image and the reader's browser contacts neither host before
 * the press (VideoEmbed.test.tsx). */

const COLUMN = "(min-width: 732px) 700px, calc(100vw - 32px)";

const meta = {
  title: "UI/VideoEmbed",
  component: VideoEmbed,
  args: {
    provider: "youtube",
    videoId: "M7lc1UVf-VE",
    title: "A sample from YouTube’s player documentation",
    playLabel: "Play video:",
    caption: "A caption under the video.",
    sizes: COLUMN,
  },
  decorators: [
    (Story) => (
      <div className="kh-section">
        <div className="kh-container">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof VideoEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

/** YouTube: the video's own still, the play button, the caption. */
export const YouTube: Story = {};

/** Vimeo: no still (it needs an API call), so the DS frame and the play button alone; no caption. */
export const Vimeo: Story = {
  args: { provider: "vimeo", videoId: "76979871", title: "A sample from Vimeo’s player documentation", caption: undefined },
};

/** After the press: the player frame replaces the button and takes focus (this story loads Vimeo's player). */
export const Pressed: Story = {
  args: Vimeo.args,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("button", { name: `${args.playLabel} ${args.title}` }));
    const frame = canvasElement.querySelector("iframe");
    await expect(frame).toHaveAttribute("title", args.title);
    await waitFor(() => expect(canvasElement.ownerDocument.activeElement).toBe(frame));
  },
};
