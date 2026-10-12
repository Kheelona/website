import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { TickList } from "./TickList";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const meta = {
  title: "UI/TickList",
  component: TickList,
  args: {
    items: [
      { icon: icon("wifi-high"), text: "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it." },
      { icon: icon("wifi-slash"), text: "It can’t browse the internet. When it doesn’t know something, it says so." },
      {
        icon: icon("battery-charging"),
        text: (
          <>
            It charges with the charger in the box. <span className="ks-placeholder">[PLACEHOLDER F4: battery life per charge and charging time]</span>
          </>
        ),
      },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof TickList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Good to know" on the product page, with a placeholder line. */
export const Default: Story = {};
