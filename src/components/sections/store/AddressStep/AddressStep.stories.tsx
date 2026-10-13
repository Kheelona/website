import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { AddressForm } from "@/features/preorder";
import { AddressStep } from "./AddressStep";

/* AddressStep (task 5.16): /thanks fold 3 around the checkout's AddressForm, with no address yet (the approved fold)
 * and once saved. The words are the content module's; the order reference and token are sample values. */

const SAVED = { line1: "Flat 4B, Sunrise Apartments, 12th Main", line2: "Near the park", city: "Bengaluru", state: "Karnataka", pincode: "560041" };

const meta = {
  title: "Sections/Store/AddressStep",
  component: AddressStep,
  parameters: { layout: "fullscreen" },
  args: { copy: confirmation.address.empty, children: null },
  render: (args) => (
    <div className="kh-section ks-thanks">
      <div className="ks-thanks__col">
        <AddressStep {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof AddressStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No address yet: the approved fold. */
export const Empty: Story = { args: { children: <AddressForm orderRef="KH-A2B3-C4D5" token="signed-token" /> } };

/** An address already on the order: the saved card, with a way back to the form. */
export const Saved: Story = {
  args: { copy: confirmation.address.saved, children: <AddressForm orderRef="KH-A2B3-C4D5" token="signed-token" existing={SAVED} /> },
};
