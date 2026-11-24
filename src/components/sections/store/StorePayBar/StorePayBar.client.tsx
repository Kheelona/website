"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { fadeInPlaceMs } from "@/components/chrome/StickyBuyBar/StickyBuyBar.client";
import { isFieldIn, LAPTOP_QUERY } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat.client";

/* The store's pay bar (D070 / C1, K-176; D-top5-changes.md Change 1, items 1, 2 and 9): the form's own pay button, always
 * within reach. It is the DS buy bar (`kh-buybar`, the one the marketing pages carry): fixed to the bottom of the screen
 * below 900 px; from 900 px sticky to the bottom of the screen inside the form's column (a zero-height sticky slot at the
 * end of the details section holds it, so it takes no room and nothing moves when it mounts; it is only ever shown stuck
 * to the bottom, never at rest over the form's last lines). It writes no words of its
 * own: its label, and whether it is busy, are READ from the form's pay button (`MIRROR`, the checkout's own label logic:
 * the mode and the amount the server decided), and a tap submits that same form (`requestSubmit`: the same handler, the
 * same validation, the same request). Where the form is not complete, the first field that needs the parent is scrolled to
 * and focused, and the keyboard opens.
 *
 * Where the bar shows: from the visitor's first scroll (the first screen, what is on screen before they scroll, keeps
 * what it has: nothing sits over it), and never where it would cover the parent's work or be a second Pay button in the
 * same view. It steps aside while
 *   - a form field has focus (the keyboard is up),
 *   - the consent tick, a failure alert, B2's "still open" notice or the form's own pay button is on screen, or about to be
 *     (the viewport is read the bar's height further down, so the bar is gone before it can touch them),
 *   - the store footer is on screen, so it never covers the page's last lines,
 * and it stays away for as long as B2's notice is in the form: the parent is offered Continue paying there, and the bar
 * would start a second order. When a payment the bar started fails, the failure alert is brought into view.
 *
 * What it tells the page: while shown below 900 px it publishes `html[data-buybar="shown"]` and `--ks-buybar-h`, the same
 * two the marketing buy bar publishes, so the WhatsApp bubble rises above it (motion.css, D050 row). It mounts after
 * hydration (no label until it can read one: nothing in the server HTML, and no layout shift: the bar is fixed, or hangs
 * from a slot of no height). No new tracker; a tap on it is an ordinary autocapture click on `.ks-paybar__btn`. This
 * island never imports Icon or Button (test/guards/client-icons.test.ts). */

/** The store's form (StoreDetails: the details section holds it) and its pay button. */
const FORM = "#details form";
const MIRROR = 'button[type="submit"]';
/** The first screen is what is on screen before the visitor scrolls; the bar waits for the first scroll, this far (one
 *  drag of a finger, so a touch that merely brushes the page does not bring it in). */
const FIRST_SCROLL_PX = 40;
/** What the bar keeps clear of, inside the form: the consent row (Checkbox `consent`), every DS alert (the failure line,
 *  B2's notice) and the pay button itself; outside it, the store footer. */
const KEEP_CLEAR_IN_FORM = ".ks-consent, .kh-alert";
const KEEP_CLEAR_OUTSIDE = ".kh-footer";
/** From 900 px the bar hangs from the end of the details section (store-pay-bar.css), below the form's own button and the
 *  lines that follow it (the trust row, the payment line, the help line); it steps aside while those are on screen too,
 *  so at its resting place it never lies over them. */
const KEEP_CLEAR_BELOW_BUTTON = ".ks-pay-beside";
/** B2's notice is the one DS alert that is not role="alert" (PayRecoveryNotice, an info Alert): while it is there the
 *  bar stays away altogether. */
const NOTICE = '.kh-alert[role="status"]';
const FAILURE = '.kh-alert[role="alert"]';
/** A bar tap is remembered this long, so a failure that comes back from the network is shown to the parent who tapped. */
const TAP_MEMORY_MS = 30_000;

