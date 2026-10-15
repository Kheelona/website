import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluOnFur from "@ds/assets/Kheelu/kheelu-on-fur.jpg";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { cta } from "@/content/en-IN/cta";
import { PLUS_NOTE } from "@/content/en-IN/offer";
import { seller } from "@/content/en-IN/seller";
import { TRUST_OFFER, trustItems } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import { OfferSection } from "./OfferSection";

/* OfferSection (task 3.2): Home's offer (fold 7 since task Q2.9) and the product page's offer (meet-kheelu.html fold 3),
   from the real content, in both offer modes. Since task 8c.2 (D061) the token-mode card shows the later price, and every
   story ends with the share link under the card (its message follows the mode). Since task Q2.13 both cards print the
   Kheelona+ note in the card, the price once and no help line; Home's close (the `close` variant) left. */

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
    variant: "home",
    heading: { eyebrow: "Pre-order", title: "What you get, and {hand:what you pay.}", lead: "There every day at home, with no screen to switch off." },
    cta: "home-offer",
    cardLabel: "Kheelu offer",
    note: PLUS_NOTE,
    trust: TRUST_OFFER.map((id) => trustItems[id]),
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

/** `home`: Home's offer since task Q2.9 (moved up to fold 7, the D2C plan v2): `#offer`, the lead, the Kheelona+ note in
 *  the card, the trust row with the card's third row, no help line, the share link, the board beside. */
export const HomeOffer: Story = {};

/** `home` in full mode: no split and no later price. */
export const HomeOfferFullMode: Story = { args: { offer: buildOffer("full") } };

/** `photo`: the product page's offer fold, the card beside the square photo; the same card as Home's (task Q2.13). */
export const ProductOffer: Story = {
  args: {
    variant: "photo",
    heading: { eyebrow: "What you get", title: "Everything that {hand:comes with it.}" },
    cta: "product-offer",
    photo: { src: kheeluOnFur, alt: "Kheelu by Kheelona, the cream plush rabbit that talks back, with rainbow ears and a speaker in its tummy." },
  },
};

/** `photo` in full mode. */
export const ProductOfferFullMode: Story = { args: { ...ProductOffer.args, offer: buildOffer("full") } };
