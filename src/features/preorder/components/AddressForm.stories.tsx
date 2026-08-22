import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddressForm } from "./AddressForm";

const meta = {
  title: "Features/Preorder/AddressForm",
  component: AddressForm,
  args: { orderRef: "KH-A2B3-C4D5", token: "signed-token" },
  parameters: { layout: "padded" },
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
