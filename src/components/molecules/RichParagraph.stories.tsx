import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RichParagraph } from "./RichParagraph";

const meta = {
  title: "Molecules/RichParagraph",
  component: RichParagraph,
} satisfies Meta<typeof RichParagraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  args: { text: "A paragraph with no links reads exactly as it did before.", className: "text-[18px] leading-[1.7]" },
};

export const WithLinks: Story = {
  args: {
    text: "The [World Health Organization](https://www.who.int/) recommends no more than one hour a day at ages 3 to 4. The mechanisms behind that are on the [Safety page](/safety).",
    className: "text-[18px] leading-[1.7]",
  },
};
