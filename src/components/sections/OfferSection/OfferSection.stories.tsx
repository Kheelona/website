import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluOnFur from "@ds/assets/Kheelu/kheelu-on-fur.jpg";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_FULL, trustItems } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { OfferSection } from "./OfferSection";

/* OfferSection (task 3.2): Home's close (home.html fold 9) and the product page's offer (meet-kheelu.html fold 3),
   from the real content, in both offer modes. */

const meta: Meta<typeof OfferSection> = {
  title: "Sections/OfferSection",
  component: OfferSection,
  decorators: [
    (Story) => (
      <>
        <DoodleDefs />
        <Story />
      </>
    ),
  ],
  args: {
    offer: buildOffer("token"),
    ctaLabel: cta.preorder,
    help: seller.help,
    variant: "close",
    heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}" },
    cta: "finale",
    cardLabel: "Kheelu offer",
    trust: TRUST_FULL.map((id) => trustItems[id]),
    art: {
      tone: "sun",
      label: "A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit",
      layers: [
        { image: { src: flowerChilli, alt: "" }, left: 6, width: 30, top: 7 },
        { image: { src: myraSticker, alt: "" }, left: 44, width: 48, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-heart" }, left: 82, width: 12, top: 9, rotate: 14 },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OfferSection>;

/** `close`: Home's close, token mode (the split shows). */
export const HomeClose: Story = {};

/** `close` in full mode: no split, the full price and sentence (G-08). */
export const HomeCloseFullMode: Story = { args: { offer: buildOffer("full") } };

/** `photo`: the product page's offer fold, the card beside the square photo. */
export const ProductOffer: Story = {
  args: {
    variant: "photo",
    heading: { eyebrow: "What you get", title: "Everything that {hand:comes with it.}" },
    cta: "product-offer",
    trust: (["returns-7-days", "warranty-6-months", "payment-methods"] as const).map((id) => trustItems[id]),
    photo: { src: kheeluOnFur, alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." },
  },
};

/** `photo` in full mode. */
export const ProductOfferFullMode: Story = { args: { ...ProductOffer.args, offer: buildOffer("full") } };
