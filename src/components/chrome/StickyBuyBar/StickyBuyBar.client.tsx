"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePagePath } from "@/lib/page-path";

/* The phone buy bar's behaviour (task 3.1), ported from mockup/mockup.js §2 (CMO M2; DS gap G-09; strategy §3.4):
 *   - hidden while the hero CTA (#hero-cta) is on screen, so a page that opens with one shows the bar only once it
 *     has left; a page without one shows it from the start (the product page, the articles);
 *   - stepping aside while any inline chilli button in <main> is on screen (the offer card's included), so a phone
 *     view never shows two at once;
 *   - inert while hidden: the DS hidden state is only opacity and pointer-events (motion.css), so its button would
 *     otherwise stay in the tab order (architecture §5.3);
 *   - its state on <html> as data-buybar ("shown", "aside" or "hidden") and its height as --ks-buybar-h, read by the
 *     WhatsApp bubble, which rises above it while it shows (motion.css, D050 row); and data-buybar-seen from its first
 *     "shown" on the page until it leaves the page, read by the bubble, which on a phone waits for the bar where the
 *     bar waits for the hero's button (Home), then stays (D066 item 1, task Q2.17; whatsapp-float.css).
 * The slide up and the fade are motion.css's (D049 pick 4). This island never imports Icon or Button: the bar's
 * contents arrive as children, rendered on the server (test/guards/client-icons.test.ts). */

export type BuyBarState = "shown" | "aside" | "hidden";

/** The id the hero's CTA (or, on /contact, its ways-to-reach group) carries, as in the approved mockups. */
const HERO_ID = "hero-cta";
/** The inline chilli buttons the bar steps aside for: those of the page itself, never the nav's, drawer's or its own. */
const INLINE_CTAS = "main .kh-btn--cta";
const HEIGHT_VAR = "--ks-buybar-h";

/** What the bar does for what is on screen. Until the first report it cannot know, so it stays hidden. */
export function buyBarState(s: { ready: boolean; heroOnScreen: boolean; inlineOnScreen: number }): BuyBarState {
  if (!s.ready || s.heroOnScreen) return "hidden";
  return s.inlineOnScreen > 0 ? "aside" : "shown";
}

/** A CSS time ("0.2s", "200ms") in milliseconds; 0 for anything else. */
function ms(time: string): number {
  const m = /^(-?[\d.]+)(m?s)$/.exec(time.trim());
  return m ? Number(m[1]) * (m[2] === "s" ? 1000 : 1) : 0;
}

/**
 * How long the bar's fade takes when it fades out in place, in milliseconds, or 0 when it does not: no fade, or a fade
 * that comes with a slide (motion.css, pick 4: with motion on the bar slides down as it fades, and the bubble drops over
 * the same --duration-base, so the two move together; with reduced motion it only fades, in place). Read from the bar's
 * computed transition, so it follows motion.css and the visitor's motion setting.
 */
export function fadeInPlaceMs(style: Pick<CSSStyleDeclaration, "transitionProperty" | "transitionDuration" | "transitionDelay">): number {
  const props = style.transitionProperty.split(",").map((p) => p.trim()).filter(Boolean);
  if (props.some((p) => p === "transform" || p === "all" || p === "translate")) return 0;
  const i = props.indexOf("opacity");
  if (i < 0) return 0;
  // A shorter duration or delay list repeats (CSS Transitions §2).
  const at = (list: string) => {
    const items = list.split(",");
    return ms(items[i % items.length] ?? "");
  };
  return Math.max(0, at(style.transitionDuration) + at(style.transitionDelay));
}

