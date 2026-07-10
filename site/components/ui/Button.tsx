import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark";

/* Dark label on orange passes WCAG AA (~5.8:1); white-on-orange does not.
   Accessibility target (90+) outranks the concept's white-label look. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-orange text-ink-head border-2 border-white shadow-cta hover:bg-yellow",
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  onDark: "bg-white text-ink-head border-2 border-white shadow-cta hover:bg-cream",
};

/** Brand pill button (design system: pill radius, white keyline, single shadow,
 *  bouncy press). Renders a Link so every CTA is crawlable. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // nowrap: a pill label that wraps to two lines crowds whatever sits
        // beside it (seen with the navbar CTA in the 640-1023px band)
        "inline-flex items-center justify-center whitespace-nowrap rounded-full leading-none",
        "transition-[transform,background-color] duration-150 ease-(--ease-bounce) active:scale-[0.96]",
        size === "md" ? "px-7 py-4 text-[17px] font-bold" : "px-9 py-5 text-lg font-bold",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
