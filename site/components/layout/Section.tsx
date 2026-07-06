import { cn } from "@/lib/cn";

export type Wash = "white" | "cream" | "cool" | "teal" | "orange";

const WASHES: Record<Wash, string> = {
  white: "bg-white",
  cream: "bg-cream",
  cool: "bg-cool",
  teal: "bg-teal text-white",
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
    <section id={id} className={cn("relative", WASHES[wash], className)}>
      {children}
    </section>
  );
}
