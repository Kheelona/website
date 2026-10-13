"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

/* The WhatsApp bubble's one client part (task 4.7 item 3; D050: it never covers a store form field on a phone). Below
 * 900 px the bubble steps aside while a field of the form's section has focus or the section crosses the bubble's
 * band (the rows of the screen its box covers), as it already rises for the buy bar: the link takes `.is-hidden`, which
 * motion.css turns into a fade and a slide off the right edge, and `inert`, so a link off the screen is never focused.
 * It comes back once the section has passed and no field of it has focus. From 900 px the store's columns sit side by
 * side and the bubble keeps its place. This island never imports Icon or Button: the logo and the label arrive as
 * children, rendered on the server (test/guards/client-icons.test.ts). */

/** From this width the bubble never steps aside (whatsapp-float.css's own cut-off). */
export const LAPTOP_QUERY = "(min-width: 900px)";

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

/** Watches the section through the bubble's band and the focus, and reports whether the bubble steps aside; returns the
 *  disarm. */
function arm(bubble: HTMLElement, region: HTMLElement, report: (aside: boolean) => void): () => void {
  let crossing = false;
  let focused = isFieldIn(region, document.activeElement);
  const publish = () => report(crossing || focused);

  let io: IntersectionObserver | null = null;
  /** (Re)measures the band: on arming and whenever the window resizes (a phone's toolbar, a turned phone). */
  const watch = () => {
    io?.disconnect();
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) crossing = entry.isIntersecting;
        publish();
      },
      { rootMargin: bandMargin(bubble.getBoundingClientRect(), window.innerHeight) },
    );
    io.observe(region);
  };
  // Focus moving between two fields: focusout names the next one, so the bubble stays aside throughout.
  const onFocusIn = (event: FocusEvent) => {
    focused = isFieldIn(region, event.target);
    publish();
  };
  const onFocusOut = (event: FocusEvent) => {
    focused = isFieldIn(region, event.relatedTarget);
    publish();
  };

  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  window.addEventListener("resize", watch);
  watch();
  publish();

  return () => {
    io?.disconnect();
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    window.removeEventListener("resize", watch);
    report(false);
  };
}

export interface StepAsideLinkProps extends ComponentPropsWithoutRef<"a"> {
  /** The id of the section whose form the bubble steps aside from (WhatsAppFloat's `STEP_ASIDE_FROM`). */
  region: string;
}

/**
 * The bubble's link on a page with a form: the server part's link, unchanged until it arms (the same markup in the
 * server HTML), then `.is-hidden` and `inert` while it steps aside. Armed below 900 px only, again whenever the window
 * crosses 900 px; on a page without the section (the store's not-configured state) it does nothing.
 */
export function StepAsideLink({ region, className, children, ...link }: StepAsideLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [aside, setAside] = useState(false);

  useEffect(() => {
    const bubble = ref.current;
    const section = document.getElementById(region);
    if (!bubble || !section) return;
    const laptop = window.matchMedia(LAPTOP_QUERY);
    let disarm: (() => void) | null = null;
    const sync = () => {
      disarm?.();
      disarm = laptop.matches ? null : arm(bubble, section, setAside);
    };
    sync();
    laptop.addEventListener("change", sync);
    return () => {
      laptop.removeEventListener("change", sync);
      disarm?.();
    };
  }, [region]);

  return (
    <a ref={ref} {...link} className={clsx(className, aside && "is-hidden")} inert={aside}>
      {children}
    </a>
  );
}
