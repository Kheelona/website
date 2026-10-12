import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { HelpLine } from "./HelpLine";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const contact = (
  <>
    <a href="https://wa.me/919187546483">WhatsApp</a> or{" "}
    <a href="tel:+919187546483">
      <span className="ks-nowrap">call +91 91875 46483</span>
    </a>
  </>
);

const meta = {
  title: "UI/HelpLine",
  component: HelpLine,
  args: { icon: icon("whatsapp-logo"), lead: "Questions?", contact },
  parameters: { layout: "padded" },
} satisfies Meta<typeof HelpLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside a CTA (home.html fold 1). */
export const Default: Story = {};

/** The store header's line, without an icon. */
export const NoIcon: Story = {
  args: {
    icon: undefined,
    lead: "Need help?",
    contact: (
      <>
        <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483">call</a>
      </>
    ),
  },
};
