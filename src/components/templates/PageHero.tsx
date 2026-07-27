import { cn } from "@/lib/cn";
import { Reveal } from "@/components/molecules/Reveal";
import type { KheeluPose } from "@/lib/kheelu-poses";

/** Interior-page hero — copy left, media right — extracted in R11 (the same
 *  grid was hand-typed on 8 routes, only the column ratio differing).
 *
 *  Revamp M4 (theme B): the hero now owns its own <section> and sits DIRECTLY
 *  on the SiteBackdrop sky, no wash and no CurveDivider, so every route opens
 *  inside the world and the rooms begin below it. The shell matches RoomsTrack
 *  (1180px, same gutters) so hero copy and room copy share one left edge.
 *  `guide` + `say` feed the persistent KheeluGuide, exactly like Room.
 *
 *  LCP law: `Reveal mode="rise"` never touches opacity, so the hero's media
 *  (the largest element, and the mobile LCP candidate) is painted at once.
 *
 *  R11 law (§8.19): new interior heroes use this component. */
export function PageHero({
  ratio = "md:grid-cols-[1.1fr_0.9fr]",
  guide,
  say,
  media,
  mediaClassName = "flex justify-center",
  className,
  children,
}: {
  /** Literal Tailwind grid template for the two columns. */
  ratio?: string;
  /** Kheelu's pose while this hero is on screen. */
  guide?: KheeluPose;
  /** Kheelu's line for this hero (GATED:kheelu-line until founder sign-off). */
  say?: string;
  media?: React.ReactNode;
  mediaClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-guide={guide}
      data-say={say}
      className="relative overflow-x-clip"
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-10 md:py-14",
          media && ratio,
          className,
        )}
      >
        <Reveal mode="rise">{children}</Reveal>
        {media ? (
          <Reveal mode="rise" className={mediaClassName}>
            {media}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
