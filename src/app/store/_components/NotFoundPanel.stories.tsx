import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotFoundPanel } from "./NotFoundPanel";

const meta = {
  title: "Store/NotFoundPanel",
  component: NotFoundPanel,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof NotFoundPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A mistyped URL, or the doubled /store prefix. */
export const WrongUrl: Story = {};

/** A reader who has already paid: no "buy again" button, WhatsApp only. */
export const OrderWillNotLoad: Story = {
  args: {
    title: "We cannot open that order right now.",
    body: "Your link is fine. The order behind it did not load, which is ours to sort out and not yours.",
    cta: false,
  },
};
