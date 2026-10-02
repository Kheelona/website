import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "green" | "onDark" | "ghostOnAccent";

/* Redesign 2026-10 (the mockup's `.btn`): pill buttons, 52px tall (44px for
   `sm`), a calm press-scale and no hover lift.

   - primary: ink fill, cream label. 14.9:1 in light; the two tokens swap in
     dark, so the label stays the page colour on a light ink fill (13.6:1).
   - ghost: outlined ink on whatever band it sits on.
   - green: the WhatsApp action (mockup `.btn-green`).
   - onDark / ghostOnAccent: for the accent finale, whose colours are fixed
     in both themes.

   This supersedes §8.29's white-on-orange fill; the orange is gone from the
   palette, and test/action-label.test.ts pins the new pairing. */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-action text-bg",
  ghost: "border border-ink-head bg-transparent text-ink-head",
  green: "bg-green text-on-green",
  onDark: "bg-[#1e2340] text-[#fbf6ee]",
  ghostOnAccent: "border border-[#1e2340] bg-transparent text-[#1e2340]",
};

const SIZES = {
  sm: "min-h-11 px-4 text-[14px]",
  md: "min-h-[52px] px-6 text-[17px]",
  lg: "min-h-14 px-8 text-[18px]",
} as const;

/** Brand pill button. Renders a Link so every CTA is crawlable. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  track,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: keyof typeof SIZES;
  className?: string;
  /** Which CTA this is, for PostHog (§8.40, 2026-09-20). OPT-IN, and only for
   *  the buttons that mean money.
   *
   *  Every pre-order CTA carries the same label and the same href by law
   *  (§8.25-b: one verb, one destination), which is right for a parent and
   *  useless for analytics — autocapture saw identical clicks and could not
   *  say which one anybody tapped.
   *
   *  `data-ph-capture-attribute-cta` rather than a plain `data-` attribute
   *  because posthog-js promotes it to a TOP-LEVEL event property, so a funnel
   *  can be broken down by it; an ordinary attribute only reaches the nested
   *  `$elements` array as `attr__…`. Read out of the installed SDK.
   *
   *  It is never rendered and never announced: it changes no label and no
   *  accessible name, which Button.test.tsx pins. */
  track?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-ph-capture-attribute-cta={track}
      className={cn(
        "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold leading-tight",
        // below sm a long label wraps rather than widening the layout viewport
        "max-sm:whitespace-normal max-sm:text-center",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
