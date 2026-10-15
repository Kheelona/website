"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { usePagePath } from "@/lib/page-path";

/* The WhatsApp bubble's one client part (D050: it never covers a price or a form field). Below 900 px the bubble steps
 * aside while what its context names (WhatsAppFloat's STEP_ASIDE_FROM: the site's prices, task 4.9; the store's form,
 * task 4.7; the paid /thanks address step, task 4.9) crosses the bubble's band (the rows of the screen its box covers)
 * or a field of it has focus, as it already rises for the buy bar: the link takes `.is-hidden`, which motion.css turns
 * into a fade and a slide off the right edge, and `inert`, so a link off the screen is never focused. It comes back
 * once nothing it keeps clear is in its band and no field of it has focus. The band follows the bubble: re-measured
 * when the window resizes, when the bar lifts or drops it (html[data-buybar]) and when its own move ends. From 900 px
 * it keeps its place. This island never imports Icon or Button: the logo and the label arrive as children, rendered on
 * the server (test/guards/client-icons.test.ts). */

/** From this width the bubble never steps aside (whatsapp-float.css's own cut-off). */
export const LAPTOP_QUERY = "(min-width: 900px)";

/**
 * Where the bubble waits for the buy bar (D066 item 1, task Q2.17: "after the hero"), exactly as whatsapp-float.css words
 * its rule: on a phone, with scripting (no script, no bar: the bubble shows as before), on a page that carries the bar
 * and whose hero's Pre-order button is `#hero-cta` (Home; /contact's `#hero-cta` is its ways-to-reach group), until the
 * bar has first shown on the page (`html[data-buybar-seen]`, StickyBuyBar). The CSS hides it from first paint; this link
 * is inert while it waits, so it is never focused while hidden.
 */
export const WAIT_FOR_BAR = {
  media: "(max-width: 899px) and (scripting: enabled)",
  page: "html:not([data-buybar-seen]):has(.kh-buybar):has(#hero-cta.kh-btn--cta)",
} as const;

/** True while the bubble waits for the bar: the query matches and the page reads so. A browser that cannot read the
 *  selector (no `:has()`) drops the CSS rule too, so the bubble neither hides nor turns inert there. */
export function waitsForBar(root: Element, media: Pick<MediaQueryList, "matches">): boolean {
  try {
    return media.matches && root.matches(WAIT_FOR_BAR.page);
  } catch {
    return false;
  }
}

/** A form field: what a parent types into or picks from. The pay button is not one, nor a hidden input. */
const FIELDS = "input:not([type=hidden]), select, textarea";

/** True when `target` is a form field inside `region`. */
export function isFieldIn(region: Element, target: EventTarget | null): boolean {
  return target instanceof Element && region.contains(target) && target.matches(FIELDS);
}

/** The IntersectionObserver root margin that narrows the viewport to the bubble's band, the rows its box covers (the
 *  whole pixels around it, so the band holds the box). */
export function bandMargin(bubble: Pick<DOMRect, "top" | "bottom">, viewportHeight: number): string {
  return `${-Math.floor(bubble.top)}px 0px ${-Math.floor(viewportHeight - bubble.bottom)}px 0px`;
}

/** Watches what `from` selects through the bubble's band, and the focus, and reports whether the bubble steps aside;
 *  returns the disarm. */
