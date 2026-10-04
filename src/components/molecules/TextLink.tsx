import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRESS_TINT } from "@/lib/interactions";

/** The quiet secondary action (founder, 2026-10-04): ink text, a brand-orange
 *  arrow, an orange underline on hover.
 *
 *  WHY IT EXISTS. The site had one secondary style, the black-outline pill,
 *  and it was used eleven times; with the solid orange Reserve button beside
 *  it, every room carried two heavy buttons and the page read as "managed".
 *  The hierarchy is now: the orange fill is the ONE action that means money,
 *  a thin orange outline (Button's ghost) is kept for the few secondary
 *  actions that need a button shape, and everything else ("read more",
 *  "see how", "our story") is this link.
 *
 *  ONE ORANGE (founder, 2026-10-04): the text is ink, never orange, because
 *  brand orange as small text is 2.88:1 and fails AA. The orange lives in the
 *  arrow and the underline, where it is decoration. */
export function TextLink({
  href,
  external = false,
  className,
  children,
}: {
  href: string;
  /** Opens in a new tab with rel=noopener (WhatsApp, sources). */
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(
    "group inline-flex items-center gap-1.5 rounded font-bold text-ink-head underline decoration-orange decoration-2 underline-offset-[6px] hover:decoration-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
    PRESS_TINT,
    className,
  );
  const body = (
    <>
      {children}
      <ArrowRight
        className="h-4 w-4 shrink-0 text-orange transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {body}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}
