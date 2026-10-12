import type { Copy } from "@/content/types";

/** The D032 published line (content/en-IN/seller.ts `grievance.line`): the bold label, then the officer, the
 *  contacts and the two response times. One content value for every page that shows it (D032). */
export interface GrievanceLine {
  /** "Grievance Officer:" */
  readonly lead: Copy;
  readonly text: Copy;
}

/**
 * The grievance block in its two contexts (mockup-css-mapping §6.2):
 * - `contact`: the contact page's fold (`#grievance`, the footer's target): heading and sentence beside the card,
 *   links in the DS link colour at 800 (contact.css:27);
 * - `legal`: the card a legal page puts in its part, links at the legal template's 700 (privacy.css:38); the page
 *   passes its card class and, on privacy and terms, the complaint-reference placeholder as `note`.
 */
export type GrievanceBlockConfig =
  | {
      readonly context: "contact";
      readonly title: Copy;
      /** The sentence beside the card. */
      readonly intro: Copy;
      readonly line: GrievanceLine;
    }
  | {
      readonly context: "legal";
      readonly line: GrievanceLine;
      /** A second paragraph in the card (privacy and terms: the complaint-reference placeholder). */
      readonly note?: Copy;
      /** The legal template's card class. */
      readonly className?: string;
    };

export type GrievanceBlockProps = GrievanceBlockConfig;
