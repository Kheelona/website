import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * The DS page layout (design-system/project/components/bundle.css, "Page layout"): sections, the content
 * container, the two-column split, column grids, the section head and the actions row, nested as the
 * approved mockup nests them. Each takes composition hooks (`ks-…`) after the DS classes.
 *
 * `reveal` marks a block that fades and rises once on scroll (D049 pick 1; architecture §11.3). A Section
 * never takes it: the first section, the h1, the price, a chilli button and the offer card never move
 * (test/guards/no-reveal-on-money.test.tsx), and the mockup reveals blocks inside sections only.
 */

/** Removes a list's margin, padding and bullets (`ks-list-reset`, layout.css); for lists other primitives render. */
export const LIST_RESET = "ks-list-reset";

interface Box {
  className?: string;
  children?: ReactNode;
}

interface Revealing extends Box {
  /** Fades and rises once when it scrolls into view (never on the first screen's money). */
  reveal?: boolean;
}

const revealAttr = (reveal: boolean | undefined) => (reveal ? { "data-reveal": "" } : {});

export interface SectionProps extends Box {
  id?: string;
  /** The cream band (`kh-section--band`). */
  band?: boolean;
  /** Less block padding (`kh-section--tight`). */
  tight?: boolean;
  /** The id of the heading that names the section. */
  labelledBy?: string;
}

export function Section({ id, band, tight, labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={clsx("kh-section", band && "kh-section--band", tight && "kh-section--tight", className)}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}

export function Container({ reveal, className, children }: Revealing) {
  return (
    <div className={clsx("kh-container", className)} {...revealAttr(reveal)}>
      {children}
    </div>
  );
}

/** Which column is wider from 900 px (7 : 5); equal without it. */
type Wide = "start" | "end";
const splitClasses = (wide: Wide | undefined) => clsx("kh-split", wide && `kh-split--wide-${wide}`);

export interface SplitProps extends Revealing {
  wide?: Wide;
}

export function Split({ wide, reveal, className, children }: SplitProps) {
  return (
    <div className={clsx(splitClasses(wide), className)} {...revealAttr(reveal)}>
      {children}
    </div>
  );
}

export interface ColsProps extends Revealing {
  /** Columns from 720 px (4: two, then four from 1024 px); one column without it. */
  count?: 2 | 3 | 4;
  /** A list when the columns are items (guides, cards). */
  as?: "div" | "ul" | "ol";
}

export function Cols({ count, as: Tag = "div", reveal, className, children }: ColsProps) {
  return (
    <Tag className={clsx("kh-cols", count && `kh-cols--${count}`, className)} {...revealAttr(reveal)}>
      {children}
    </Tag>
  );
}

export interface SectionHeadProps extends Box {
  /** A head that is also a split (heading beside a photo): "even", or the wider column. */
  split?: "even" | Wide;
}

export function SectionHead({ split, className, children }: SectionHeadProps) {
  const layout = split === undefined ? undefined : splitClasses(split === "even" ? undefined : split);
  return <div className={clsx("kh-section__head", layout, className)}>{children}</div>;
}

export interface ActionsProps extends Box {
  center?: boolean;
}

export function Actions({ center, className, children }: ActionsProps) {
  return <div className={clsx("kh-section__actions", center && "kh-section__actions--center", className)}>{children}</div>;
}
