import type { RichTextString } from "@/content/types";

/* D032's line, the fold's words and the note are the same in both offer modes and render without the offer, so each is
   one `RichTextString`, never the per-mode `Copy` shape (task 3.6; GrievanceBlock.test-d.tsx). */

/** The D032 published line (content/en-IN/seller.ts `grievance.line`): the bold label, then the officer, the
 *  contacts and the two response times. One content value for every page that shows it (D032); refund and shipping
 *  wrap `Co-Founder` in `{nowrap:…}` (4.3's seller-lines helper). */
export interface GrievanceLine {
  /** "Grievance Officer:" */
  readonly lead: RichTextString;
  readonly text: RichTextString;
}

/**
 * The grievance block in its two contexts (mockup-css-mapping §6.2):
 * - `contact`: the contact page's fold (`#grievance`, the footer's target): heading and sentence beside the card,
 *   links in the DS link colour at 800 (contact.css:27);
 * - `legal`: the card a legal page puts in its part, links at the legal template's 700 (privacy.css:38); the page
 *   passes its card class and, when content holds one, the complaint-reference line as `note`. None of the four
 *   legal pages shows it today: it is off until a system issues a reference (D055 item 7, task 6.7).
 */
export type GrievanceBlockConfig =
  | {
      readonly context: "contact";
      readonly title: RichTextString;
      /** The sentence beside the card. */
      readonly intro: RichTextString;
      readonly line: GrievanceLine;
    }
  | {
      readonly context: "legal";
      readonly line: GrievanceLine;
      /** A second paragraph in the card: the complaint-reference line (LegalTemplateCopy's optional `grievanceNote`),
       *  left out on all four legal pages until a system issues a reference (D055 item 7). The contact page's fold has
       *  none. */
      readonly note?: RichTextString;
      /** The legal template's card class. */
      readonly className?: string;
    };

export type GrievanceBlockProps = GrievanceBlockConfig;
