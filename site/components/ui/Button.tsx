import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark";

/* R5 (founder 2026-07-10): button labels are WHITE. The fill is orange-cta
   #C25210, the lightest brand orange where white passes 4.5:1 at any size --
   both directives (white labels + a11y 100) hold at once. Hover lifts with
   shadow/transform instead of a lighter fill so contrast never dips. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-orange-cta text-white border-2 border-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  onDark:
    "bg-footer-cocoa text-white border-2 border-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
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
        "transition-[transform,box-shadow,background-color] duration-150 ease-(--ease-bounce) active:scale-[0.96]",
        size === "md" ? "px-7 py-4 text-[17px] font-bold" : "px-9 py-5 text-lg font-bold",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