/** The label and state read from the form's pay button. */
interface Mirror {
  readonly label: string;
  readonly disabled: boolean;
  readonly loading: boolean;
}
const NOTHING: Mirror = { label: "", disabled: false, loading: false };

function readMirror(button: HTMLButtonElement): Mirror {
  return { label: button.textContent ?? "", disabled: button.disabled, loading: button.classList.contains("kh-btn--loading") };
}
const sameMirror = (a: Mirror, b: Mirror) => a.label === b.label && a.disabled === b.disabled && a.loading === b.loading;

/** Where a smooth scroll is welcome: not with reduced motion. */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/** Runs `step` after the render a submit has caused (a frame on), and once more a moment later if it found nothing. */
function afterRender(step: () => boolean): void {
  requestAnimationFrame(() => {
    if (!step()) window.setTimeout(step, 120);
  });
}

/** Watches the page and reports whether the bar shows and what the form's button says; returns the disarm. */
function arm(bar: HTMLElement, report: { shown: (shown: boolean) => void; mirror: (mirror: Mirror) => void }): () => void {
  const form = document.querySelector<HTMLFormElement>(FORM);
  const pay = form?.querySelector<HTMLButtonElement>(MIRROR);
  if (!form || !pay) return () => {};
  const root = document.documentElement;

  const onScreen = new Set<Element>();
  let past = window.scrollY > FIRST_SCROLL_PX;
  let ready = false;
  let focused = false;
  let shown = false;
  let tapped = false;
  let tappedTimer = 0;
  let failure: Element | null = form.querySelector(FAILURE);
  let io: IntersectionObserver | null = null;
  let fading = 0;

  /** The bar's own state, and what <html> tells the bubble: the same contract as the marketing bar (StickyBuyBar.client). */
  const publish = () => {
    const next = ready && past && onScreen.size === 0 && !focused && form.querySelector(NOTICE) === null;
    if (next !== shown) {
      shown = next;
      report.shown(next);
    }
    // Only the phone's bar lifts the bubble: from 900 px the bar sits in the form's column, away from it.
    const lifted = shown && !window.matchMedia(LAPTOP_QUERY).matches && bar.offsetHeight > 0;
    window.clearTimeout(fading);
    // Stepping down in place (reduced motion: a fade, no slide): the bubble waits for the fade to end, as it does for the marketing bar.
    const fade = !lifted && root.dataset.buybar === "shown" ? fadeInPlaceMs(getComputedStyle(bar)) : 0;
    const tell = (value: "shown" | "hidden") => {
      if (root.dataset.buybar !== value) root.dataset.buybar = value; // a rewrite of the same value would wake the bubble's observer
    };
    if (fade > 0) fading = window.setTimeout(() => tell("hidden"), fade);
    else tell(lifted ? "shown" : "hidden");
    root.style.setProperty("--ks-buybar-h", `${bar.offsetHeight}px`);
  };

  /** Reads what to keep clear of again, and measures the band below the screen the bar will take. */
  const watch = () => {
    io?.disconnect();
    const laptop = window.matchMedia(LAPTOP_QUERY).matches;
    const keep = [
      ...form.querySelectorAll(KEEP_CLEAR_IN_FORM),
      pay,
      ...(laptop ? form.querySelectorAll(KEEP_CLEAR_BELOW_BUTTON) : []),
      ...document.querySelectorAll(KEEP_CLEAR_OUTSIDE),
    ];
    for (const el of onScreen) if (!keep.includes(el)) onScreen.delete(el);
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
        ready = true;
        publish();
      },
      // The screen reaches one bar's height further down, so the bar goes before the consent tick, an alert or the pay button can come under it.
      { rootMargin: `0px 0px ${bar.offsetHeight}px 0px` },
    );
    for (const el of keep) io.observe(el);
  };

  let mirror: Mirror = NOTHING;
  /** The form changed (a label, an alert, an error, the notice): read it again. */
  const sync = () => {
    const next = readMirror(pay);
    if (!sameMirror(mirror, next)) report.mirror((mirror = next));
    const alert = form.querySelector(FAILURE);
    // A payment the bar started failed: the parent is looking at the bar, far from the alert, so the alert comes to them.
    if (tapped && alert && alert !== failure) {
      tapped = false;
      alert.scrollIntoView({ block: "center", behavior: scrollBehavior() });
    }
    failure = alert;
    watch();
  };
  let frame = 0;
  const later = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(sync);
  };
  const mo = new MutationObserver(later);
  mo.observe(form, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["disabled", "class"] });

  // Focus moving between two fields: focusout names the next one, so the bar stays away throughout (as the WhatsApp bubble does).
  const onFocusIn = (event: FocusEvent) => {
    focused = isFieldIn(form, event.target);
    if (focused) tapped = false;
    publish();
  };
  const onFocusOut = (event: FocusEvent) => {
    focused = isFieldIn(form, event.relatedTarget);
    publish();
  };
  const onScroll = () => {
    const next = window.scrollY > FIRST_SCROLL_PX;
    if (next === past) return;
    past = next;
    publish();
  };
  const onResize = () => {
    watch();
    publish();
  };
  const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
  ro?.observe(bar);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  window.addEventListener("resize", onResize);
  window.addEventListener("scroll", onScroll, { passive: true });

  /** A tap on the bar's button (not on the bar's padding around it): the form's own submit. */
  const onTap = (event: MouseEvent) => {
    if (!(event.target instanceof Element) || event.target.closest("button") === null) return;
    if (pay.disabled) return;
    tapped = true;
    window.clearTimeout(tappedTimer);
    tappedTimer = window.setTimeout(() => (tapped = false), TAP_MEMORY_MS);
    if (typeof form.requestSubmit === "function") form.requestSubmit(pay);
    else pay.click();
    // The same validation as the form's button, which shows its errors; the first field that needs the parent gets them.
    afterRender(() => {
      const first = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (!first) return false;
      first.scrollIntoView({ block: "center", behavior: scrollBehavior() });
      first.focus({ preventScroll: true });
      return true;
    });
  };
  bar.addEventListener("click", onTap);

  sync();
  publish();

  return () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(fading);
    window.clearTimeout(tappedTimer);
    io?.disconnect();
    mo.disconnect();
    ro?.disconnect();
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
    bar.removeEventListener("click", onTap);
    delete root.dataset.buybar;
    root.style.removeProperty("--ks-buybar-h");
  };
}

