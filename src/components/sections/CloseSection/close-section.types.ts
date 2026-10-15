import type { ArtBoardRef, Copy, Tone } from "@/content/types";
import type { CtaBlockConfig, CtaSecondary, SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";

interface CloseBase {
  readonly heading: SellingHeading;
}

/**
 * The closes of the approved mockup (section `#close`, heading `#close-title`), one variant per layout:
 * - `split`: the words and the CTA block beside an art board: the safety close (`artClamp`), the product close and Home's
 *   close, each with the CTA block's lines grouped beside the button (task Q2.15: the `full` layout left);
 * - `journal`: the stories hub and article closes: the CTA block's `journal` layout, the 4:3 board from 900 px;
 * - `guide`: the buyer's guide close: the split inside a tinted DS card (`ks-gd-close`), the board clamped;
 * - `center`: the team, contact and 404 closes: a centred heading and CTA block, no art;
 * - `links`: /setup's "Stuck?" fold (section `#help`): no chilli button, the contact line, the secondary button to
 *   /contact and the "Meet Kheelu" line (strategy §5).
 * The late-talker article's "Keep reading" close (no CTA, B5) is RelatedGuides `keep` (task 3.4; components §7).
 */
export type CloseSectionConfig =
  | (CloseBase & {
      readonly variant: "split";
      /** The CTA block, its lines grouped beside the button (`beside`). */
      readonly cta: Omit<CtaBlockConfig, "align">;
      readonly art: ArtBoardRef;
      /** ArtBoard's 480 px tablet clamp (the safety close; safety.css:52). */
      readonly artClamp?: boolean;
    })
  | (CloseBase & {
      readonly variant: "journal";
      readonly cta: Omit<CtaBlockConfig, "align" | "layout">;
      readonly art: ArtBoardRef;
    })
  | (CloseBase & {
      readonly variant: "guide";
      /** The card's tone (`kh-tone-*`). */
      readonly tone: Tone;
      readonly cta: Omit<CtaBlockConfig, "align" | "layout">;
      readonly art: ArtBoardRef;
    })
  | (CloseBase & {
      readonly variant: "center";
      readonly cta: Omit<CtaBlockConfig, "align">;
    })
  | (CloseBase & {
      readonly variant: "links";
      /** The contact line under the heading: the WhatsApp, call and email links and the words after them. */
      readonly contact: Copy;
      /** The secondary button to every way of reaching us. */
      readonly action: CtaSecondary;
      /** "Don't have Kheelu yet?" and the link to the product page; left out where the page's own close does that job
       *  (/setup since the selling update, task Q2.12: its fold 8 is the pre-order close). */
      readonly meet?: { readonly lead: Copy; readonly link: Copy };
    });

export type CloseSectionProps = CloseSectionConfig & SellingContext;
