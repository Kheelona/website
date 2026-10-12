import type { Copy, Gated, ImageRef, OrPlaceholder, RichTextString } from "@/content/types";

/** One founder card (team.html fold 3). */
export interface FounderCard {
  readonly name: string;
  /** As the team page prints it: "Co-Founder and CEO". */
  readonly role: string;
  /** The badge beside the name until the founder's photo is approved. */
  readonly initials: string;
  /** B24: a placeholder until the photo is supplied and approved; then the photo takes the badge's place. Its alt is
   *  empty: the name beside it says who it is. */
  readonly photo: OrPlaceholder<ImageRef>;
  readonly body: RichTextString;
  /** The background line, proof-gated (D038, F11): never rendered while `gated` is set. */
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
