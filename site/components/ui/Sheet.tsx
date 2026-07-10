"use client";

import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

/** Mobile-nav sheet on Radix Dialog (§8.13): focus trap, Esc close, scroll
 *  lock, aria-modal — the a11y the hand-rolled dropdown lacked. Slides in
 *  from the right; brand tokens only. */
export function Sheet({
  open,
  onOpenChange,
  trigger,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  /** sr-only dialog name (required for a11y; never rendered visually) */
  title: string;
  children: React.ReactNode;
}) {
  // the trigger hides at lg, but the portal doesn't: close if the viewport
  // grows past the desktop breakpoint while the sheet is open (QA 2026-07-10)
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && onOpenChange(false);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open, onOpenChange]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        {/* entrance-only animation: exit animations hold Radix Presence open
            until animationend, which proved unreliable here — an instant
            close beats a sheet that never leaves */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink-head/30 data-[state=open]:animate-(--animate-sheet-fade-in)" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-white shadow-[-12px_0_40px_rgba(28,28,28,0.14)] data-[state=open]:animate-(--animate-sheet-in)"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="mr-5 mt-5 grid h-11 w-11 shrink-0 place-items-center self-end rounded-full border border-line text-ink-head"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
