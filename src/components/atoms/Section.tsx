import { cn } from "@/lib/cn";

export type Wash = "white" | "cream" | "cool" | "sun" | "orange";

/* "sun" = Sunshine Yellow at the sanctioned 15% alpha, composited (#fdf1e2).
   R5 (founder 2026-07-10): colored bands carry high-contrast WHITE text, so
   the fills deepen to the lightest brand-family values where white passes
   4.5:1 at ANY text size: orange-cta #C25210 (4.66:1). Raw #EF762F stays
   decorative-only. V3 cleanup: the teal wash retired with the token — its last
   user was /safety's hero, which moved onto the backdrop in M4. */
const WASHES: Record<Wash, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  sun: "bg-[#fdf1e2]",
  orange: "bg-orange-cta text-white",
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
