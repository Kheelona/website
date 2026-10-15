import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import type { Offer } from "@/content/types";
import { OfferCard } from "./OfferCard";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

/* The offer view model in both modes, as src/lib/offer/offer.ts (task 2.1) builds it. */
const token: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" },
  sentence:
    "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  sticky: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
  card: {
    product: "Kheelu",
    priceNote: "incl. GST",
    split: [
      { label: "Today, refundable", price: "token" },
      { label: "Before delivery", price: "balance" },
    ],
    /* D061 item 3 (task 8c.2): the later price, token mode only, as offer.ts holds it. */
    later: "{price:headline} for the first 500 units. {price:full} once they are gone.",
    perks: { home: [], product: [] },
  },
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
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
};

/* Stand-in for PreorderButton (task 2.2): its markup. */
const action = (
  <a href="https://store.kheelona.com" className="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="finale">
    <span>Pre-order Kheelu</span>
  </a>
);

const meta = {
  title: "UI/OfferCard",
  component: OfferCard,
  args: {
    offer: token,
    label: "Kheelu offer",
    action,
    perks: [
      { icon: icon("truck"), text: "Deliveries start mid-November" },
      { icon: icon("package"), text: "In the box: Kheelu plush toy, charger and quick-start card" },
      { icon: icon("map-pin"), text: "Delivery anywhere in India, included" },
      { icon: icon("check-circle"), text: "A GST invoice with every order" },
      /* D061 item 10 (task 8c.5): Made in India, last on both cards, as offer.ts lists it. */
      { icon: icon("house"), text: "Made in India" },
    ],
  },
  parameters: { layout: "padded" },
  /* In a DS split's first column, as on Home's close (home.html fold 9). */
  render: (args) => (
    <div className="kh-split">
      <div>
        <OfferCard {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof OfferCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Token mode: the later price under the amount (D061 item 3) and the split (Home's close). */
export const TokenMode: Story = {};
/** Full mode: no later price, no split, the full price (G-08). */
export const FullMode: Story = { args: { offer: full } };