/** `useSyncExternalStore`'s way to read "this is the browser, after hydration": false on the server and while hydrating. */
const noSubscription = () => () => {};

/**
 * The bar: the form's pay button as the DS buy bar, in its slot. Nothing is rendered until the page has hydrated and the
 * form's button can be read (a bar with no label, or one that cannot submit, is never in the HTML); from then it is in
 * the page, hidden and inert, and `arm` shows it.
 */
export function StorePayBar() {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(noSubscription, () => true, () => false);
  const [shown, setShown] = useState(false);
  const [mirror, setMirror] = useState<Mirror>(NOTHING);

  useEffect(() => {
    const bar = ref.current;
    // A browser that cannot tell the width or watch the screen leaves the form's own button as it is.
    if (!mounted || !bar || typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") return;
    const disarm = arm(bar, { shown: setShown, mirror: setMirror });
    return () => {
      disarm();
      setShown(false);
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div className="ks-paybar-slot">
      <div ref={ref} className={clsx("kh-buybar ks-paybar", !shown && "is-hidden")} inert={!shown}>
        <button
          type="button"
          className={clsx("kh-btn kh-btn--cta kh-btn--l kh-btn--block ks-paybar__btn", mirror.loading && "kh-btn--loading")}
          disabled={mirror.disabled}
        >
          <span>{mirror.label}</span>
        </button>
      </div>
    </div>
  );
}
