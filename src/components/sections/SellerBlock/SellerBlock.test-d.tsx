/**
 * Type tests for SellerBlock (task 3.6 item 6). `npm run typecheck` (tsc --noEmit) checks this file: the `.test-d.tsx`
 * suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and Vitest's runtime
 * suite. Every line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 *
 * The seller's words are the same in both offer modes and render without the offer, so they are one `RichTextString`
 * each, never the per-mode `Copy` shape (which would throw at render for want of an offer).
 */
import { SellerBlock } from "./SellerBlock";

const MODES = { token: "Token words", full: "Full words" } as const;
const LINES = { entity: "Kheelona Robotics Private Limited", address: "Bengaluru", contact: "[hello](mailto:hello@kheelona.com)" };

export const accepted = () => (
  <>
    <SellerBlock context="contact" title="Who you’re {hand:buying from.}" intro="The company you buy from." lines={LINES} />
    <SellerBlock context="legal" line={{ lead: "Seller:", text: "Kheelona Robotics Private Limited." }} />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error the title is one string: the seller fold renders without the offer */}
    <SellerBlock context="contact" title={MODES} intro="x" lines={LINES} />
    {/* @ts-expect-error nor the sentence beside the card */}
    <SellerBlock context="contact" title="x" intro={MODES} lines={LINES} />
    {/* @ts-expect-error nor a seller line */}
    <SellerBlock context="contact" title="x" intro="x" lines={{ ...LINES, address: MODES }} />
    {/* @ts-expect-error no GSTIN line: the website prints none (D063 item 3) */}
    <SellerBlock context="contact" title="x" intro="x" lines={{ ...LINES, gstin: "GSTIN 29AAMCK1530E1ZN" }} />
    {/* @ts-expect-error nor the legal line's text */}
    <SellerBlock context="legal" line={{ text: MODES }} />
    {/* @ts-expect-error nor its lead */}
    <SellerBlock context="legal" line={{ lead: MODES, text: "x" }} />
  </>
);
