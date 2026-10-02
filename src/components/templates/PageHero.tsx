import { cn } from "@/lib/cn";

/** Interior-page hero — copy left, optional media right (the mockup's
 *  `.page-hero`). R11 law (§8.19): new interior heroes use this component.
 *
 *  LCP: nothing here animates or hides, so the media paints at once. */
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
    <section className="kh-page-hero relative overflow-x-clip">
      <div className={cn("kh-wrap grid items-center gap-8", media && ratio, className)}>
        <div>{children}</div>
        {media ? <div className={mediaClassName}>{media}</div> : null}
      </div>
    </section>
  );
}
