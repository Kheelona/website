import clsx from "clsx";
import type { Tone } from "@/content/types";
import { LIST_RESET } from "../Layout/Layout";

export interface ChipProps {
  /** The chip's words, from content. */
  label: string;
  /** A DS tone for the chip's tint and text (`kh-tone-*`). */
  tone?: Tone;
  /** On a band section the DS chip keeps the band colour and disappears; this switches it to the page cream
   *  there (DS gap G-19, composed as the mockup does for the film chips). */
  onBand?: boolean;
  /** A list item inside a ChipList. */
  as?: "span" | "li";
}

/** A DS chip (`kh-chip`): the films' labels, the product page's skills. */
export function Chip({ label, tone, onBand, as: Tag = "span" }: ChipProps) {
  return <Tag className={clsx("kh-chip", tone && `kh-tone-${tone}`, onBand && "ks-chip--on-band")}>{label}</Tag>;
}

export interface ChipListProps {
  /** The list's accessible name ("The four thinking skills"), from content. */
  label: string;
  items: readonly string[];
  /** Tints every chip of the list (on the list, as the mockup does). */
  tone?: Tone;
  /** A composition hook on the list (`ks-skills`). */
  className?: string;
}

/** A named list of chips (`kh-chips`), its bullets and spacing reset. */
export function ChipList({ label, items, tone, className }: ChipListProps) {
  return (
    <ul className={clsx("kh-chips", tone && `kh-tone-${tone}`, LIST_RESET, className)} aria-label={label}>
      {items.map((item) => (
        <Chip key={item} label={item} as="li" />
      ))}
    </ul>
  );
}
