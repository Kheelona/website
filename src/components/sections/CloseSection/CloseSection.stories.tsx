import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import iraSticker from "@ds/assets/Cast/ira-sticker.png";
import kabirSticker from "@ds/assets/Cast/kabir-sticker.png";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import flowerChilli from "@ds/assets/Shapes/flower-chilli.svg";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import { DoodleDefs } from "@/components/ui/Doodle/DoodleDefs";
import { cta } from "@/content/en-IN/cta";
import { seller } from "@/content/en-IN/seller";
import { TRUST_COMPACT, trustItems, type TrustId } from "@/content/en-IN/trust";
import { buildOffer } from "@/lib/offer/offer";
import type { CtaSecondary } from "../CtaBlock/cta-block.types";
import { CloseSection } from "./CloseSection";

/* CloseSection (task 3.2): each variant as an approved page closes, from the real content. The boards repeat the
   mockup's layers (safety.html, meet-kheelu.html, ai-toys-for-kids-in-india.html and stories.html closes). */

const trust = (ids: readonly TrustId[]) => ids.map((id) => trustItems[id]);
const COMPACT = trust(TRUST_COMPACT);
/* The ghost link under a close, as every close words it since task Q2.15 (the consistency review's CON-7). */
const seeHow: CtaSecondary = { label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" };

const meta: Meta<typeof CloseSection> = {
  title: "Sections/CloseSection",
  component: CloseSection,
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
    variant: "split",
    heading: {
      eyebrow: "Pre-order",
      title: "Check it all for yourself, {hand:at home.}",
      lead: "The wake-up button, the light and every conversation in the parent app: you can check each one once it’s home.",
    },
    cta: { cta: "finale", trust: COMPACT, helpLine: true },
    art: {
      tone: "blue",
      label: "A laughing girl in a peach kurta beside Kheelu, the cream plush rabbit.",
      layers: [
        { image: { src: starSun, alt: "" }, left: 6, width: 28, top: 7 },
        { image: { src: iraSticker, alt: "" }, left: 38, width: 56, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "chalk-heart" }, left: 84, width: 11, top: 8, rotate: 12 },
      ],
    },
    artClamp: true,
  },
};

export default meta;
type Story = StoryObj<typeof CloseSection>;

/** `split`: the safety close (clamped board, block button with the arrow, help line in the group). */
export const SplitSafety: Story = {};

/** `split`: the product close (meet-kheelu.html fold 9), its lines grouped beside the button as every close (task Q2.15). */
export const SplitProduct: Story = {
  args: {
    heading: {
      eyebrow: "Pre-order",
      title: "Bring home a toy that {hand:asks back.}",
      lead: "For your own child, or as a gift for a 3 to 7 year old in the family.",
    },
    cta: { cta: "product-foot", id: "reserve", trust: COMPACT, helpLine: true },
    art: {
      tone: "sun",
      label: "A smiling girl in a peach kurta beside Kheelu, the cream plush rabbit.",
      layers: [
        { image: { src: heartChilli, alt: "" }, left: 6, width: 28, top: 7 },
        { image: { src: iraSticker, alt: "" }, left: 38, width: 58, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-star" }, left: 84, width: 11, top: 8, rotate: 14 },
      ],
    },
    artClamp: false,
  },
};

/** `guide`: the buyer's guide close in its tinted card. */
export const Guide: Story = {
  args: {
    variant: "guide",
    tone: "blue",
    heading: { eyebrow: "Pre-order", title: "Five checks, answered. Now {hand:meet Kheelu.}", lead: "Bring it home and check all five answers for yourself." },
    art: {
      tone: "sun",
      label: "A boy in glasses and a rust T-shirt beside Kheelu, the cream plush rabbit.",
      layers: [
        { image: { src: heartChilli, alt: "" }, left: 6, width: 26, top: 8 },
        { image: { src: kabirSticker, alt: "" }, left: 40, width: 54, bottom: 0 },
        { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-star" }, left: 82, width: 11, top: 9, rotate: 14 },
      ],
    },
  },
};

/** `journal`: the stories hub and article closes; the 4:3 board shows from 900 px. Labelled "Pre-order" as every selling
 *  close since task Q2.15 (CON-6). */
export const Journal: Story = {
  args: {
    variant: "journal",
    heading: {
      eyebrow: "Pre-order",
      title: "A toy that {hand:asks back.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
    },
    cta: { cta: "finale", trust: COMPACT, helpLine: true, secondary: seeHow },
    art: {
      tone: "sun",
      label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
      layers: [
        { image: { src: flowerChilli, alt: "" }, left: 7, width: 24, top: 9 },
        { image: { src: kheeluFront, alt: "" }, left: 29, width: 42, bottom: 3, rotate: -5 },
        { doodle: { name: "ink-heart" }, left: 72, width: 12, top: 12, rotate: 14 },
      ],
    },
  },
};

/** `center`: the team close (centred heading and block, no art), labelled "Pre-order" since task Q2.15 (CON-6). */
export const Center: Story = {
  args: {
    variant: "center",
    heading: { eyebrow: "Pre-order", title: "Bring Kheelu {hand:home.}" },
    cta: { cta: "finale", trust: COMPACT, helpLine: true, secondary: seeHow },
  },
};

/** `links`: /setup's "Stuck?" fold, no chilli button. */
export const Links: Story = {
  args: {
    variant: "links",
    heading: { title: "Stuck? {hand:We’ll help.}" },
    contact:
      "[WhatsApp](https://wa.me/919187546483) or email [hello@kheelona.com](mailto:hello@kheelona.com). Tell us your order number, and what you see on Kheelu and in the app.",
    action: { label: "All the ways to reach us", href: "/contact", variant: "secondary", icon: "chat-circle-dots" },
    meet: { lead: "Don’t have Kheelu yet?", link: "[Meet Kheelu](/products/kheelu)" },
  },
};

/** `links` without `meet`: /setup's "Stuck?" fold since the selling update (task Q2.12), ending on its secondary button,
 *  because the page's own pre-order close follows it. */
export const LinksHelpOnly: Story = {
  args: { ...Links.args, meet: undefined },
};

/** `center` with an eyebrow and a lead: /setup's pre-order close (task Q2.12; the D2C plan v2 §5 fold 8), no help line; on
 *  the cream band since task Q2.15 (`band`; QAL-8: the page's bands alternate to the end). */
export const CenterWithLead: Story = {
  args: {
    variant: "center",
    band: true,
    heading: {
      eyebrow: "Pre-order",
      title: "Don’t have Kheelu {hand:yet?}",
      lead: "Day one takes your phone, the parent app and your home Wi‑Fi password.",
    },
    cta: { cta: "finale", trust: COMPACT },
  },
};

/** Full mode: the safety close with the paid-in-full sentence (ADR-005). */
export const FullMode: Story = { args: { offer: buildOffer("full") } };
