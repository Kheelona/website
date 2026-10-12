import clsx from "clsx";
import type { ReactNode } from "react";
import type { Copy, Offer } from "@/content/types";
import { RichText, type SourceMarkerOptions } from "../RichText/RichText";

/** The generated type steps a title may take from 1024 px (src/styles/generated/type-steps.css). */
export type TitleStep = "display-xl" | "display-l" | "display-m" | "headline" | "title";

export interface HeadingProps {
  /** The headline, at most one `{hand:…}` or `{mark:…}` accent (DS rule). */
  title: Copy;
  /** Up to four words above the title. */
  eyebrow?: Copy;
  /** Two lines at most (DS rule). */
  lead?: Copy;
  /** The heading element: h2 by default; h1 once per page. */
  level?: 1 | 2 | 3;
  /** The DS SectionHeading's values: left (default) or center (`kh-heading--center`). */
  align?: "left" | "center";
  /** The hero sizes: 40 px on phones, 56 from 768, 72 from 1024 (`kh-heading--hero`). */
  hero?: boolean;
  /** On the title element, for the section's aria-labelledby. */
  id?: string;
  /**
   * A `ks-type-*` step from 1024 px, on an inner block span, for a title a compound DS rule would otherwise
   * size (the article title: 56/58 where the hero rule makes 72/74; mockup-css-mapping row 81).
   */
  titleStepXl?: TitleStep;
  offer?: Offer;
  sources?: SourceMarkerOptions;
  /** The wrapper: a `<header>` (sections) or a `<div>` (the article heads, as the mockup has them). */
  as?: "header" | "div";
  /** Composition hooks on the wrapper (`ks-…`). */
  className?: string;
  /** Anything that follows the lead inside the header (the contact hero's extra line). */
  children?: ReactNode;
}

/**
 * DS SectionHeading (design-system/project/components/SectionHeading): `kh-heading` with an eyebrow, the
 * Baloo 2 title and a Nunito lead, every string rendered by `RichText`. Markup as the approved mockup.
 */
export function Heading(props: HeadingProps) {
  const { title, eyebrow, lead, level = 2, align, hero, id, titleStepXl, offer, sources, as: Wrapper = "header", className, children } = props;
  const Title = `h${level}` as const;
  const words = <RichText text={title} offer={offer} sources={sources} />;
  return (
    <Wrapper className={clsx("kh-heading", align === "center" && "kh-heading--center", hero && "kh-heading--hero", className)}>
      {eyebrow !== undefined && <RichText as="p" className="kh-eyebrow" text={eyebrow} offer={offer} />}
      <Title className="kh-heading__title" id={id}>
        {titleStepXl ? <span className={`ks-heading__step ks-type-${titleStepXl}@xl`}>{words}</span> : words}
      </Title>
      {lead !== undefined && <RichText as="p" className="kh-heading__lead" text={lead} offer={offer} sources={sources} />}
      {children}
    </Wrapper>
  );
}
