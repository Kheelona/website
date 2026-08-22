import { cn } from "@/lib/cn";

export type Wash = "white" | "cream" | "cool" | "sun";

/* "sun" = Sunshine Yellow at the sanctioned 15% alpha, composited (#fdf1e2).
   V3 cleanup: the teal wash retired with the token — its last user was
   /safety's hero, which moved onto the backdrop in M4. V4 (team feedback
   2026-07-30): the orange wash retired with the white finale — no wash
   carries white text any more. */
const WASHES: Record<Wash, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  sun: "bg-sun",
};

/** Full-bleed section with an A-concept wash. Curved joins between washes are
 *  drawn with CurveDivider placed between sections. */
export function Section({
  wash = "white",
  id,
  className,
  children,
}: {
  wash?: Wash;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-wash={wash} className={cn("relative", WASHES[wash], className)}>
      {children}
    </section>
  );
}
