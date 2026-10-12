import type { Copy, Offer } from "@/content/types";
import type { HeadingProps } from "@/components/ui/Heading/Heading";
import type { CtaId } from "@/lib/tracking/cta";

/* CompareByCategory's configuration (task 3.3; components §2): Home fold 7, Kheelu against kinds of products (never
 * brands, B14). One set of rows feeds both layouts: the phone cards (below 720 px) and the DS table (from 720 px).
 * The phone cards word the other kinds as sentences ("Puzzles and activity books: yes"), which differ from the
 * table's cells, so each row carries both. */

export type CompareHeading = Pick<HeadingProps, "eyebrow" | "title" | "lead"> & { readonly id: string };

/** The DS marks: a check (yes), a cross (no), or words alone (some). */
export type CompareMark = "yes" | "no" | "some";

export interface CompareCellCopy {
  readonly mark?: CompareMark;
  readonly text: Copy;
}

export interface CompareRowCopy {
  /** What matters ("Screen-free"): the table's row header and the phone card's title. */
  readonly label: Copy;
  /** Kheelu's cell, marked. */
  readonly us: CompareCellCopy & { readonly mark: CompareMark };
  /** The other kinds' cells, in column order. */
  readonly others: readonly CompareCellCopy[];
  /** The phone card: Kheelu's line first ("Kheelu: Yes"), then one line per other kind, in column order. */
  readonly phone: { readonly us: Copy; readonly others: readonly Copy[] };
}

export interface CompareByCategoryConfig {
  readonly heading: CompareHeading;
  /** The table region's accessible name ("Comparison by kind of product"). */
  readonly label: string;
  /** The row headers' column ("What matters"). */
  readonly firstColumn: Copy;
  /** Kheelu's column, then the kinds of products. */
  readonly columns: { readonly us: Copy; readonly others: readonly Copy[] };
  readonly rows: readonly CompareRowCopy[];
  /** Under the cards and under the table ("Kinds of products, not brands: …"). */
  readonly caption: Copy;
  /** The ghost link after the comparison, with its arrow ("How to choose an AI toy", `compare-learn`). */
  readonly link?: { readonly label: string; readonly href: string; readonly cta?: CtaId };
}

export interface CompareByCategoryProps extends CompareByCategoryConfig {
  readonly offer?: Offer;
}
