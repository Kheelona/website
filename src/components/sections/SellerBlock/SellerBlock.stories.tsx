import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { seller } from "@/content/en-IN/seller";
import { SellerBlock } from "./SellerBlock";

/* SellerBlock (task 3.2): who a parent is buying from, from content/en-IN/seller.ts, in its two contexts. */

/* No GSTIN on the website (D063 item 3; task Q2.3). */
const sentence = `${seller.legalName}, registered at ${seller.addressLine}.`;

const meta: Meta<typeof SellerBlock> = {
  title: "Sections/SellerBlock",
  component: SellerBlock,
  args: {
    context: "contact",
    title: "Who you’re {hand:buying from.}",
    intro: "Kheelu is designed here in Bengaluru, by parents who use it at home, and made in India. This is also the company you’re buying from.",
    lines: { entity: seller.legalName, address: seller.addressLine, contact: seller.support.line },
  },
};

export default meta;
type Story = StoryObj<typeof SellerBlock>;

/** `contact`: the contact page's fold 4, the seller lines in the footer's order, the number kept (links 800). */
export const Contact: Story = {};

const inSection: Story["render"] = (args) => (
  <section className="kh-section">
    <div className="kh-container">
      <SellerBlock {...args} />
    </div>
  </section>
);

/** `legal`, card: privacy's "Who we are:" (terms: "Seller:"). */
export const LegalCard: Story = { args: { context: "legal", line: { lead: "Who we are:", text: sentence } }, render: inSection };

/** `legal`, plain paragraph: refund and shipping. */
export const LegalParagraph: Story = { args: { context: "legal", line: { text: sentence }, card: false }, render: inSection };
