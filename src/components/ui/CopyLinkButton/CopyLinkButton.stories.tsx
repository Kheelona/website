import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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

export const Default: Story = {};
