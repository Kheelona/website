import { cn } from "@/lib/cn";

/** The stack a page's rooms sit in. Redesign 2026-10: full-bleed bands, so
 *  the track only alternates their backgrounds (`.kh-track` in globals.css);
 *  each Room owns its own content column. */
export function RoomsTrack({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("kh-track", className)}>{children}</div>;
}
