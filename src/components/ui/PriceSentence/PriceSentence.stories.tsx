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
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
  plus: "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};
const full: Offer = {
  ...token,
  mode: "full",
  headlinePaise: 799_900,
  prices: { ...token.prices, headline: "₹7,999" },
  sentence: "{price:full} (incl. GST), paid in full when you order.",
};

const meta = {
  title: "UI/PriceSentence",
  component: PriceSentence,
  args: { offer: token },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PriceSentence>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside every CTA (token mode). */
export const Beside: Story = {};
/** The same place once the first 500 are gone (full mode). */
export const BesideFullMode: Story = { args: { offer: full } };
/** The drawer's note. */
export const Drawer: Story = { args: { variant: "drawer" } };
/** The offer card's fine print. */
export const OfferFine: Story = { args: { variant: "offer-fine" } };
/** The store's first screen. */
export const Store: Story = { args: { variant: "store" } };
