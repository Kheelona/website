import clsx from "clsx";
import Image from "next/image";
import type { ImageRef, Tone } from "@/content/types";
import { imageSource, loadingFor } from "@/components/ui/Photo/image";

/* A round initials or photo badge (task 2.3; DS Avatar kh-avatar, bundle.css:1109-1113; DS Avatar README).
 *
 * Approved markup (team.html:44, 57, 70): `<span class="kh-avatar kh-avatar--xl kh-tone-sun" aria-hidden="true">
 * <span>AS</span></span>`: initials beside the founder's visible name, so the badge is hidden and the name is not
 * read twice (DS rule). Standing alone, initials take a `label` and become one named image, as the DS component
 * renders them. A photo (the founders' own, once supplied and approved, B24) is named by its alt text, empty beside
 * a visible name. */

type AvatarBase = {
  /** DS sizes: s 32, m 48 (default), l 64, xl 96 px. */
  readonly size?: "s" | "m" | "l" | "xl";
  /** The initials background (DS default Kheelu Blue). */
  readonly tone?: Tone;
  /** The section's own composition class (`ks-…`). */
  readonly className?: string;
};

export type AvatarProps = AvatarBase &
  (
    | { readonly initials: string; readonly label?: string; readonly image?: never; readonly sizes?: never }
    | { readonly image: ImageRef; readonly sizes: string; readonly initials?: never; readonly label?: never }
  );

export function Avatar(props: AvatarProps) {
  const { size = "m", tone = "blue", className } = props;
  const classes = clsx("kh-avatar", size !== "m" && `kh-avatar--${size}`, `kh-tone-${tone}`, className);
  if (props.image) {
    return (
      <span className={classes}>
        <Image {...imageSource(props.image)} alt={props.image.alt} sizes={props.sizes} {...loadingFor(false)} />
      </span>
    );
  }
  return props.label ? (
    <span className={classes} role="img" aria-label={props.label}>
      <span aria-hidden="true">{props.initials}</span>
    </span>
  ) : (
    <span className={classes} aria-hidden="true">
      <span>{props.initials}</span>
    </span>
  );
}
