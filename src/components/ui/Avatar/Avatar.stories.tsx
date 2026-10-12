import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import { Avatar } from "./Avatar";

/* Avatar (task 2.3; DS Avatar). Initials beside a visible name (team.html:44), labelled initials, the four DS sizes
   and a photo. The photo story shows Kheelu, whom the DS lets an avatar show (DS Avatar README); cast photos never
   stand in for real people. */

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  decorators: [
    (Story) => (
      <div className="kh-section">
        <div className="kh-container">
          <Story />
        </div>
      </div>
    ),
  ],
  args: { initials: "AS", size: "xl", tone: "sun" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The team page's founder badge, hidden beside the visible name. */
export const TeamInitials: Story = {};

/** Standing alone: one named image. */
export const Labelled: Story = { args: { initials: "KC", label: "Kashyap", tone: "blue" } };

/** The DS sizes, s 32, m 48, l 64 and xl 96 px, in the three tones. */
export const Sizes: Story = {
  render: () => (
    <div className="kh-chips">
      <Avatar initials="AS" size="s" />
      <Avatar initials="AS" tone="chilli" />
      <Avatar initials="AS" size="l" tone="sun" />
      <Avatar initials="AS" size="xl" />
    </div>
  ),
};

/** A photo, named by its alt text. */
export const Photo: Story = {
  render: () => <Avatar image={{ src: kheeluFront, alt: "Kheelu" }} sizes="96px" size="xl" />,
};
