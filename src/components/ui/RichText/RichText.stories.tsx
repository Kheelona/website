import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Offer } from "@/content/types";
import { RichText } from "./RichText";

/* Each token of the inline syntax, in wording taken from the approved mockups. The offer is a fixture in
   token mode; pages pass the live one (src/lib/offer). */
const offer: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999" },
  sentence: "",
  sticky: { big: "", small: "" },
  card: { product: "Kheelu", priceNote: "incl. GST", perks: { home: [], product: [] } },
  plus: "",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};

const meta = {
  title: "UI/RichText",
  component: RichText,
  parameters: { layout: "padded" },
  args: { offer, sources: { label: "Source" } },
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HandAccent: Story = {
  args: { as: "p", className: "kh-headline", text: "Kheelu answers every why. Then it {hand:asks one back.}" },
};

export const Mark: Story = { args: { as: "p", className: "kh-body", text: "{mark:Conversation} helps a young brain grow." } };

export const PriceSentence: Story = {
  args: {
    as: "p",
    className: "kh-body-s",
    text: "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
  },
};

export const LinksAndNoWrap: Story = {
  args: {
    as: "p",
    className: "kh-body-s",
    text: "Questions? [WhatsApp](https://wa.me/919187546483) or {nowrap:[call +91 91875 46483](tel:+919187546483)}",
  },
};

export const SourceMarkers: Story = {
  args: {
    as: "p",
    className: "kh-body",
    text: "A tablet gives your child something to watch, and both the WHO and the AAP put a ceiling on it: no more than an hour a day from age two until five.[^1][^2]",
  },
};

export const SourceMarkersInAnArticle: Story = {
  args: { ...SourceMarkers.args, sources: { label: "Source", variant: "article" } },
};

export const Delivery: Story = { args: { as: "p", className: "kh-body-s", text: "{delivery} · 7-day returns, no questions asked" } };
