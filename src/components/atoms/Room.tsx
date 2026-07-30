import { cn } from "@/lib/cn";
import type { KheeluPose } from "@/lib/kheelu-poses";

export type RoomFill = "white" | "cream" | "cool" | "sun";
export type RoomReveal = "left" | "right" | "pop" | "none";

/* Theme-B sectioning (revamp M1): content lives in contained rounded panels
   on the SiteBackdrop sky, not full-bleed washes. No stop-node numbering, no
   dotted trail (founder brief pointer 1). The orange conversion fill RETIRED
   in V4 (team feedback 2026-07-30): the finale is a white room and the brand
   orange lives on the buttons instead. */
const FILLS: Record<RoomFill, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  sun: "bg-[#fdf1e2]",
};

/** One room panel. `guide` + `say` feed the persistent KheeluGuide via
 *  data attributes (say lines are founder-gated copy); `reveal` opts into a
 *  directional entrance handled by RevealObserver + globals.css. Reveals are
 *  transform/opacity only and must stay on BELOW-FOLD rooms (never the room
 *  that owns the page's LCP). */
export function Room({
  fill = "white",
  id,
  guide,
  say,
  reveal = "none",
  className,
  children,
}: {
  fill?: RoomFill;
  id?: string;
  guide?: KheeluPose;
  say?: string;
  reveal?: RoomReveal;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-guide={guide}
      data-say={say}
      data-reveal={reveal === "none" ? undefined : reveal}
      className={cn(
        "relative rounded-(--radius-room) p-[clamp(30px,4.6vw,60px)] shadow-(--shadow-room)",
        FILLS[fill],
        className,
      )}
    >
      {children}
    </section>
  );
}
