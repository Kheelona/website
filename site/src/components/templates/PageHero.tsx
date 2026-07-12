import { cn } from "@/lib/cn";
import { Container } from "@/components/atoms/Container";
import { Reveal } from "@/components/molecules/Reveal";

/** Interior-page split hero — copy left, media right — extracted in R11
 *  (the same Container grid was hand-typed on 8 routes, only the column
 *  ratio differing). Renders INSIDE a <Section wash=...>; the caller keeps
 *  ownership of the wash and any CurveDivider.
 *  R11 law (§8.19): new interior heroes use this component. */
export function PageHero({
  ratio = "md:grid-cols-[1.1fr_0.9fr]",
  media,
  mediaClassName = "flex justify-center",
  className,
  children,
}: {
  /** Literal Tailwind grid template for the two columns. */
  ratio?: string;
  media?: React.ReactNode;
  mediaClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Container
      className={cn("grid items-center gap-10 py-16 md:py-20", ratio, className)}
    >
      <Reveal mode="rise">{children}</Reveal>
      {media ? <Reveal className={mediaClassName}>{media}</Reveal> : null}
    </Container>
  );
}
