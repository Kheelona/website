import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/atoms/Eyebrow";

/** The site's heading trio — eyebrow + display title + lede — extracted in
 *  R11 (consistency audit: the same three-element block was hand-typed ~30
 *  times across every route). One place now owns the type scale:
 *    hero    = h1 on interior pages  (clamp 38px..58px)
 *    section = h2 inside a page      (clamp 32px..50px)
 *    minor   = quieter h2 bands      (clamp 28px..42px)
 *  Spacing and max-widths stay per-call-site via the *ClassName escape
 *  hatches (Tailwind needs literal classes, so no numeric props).
 *  R11 law (website-steps §8.19): new sections use this component; a
 *  hand-rolled heading block is a review flag. */

const TITLE_SIZES = {
  hero: "text-[clamp(38px,4.5vw,58px)]",
  section: "text-[clamp(32px,4vw,50px)]",
  minor: "text-[clamp(28px,3.2vw,42px)]",
} as const;

export function SectionHeading({
  as: Tag = "h2",
  level,
  eyebrow,
  eyebrowColor,
  title,
  lede,
  tone = "ink",
  titleClassName = "mb-3",
  ledeClassName,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  /** Defaults from the tag: h1 → hero, h2/h3 → section. */
  level?: keyof typeof TITLE_SIZES;
  eyebrow?: React.ReactNode;
  eyebrowColor?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  tone?: "ink" | "white";
  /** Margin + max-w for the title (literal Tailwind), default "mb-3". */
  titleClassName?: string;
  /** Margin + max-w for the lede, default "max-w-[58ch]". */
  ledeClassName?: string;
  className?: string;
}) {
  const size = TITLE_SIZES[level ?? (Tag === "h1" ? "hero" : "section")];
  return (
    <div className={className}>
      {eyebrow ? <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cn(
          "font-display font-extrabold leading-[1.08]",
          size,
          tone === "white" ? "text-white" : "text-ink-head",
          titleClassName,
        )}
      >
        {title}
      </Tag>
      {lede ? (
        <p
          className={cn(
            "text-[clamp(18px,1.6vw,21px)]",
            tone === "white" && "text-white/90",
            ledeClassName ?? "max-w-[58ch]",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
