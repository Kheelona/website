import clsx from "clsx";
import { Fragment, type CSSProperties } from "react";
import type { StickerRef } from "@/content/types";
import { RichText } from "../RichText/RichText";

export interface StickerProps extends StickerRef {
  /** A `<span>` inside an art board (default), or a `<p>` standing alone (the refund and shipping hand
   *  stickers), whose paragraph margin `ks-sticker--flush` removes. */
  as?: "span" | "p";
  /** A composition hook for its place on a board (`ks-hero-sticker`). */
  className?: string;
}

/**
 * DS Sticker (design-system/project/components/Sticker): a tilted, white-outlined label. `round` is the burst
 * with a bold lead line; `hand` sets it in Kalam. The tilt is the DS's own `--kh-tilt` (degrees; the DS default
 * -3 when absent), the one inline style the DS specifies (10-pages.md:42-52). Its lines break where the copy
 * breaks. Words are claims: only approved copy (DS rule).
 */
export function Sticker({ tone, tilt, variant, lead, lines, as: Tag = "span", className }: StickerProps) {
  return (
    <Tag
      className={clsx("kh-sticker", `kh-tone-${tone}`, variant && `kh-sticker--${variant}`, Tag === "p" && "ks-sticker--flush", className)}
      style={{ "--kh-tilt": tilt === undefined ? undefined : `${tilt}deg` } as CSSProperties}
    >
      {lead !== undefined && (
        <strong>
          <RichText text={lead} />
        </strong>
      )}
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <RichText text={line} />
        </Fragment>
      ))}
    </Tag>
  );
}
