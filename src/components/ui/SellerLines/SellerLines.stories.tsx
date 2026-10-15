import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SellerLines } from "./SellerLines";

const meta = {
  title: "UI/SellerLines",
  component: SellerLines,
  args: {
    entity: "Kheelona Robotics Private Limited",
    address: "5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar, Bengaluru 560041, Karnataka, India",
    contact: (
      <>
        <a href="https://wa.me/919187546483">WhatsApp</a> · <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>
      </>
    ),
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof SellerLines>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The footer's legal row (the footer adds its own lines after these three). */
export const Footer: Story = {
  args: { entity: "© 2026 Kheelona Robotics Private Limited" },
  render: (args) => (
    <footer className="kh-footer">
      <div className="kh-footer__legal">
        <SellerLines {...args} variant="footer" />
      </div>
    </footer>
  ),
};

/** The contact page's seller card, which keeps the number (the E-Commerce Rules; D063 item 2). */
export const Block: Story = {
  args: {
    variant: "block",
    contact: (
      <>
        <a href="tel:+919187546483">+91 91875 46483</a> (WhatsApp or call) · <a href="mailto:hello@kheelona.com">hello@kheelona.com</a>
      </>
    ),
  },
  render: (args) => (
    <div className="kh-card">
      <SellerLines {...args} />
    </div>
  ),
};

/** The store footer's address. */
export const Store: Story = { args: { variant: "store" } };
