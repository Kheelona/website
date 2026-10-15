import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Offer } from "@/content/types";
import { PriceSentence } from "./PriceSentence";

/* The offer view model in both modes, as src/lib/offer/offer.ts (task 2.1) builds it. */
const token: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" },
  sentence:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  /* D065 item 3 (task Q2.8): the short price line beside every button on the selling pages; the store keeps D028's. */
  priceLine: "{price:token} today, refundable. {price:headline} in total.",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} in total" },
  card: { product: "Kheelu", perks: { home: [], product: [] } },
  /* D058 item 3, as offer.ts prints it (task 8b.1b). */
  plus: "Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};
const full: Offer = {
  ...token,
  mode: "full",
  headlinePaise: 799_900,
  prices: { ...token.prices, headline: "₹7,999" },
  sentence: "{price:full} (incl. GST), paid in full when you order.",
  priceLine: "{price:full} in total, paid in full when you order.",
  sticky: { big: "{price:full}", small: "Paid in full · {delivery}" },
};

const meta = {
  title: "UI/PriceSentence",
  component: PriceSentence,
  args: { offer: token },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PriceSentence>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside every CTA (token mode): the short price line (D065 item 3). */
export const Beside: Story = {};
/** The same place once the first 500 are gone (full mode). */
export const BesideFullMode: Story = { args: { offer: full } };
/** The drawer's note. */
export const Drawer: Story = { args: { variant: "drawer" } };
/** The offer card's fine print. */
export const OfferFine: Story = { args: { variant: "offer-fine" } };
/** The store's first screen: the checkout keeps D028's sentence. */
export const Store: Story = { args: { variant: "store" } };
/** The store's first screen in full mode. */
export const StoreFullMode: Story = { args: { variant: "store", offer: full } };
