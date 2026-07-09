import { cn } from "@/lib/cn";

export type Wash = "white" | "cream" | "cool" | "sun" | "teal" | "orange";

/* "sun" = Sunshine Yellow at the sanctioned 15% alpha, composited (#fdf1e2).
   Teal sections use ink text: white on #1ABC9C fails WCAG even at large sizes. */
const WASHES: Record<Wash, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  sun: "bg-[#fdf1e2]",
  teal: "bg-teal text-ink-head",
  orange: "bg-orange text-white",
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
