import type { Copy, Gated, ImageRef, OrPlaceholder, RichTextString } from "@/content/types";

/** One founder card (team.html fold 3). */
export interface FounderCard {
  readonly name: string;
  /** As the team page prints it: "Co-Founder and CEO". */
  readonly role: string;
  /** The badge beside the name while the photo is a placeholder. */
  readonly initials: string;
  /** The founder's photo in the badge's place (the live photos since task 6.6, D054 item 20, settling B24), with the
   *  copy page's alt; a placeholder shows the initials badge and the placeholder line instead. */
  readonly photo: OrPlaceholder<ImageRef>;
  readonly body: RichTextString;
  /** The background line (D054 item 20: from the live bios); a `gated` line never renders (D038). */
  readonly bio?: Gated<{ readonly text: RichTextString }>;
  readonly link: { readonly label: string; readonly href: `https://${string}` };
  /** The fragment on /team that describes the person (organization.ts `anchor`), on the name. */
  readonly anchor?: string;
}

/** FoundersSection's configuration: the heading and the founders (organization.ts facts, team page words). */
export interface FoundersSectionConfig {
  readonly title: Copy;
  readonly founders: readonly FounderCard[];
  /** The heading's id, which names the section ("founders-title" by default). */
  readonly id?: string;
}
