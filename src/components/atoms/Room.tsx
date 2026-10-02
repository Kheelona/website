import { cn } from "@/lib/cn";

export type RoomFill = "white" | "cream" | "cool" | "sun";

/* Redesign 2026-10: a room is a full-bleed section again, the mockup's
   `.sec`. Inside a RoomsTrack the background alternates surface / cream by
   position (globals.css `.kh-track`), so a page reads as the mockup's
   alternating bands without each call site choosing. Standalone, `fill`
   still picks the band: white → surface, everything else → cream. */
const FILLS: Record<RoomFill, string> = {
  white: "bg-surface",
  cream: "bg-bg",
  cool: "bg-bg",
  sun: "bg-bg",
};

/** One page band, with the 1180px content column inside it. */
export function Room({
  fill = "white",
  id,
  className,
  children,
}: {
  fill?: RoomFill;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-[52px] min-[900px]:py-[84px]", FILLS[fill])}>
      <div className={cn("kh-wrap", className)}>{children}</div>
    </section>
  );
}
