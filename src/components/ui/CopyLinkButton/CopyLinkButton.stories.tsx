import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CopyLinkButton } from "./CopyLinkButton";

/* "Copy link" with its polite live region (the row of the store's in-app note). */
const meta = {
  title: "UI/CopyLinkButton",
  component: CopyLinkButton,
  args: { value: "https://store.kheelona.com", label: "Copy link", copiedMessage: "Link copied." },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="ks-inapp__action">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CopyLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Idle: nothing in the live region yet. */
export const Default: Story = {};

/** After a click: the value is on the clipboard (stubbed here, so nothing real is copied) and the live region
 *  says so. */
export const Copied: Story = {
  beforeEach() {
    const own = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { value: { writeText: fn(async () => {}) }, configurable: true });
    return () => {
      if (own) Object.defineProperty(navigator, "clipboard", own);
      else Reflect.deleteProperty(navigator, "clipboard");
    };
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: args.label }));
    await expect(await canvas.findByText(args.copiedMessage)).toHaveAttribute("aria-live", "polite");
    await expect(navigator.clipboard.writeText).toHaveBeenCalledWith(args.value);
  },
};
