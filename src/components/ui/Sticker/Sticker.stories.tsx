import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sticker } from "./Sticker";

/* The stickers of the approved pages, in their wording, on a DS art board so the white outline shows. */
const meta = {
  title: "UI/Sticker",
  component: Sticker,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="kh-card kh-card--block kh-tone-blue">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sticker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Round: Story = { args: { tone: "sun", variant: "round", tilt: 8, lead: "It asks.", lines: ["They think."] } };
export const RoundTiltedBack: Story = { args: { tone: "sun", variant: "round", tilt: -8, lead: "It asks.", lines: ["They think."] } };
export const Hand: Story = { args: { as: "p", tone: "sun", variant: "hand", tilt: 4, lines: ["Changed your mind?", "That’s allowed."] } };
export const HandThreeLines: Story = {
  args: { as: "p", tone: "sun", variant: "hand", tilt: 4, lines: ["I’ll help pack.", "Mostly by sitting", "in the box."] },
};
export const DefaultTilt: Story = { args: { tone: "sun", lines: ["Ages 3 to 7"] } };
