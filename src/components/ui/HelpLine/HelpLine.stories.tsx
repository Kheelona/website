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

/** Beside a CTA (home.html fold 1): `size` body-s, the default. */
export const Default: Story = {};

/** `size` body: /thanks fold 5 (store-confirmation.html). No lead; the words after the links go inside `contact`. */
export const Body: Story = {
  args: {
    size: "body",
    lead: undefined,
    contact: (
      <>
        <a href="https://wa.me/919187546483">WhatsApp</a> or{" "}
        <a href="tel:+919187546483">
          <span className="ks-nowrap">call +91 91875 46483</span>
        </a>
        , quoting your order number, or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>.
      </>
    ),
  },
};

/** `size` body-l: /setup's contact line under "Stuck?" (setup.html fold 7). No icon, no lead. */
export const BodyL: Story = {
  args: {
    size: "body-l",
    icon: undefined,
    lead: undefined,
    contact: (
      <>
        <a href="https://wa.me/919187546483">WhatsApp</a> or{" "}
        <a href="tel:+919187546483">
          call us on <span className="ks-nowrap">+91 91875 46483</span>
        </a>
        , or email <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>. Tell us your order number, and what you see on Kheelu and in the app.
      </>
    ),
  },
};

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