/** Watches the hero and the inline buttons and reports the bar's state; returns the disarm. */
function arm(bar: HTMLElement, setState: (state: BuyBarState) => void): () => void {
  const root = document.documentElement;
  const watched = new Set<Element>();
  const onScreen = new Set<Element>();
  let hero: Element | null = null;
  let heroOnScreen = false;
  let ready = false;
  let height = bar.offsetHeight;

  /* What <html> tells the bubble. The bar itself hides at once (its state, is-hidden and inert), but when it steps down
     from "shown" and fades out in place (reduced motion), <html> keeps saying "shown" until the fade has ended: the
     bubble, which rises above the bar while it shows, would otherwise drop at once onto the still-visible button (task
     7.1a; CMO built-page review B, m5; D050: it never covers the bar). The fade's end is the bar's own transitionend for
     opacity, or twice its time should that never come; the bar showing again ends the wait. */
  let fading: { next: BuyBarState; stop: () => void } | null = null;
  const endFade = () => {
    fading?.stop();
    fading = null;
  };
  const tell = (next: BuyBarState) => {
    if (fading && next !== "shown") {
      fading.next = next;
      return;
    }
    endFade();
    const fade = next !== "shown" && root.dataset.buybar === "shown" ? fadeInPlaceMs(getComputedStyle(bar)) : 0;
    if (fade <= 0) {
      root.dataset.buybar = next;
      /* The bar has shown on this page (D066 item 1, task Q2.17): the bubble, which waits for it on a phone where it
         waits for the hero's button, shows from now on, even when the bar hides again (whatsapp-float.css). */
      if (next === "shown") root.dataset.buybarSeen = "";
      return;
    }
    const done = () => {
      const latest = fading?.next ?? next;
      endFade();
      root.dataset.buybar = latest;
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === bar && event.propertyName === "opacity") done();
    };
    const timer = window.setTimeout(done, fade * 2);
    bar.addEventListener("transitionend", onEnd);
    fading = {
      next,
      stop: () => {
        window.clearTimeout(timer);
        bar.removeEventListener("transitionend", onEnd);
      },
    };
  };

  const publish = () => {
    const state = buyBarState({ ready, heroOnScreen, inlineOnScreen: onScreen.size });
    setState(state);
    // A bar that takes no room (display: none from 900 px) never lifts the bubble.
    tell(height > 0 ? state : "hidden");
    root.style.setProperty(HEIGHT_VAR, `${height}px`);
  };

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === hero) heroOnScreen = entry.isIntersecting;
      else if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    }
    ready = true;
    publish();
  });

  /** Brings the watched set in line with the page: new buttons are watched, removed ones forgotten. */
  const sync = () => {
    const nextHero = document.getElementById(HERO_ID);
    const targets = new Set<Element>(document.querySelectorAll(INLINE_CTAS));
    if (nextHero) targets.add(nextHero);
    for (const el of watched) {
      if (targets.has(el)) continue;
      io.unobserve(el);
      watched.delete(el);
      onScreen.delete(el);
    }
    if (hero !== nextHero) heroOnScreen = nextHero !== null; // a new hero counts as on screen until reported
    hero = nextHero;
    for (const el of targets) {
      if (watched.has(el)) continue;
      watched.add(el);
      io.observe(el);
    }
    // Nothing to wait for (no hero, no inline button): the bar shows from first paint.
    if (watched.size === 0) ready = true;
    publish();
  };

  let frame = 0;
  const later = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sync);
  };
  const main = document.querySelector("main");
  const mo = new MutationObserver(later);
  if (main) mo.observe(main, { childList: true, subtree: true });

  const ro =
    typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => {
          if (bar.offsetHeight === height) return;
          height = bar.offsetHeight;
          publish();
        });
  ro?.observe(bar);

  sync();

  return () => {
    cancelAnimationFrame(frame);
    endFade();
    io.disconnect();
    mo.disconnect();
    ro?.disconnect();
    delete root.dataset.buybar;
    delete root.dataset.buybarSeen;
    root.style.removeProperty(HEIGHT_VAR);
  };
}

export interface BuyBarControllerProps {
  /** The bar's region name ("Pre-order Kheelu", as the mockup names it). */
  label: string;
  /** The marketing paths that carry the bar (SiteShell decides them from content). */
  paths: readonly string[];
  /** The price lines and the chilli button, rendered by the server part. */
  children: ReactNode;
}

/**
 * The bar's element and behaviour. It renders on the pages in `paths` only: the shell is a layout, so the page is read
 * from the path (usePagePath: usePathname() with Vercel's "/index" for Home folded to "/", task 8c.7), which a static
 * prerender and a Vercel runtime render know too, so the bar is in the server HTML exactly where it belongs (hidden, as
 * the mockup ships it). Re-armed on every page change (lessons §2).
 */
export function BuyBarController({ label, paths, children }: BuyBarControllerProps) {
  const pathname = usePagePath();
  const present = paths.includes(pathname);
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<BuyBarState>("hidden");

  useEffect(() => {
    const bar = ref.current;
    if (!present || !bar) return;
    const disarm = arm(bar, setState);
    return () => {
      disarm();
      setState("hidden");
    };
  }, [present, pathname]);

  if (!present) return null;
  const hidden = state !== "shown";
  return (
    <div ref={ref} className={clsx("kh-buybar", hidden && "is-hidden")} role="region" aria-label={label} inert={hidden}>
      {children}
    </div>
  );
}
