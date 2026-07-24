import { cn } from "@/lib/cn";
import type { KheeluPose } from "@/lib/kheelu-poses";

export type RoomFill = "white" | "cream" | "cool" | "sun" | "orange";
export type RoomReveal = "left" | "right" | "pop" | "none";

/* Theme-B sectioning (revamp M1): content lives in contained rounded panels
   on the SiteBackdrop sky, not full-bleed washes. The orange room is the
   conversion moment and carries white text, so it fills with the semantic
   action token (today orange-cta #C25210, white 4.66:1) — never raw brand
   orange. No stop-node numbering, no dotted trail (founder brief pointer 1). */
const FILLS: Record<RoomFill, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  sun: "bg-[#fdf1e2]",
  orange: "bg-action text-white",
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