function arm(bubble: HTMLElement, from: string, report: (aside: boolean) => void): () => void {
  let regions: Element[] = [];
  const crossing = new Set<Element>();
  const isField = (target: EventTarget | null) => regions.some((region) => isFieldIn(region, target));
  let focused = false;
  const publish = () => report(crossing.size > 0 || focused);

  let io: IntersectionObserver | null = null;
  /** Reads the regions again and (re)measures the band from the bubble's box where it now sits (lifted or not). What
   *  left the page is forgotten; what is still there keeps its state until the new observer's first report. */
  const watch = () => {
    io?.disconnect();
    regions = Array.from(document.querySelectorAll(from));
    for (const region of crossing) if (!regions.includes(region)) crossing.delete(region);
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target);
          else crossing.delete(entry.target);
        }
        publish();
      },
      { rootMargin: bandMargin(bubble.getBoundingClientRect(), window.innerHeight) },
    );
    for (const region of regions) io.observe(region);
  };
  // Focus moving between two fields: focusout names the next one, so the bubble stays aside throughout.
  const onFocusIn = (event: FocusEvent) => {
    focused = isField(event.target);
    publish();
  };
  const onFocusOut = (event: FocusEvent) => {
    focused = isField(event.relatedTarget);
    publish();
  };
  // The bubble's own move (the lift, the drop) has ended: its transitionend. Its label's bubble up too and are not its.
  const onMoved = (event: TransitionEvent) => {
    if (event.target === bubble && event.propertyName === "transform") watch();
  };
  // The bar shows, steps aside or hides: the bubble rises or drops (at once with reduced motion; otherwise onMoved).
  const lift = new MutationObserver(watch);

  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  window.addEventListener("resize", watch);
  bubble.addEventListener("transitionend", onMoved);
  lift.observe(document.documentElement, { attributeFilter: ["data-buybar"] });
  watch();
  focused = isField(document.activeElement);
  publish();

  return () => {
    io?.disconnect();
    lift.disconnect();
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    window.removeEventListener("resize", watch);
    bubble.removeEventListener("transitionend", onMoved);
    report(false);
  };
}

export interface StepAsideLinkProps extends ComponentPropsWithoutRef<"a"> {
  /** What the bubble keeps clear: a selector (WhatsAppFloat's `STEP_ASIDE_FROM` for its context). */
  from: string;
}

/**
 * The bubble's link: the server part's link, unchanged until it arms (the same markup in the server HTML), then
 * `.is-hidden` and `inert` while it steps aside. Armed below 900 px only, again whenever the window crosses 900 px, and
 * on every page change (the site's bubble sits in a layout, so it outlives a page; lessons §2); on a page with nothing
 * to keep clear (the store's not-configured state, a page with no price) it does nothing.
 *
 * What it keeps clear must be in the page's server HTML: it arms only if `from` matches when it mounts, and it reads the
 * regions again only when it re-measures (arming, a resize, html[data-buybar], the end of its own move), so a price or
 * a form that mounts later, after hydration, would go unwatched until then. Today every region is server-rendered (the
 * price sentences, the offer card, the store's #details, the /thanks #address); a region that mounts on the client
 * needs this link to watch for it first.
 */
export function StepAsideLink({ from, className, children, ...link }: StepAsideLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [aside, setAside] = useState(false);
  const [waiting, setWaiting] = useState(false);
  // The page (usePagePath: Vercel's "/index" for Home is "/", task 8c.7): a page change re-arms it.
  const pathname = usePagePath();

  /* D066 item 1: inert while it waits for the bar (WAIT_FOR_BAR), read again when the bar marks its first show
     (html[data-buybar-seen]), when the window crosses the query's width and on every page change. */
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const root = document.documentElement;
    const media = window.matchMedia(WAIT_FOR_BAR.media);
    const read = () => setWaiting(waitsForBar(root, media));
    const marks = new MutationObserver(read);
    marks.observe(root, { attributeFilter: ["data-buybar-seen"] });
    media.addEventListener("change", read);
    read();
    return () => {
      marks.disconnect();
      media.removeEventListener("change", read);
      setWaiting(false);
    };
  }, [pathname]);

  useEffect(() => {
    const bubble = ref.current;
    // A browser that cannot tell the width or watch the band keeps the bubble in its place, as without JavaScript.
    if (!bubble || typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") return;
    if (!document.querySelector(from)) return;
    const laptop = window.matchMedia(LAPTOP_QUERY);
    let disarm: (() => void) | null = null;
    const sync = () => {
      disarm?.();
      disarm = laptop.matches ? null : arm(bubble, from, setAside);
    };
    sync();
    laptop.addEventListener("change", sync);
    return () => {
      laptop.removeEventListener("change", sync);
      disarm?.();
    };
  }, [from, pathname]);

  return (
    <a ref={ref} {...link} className={clsx(className, aside && "is-hidden")} inert={aside || waiting}>
      {children}
    </a>
  );
}
