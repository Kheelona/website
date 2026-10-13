import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddressForm } from "./AddressForm";

/* AddressForm (restyled in task 5.16; logic frozen, ADR-013): the checkout's address step as /thanks shows it, inside
 * the confirmation's column (ks-thanks; the AddressStep section styles its layout classes). */

const meta = {
  title: "Features/Preorder/AddressForm",
  component: AddressForm,
  args: { orderRef: "KH-A2B3-C4D5", token: "signed-token" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="kh-section ks-thanks">
        <div className="ks-thanks__col">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const AlreadySaved: Story = {
  args: {
    existing: {
      line1: "Flat 4B, Sunrise Apartments, 12th Main",
      line2: "Near the park",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560041",
    },
  },
};
