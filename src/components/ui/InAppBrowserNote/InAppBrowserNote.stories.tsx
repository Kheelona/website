import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InAppBrowserNote } from "./InAppBrowserNote";

/* The store's in-app browser note. It shows only inside Instagram, Facebook or WhatsApp, so the "inside"
   stories give the preview that browser's user agent for their own render and put it back afterwards. */
const INSTAGRAM_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 310.0.0.27.110 (iPhone14,5; iOS 17_1; en_IN; en; scale=3.00; 1170x2532; 541635890)";

function asInstagram() {
  Object.defineProperty(navigator, "userAgent", { value: INSTAGRAM_UA, configurable: true });
  return () => {
    Reflect.deleteProperty(navigator, "userAgent");
  };
}

const meta = {
  title: "UI/InAppBrowserNote",
  component: InAppBrowserNote,
  args: {
    storeUrl: "https://store.kheelona.com",
    content: {
      enabled: true,
      title: "Paying by UPI? Open this page in Chrome or Safari.",
      body: "Do it first, so you don’t type your details twice. Copy the link and paste it into Chrome or Safari:",
      copyLabel: "Copy link",
      copiedMessage: "Link copied.",
    },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof InAppBrowserNote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Enabled, inside Instagram: the note shows. */
export const InsideInstagram: Story = { beforeEach: asInstagram };

/** Enabled, in this browser (not an in-app one): nothing renders. */
export const InThisBrowser: Story = {};

/** Switched off (until QA's real-device check), even inside Instagram: nothing renders. */
export const Disabled: Story = {
  beforeEach: asInstagram,
  args: { content: { ...meta.args.content, enabled: false } },
};
