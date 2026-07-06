import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark" | "teal";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-orange text-white border-2 border-white shadow-cta hover:bg-orange-deep",
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  onDark: "bg-white text-orange-deep border-2 border-white shadow-cta hover:bg-cream",
  teal: "bg-white text-teal border-2 border-white shadow-cta hover:bg-cream",
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
        "inline-flex items-center justify-center rounded-full font-semibold leading-none",
        "transition-[transform,background-color] duration-150 ease-(--ease-bounce) active:scale-[0.96]",
        size === "md" ? "px-7 py-4 text-[17px]" : "px-9 py-5 text-lg",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
