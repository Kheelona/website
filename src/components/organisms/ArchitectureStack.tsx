"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type ArchLayer = {
  id: string;
  name: string;
  /** One plain-words line, always visible under the name. */
  blurb: string;
  /** The layer's contents, revealed on expand. Labels come from the team's
   *  published architecture diagram — never invent one. */
  chips: readonly string[];
  /** Brand tint for the bar (token classes only). */
  tint: string;
};

/** The PlayOS architecture, as a stack you can open (V4 D6, team feedback
 *  2026-07-30: "create this image with micro interaction... show details, or
 *  grow big"). The team's iceberg diagram, rebuilt as brand UI: two layers
 *  float above the waterline (what families see), four sit below it (what
 *  Kheelona builds underneath).
 *
 *  Composed on the same vendored Radix accordion as Faq, so keyboard
 *  behaviour, aria-expanded, and the height animation are the house ones.
 *  Tap or click opens a layer (one at a time, first open at rest — the Faq
 *  precedent); on fine pointers a closed bar lifts on hover but never opens,
 *  so mobile and desktop share one mental model. Layer names and blurbs are
 *  always visible; only the chip detail expands. */
export function ArchitectureStack({
  above,
  below,
  className,
}: {
  above: readonly ArchLayer[];
  below: readonly ArchLayer[];
  className?: string;
}) {
  const renderLayer = (layer: ArchLayer) => (
    <Accordion.Item
      key={layer.id}
      value={layer.id}
      className={cn(
        "overflow-hidden rounded-(--radius-card) border border-line-soft transition-transform duration-150 ease-(--ease-calm) md:data-[state=closed]:hover:-translate-y-0.5",
        layer.tint,
      )}
    >
      <Accordion.Header asChild>
        <h3>
          <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset sm:px-6">
            <span>
              <span className="block font-display text-[19px] font-extrabold text-ink-head">
                {layer.name}
              </span>
              <span className="mt-0.5 block text-[14.5px] leading-snug text-ink">
                {layer.blurb}
              </span>
            </span>
            <Plus
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-ink-head transition-transform duration-200 group-data-[state=open]:rotate-45"
            />
          </Accordion.Trigger>
        </h3>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-(--animate-accordion-up) data-[state=open]:animate-(--animate-accordion-down)">
        <ul className="flex flex-wrap gap-2 px-5 pb-5 pt-1 sm:px-6">
          {layer.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-line-soft bg-white px-3.5 py-1.5 text-[14px] font-medium text-ink-head"
            >
              {chip}
            </li>
          ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  );

  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={above[0]?.id}
      className={cn("mx-auto flex max-w-[860px] flex-col gap-2.5", className)}
    >
      {above.map(renderLayer)}

      {/* the waterline: meaningful copy, not decoration. Below sm the two
          labels STACK with the line between them — side by side they are
          wider than a 320px viewport, and two no-shrink labels in a flex row
          force the layout viewport wide (the M4-b failure class, caught by
          the V4 overflow probe at 320/390). */}
      <div className="flex flex-col gap-1.5 px-1 py-1.5 sm:flex-row sm:items-center sm:gap-3">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-blue-ink sm:shrink-0">
          What families see
        </p>
        <span
          aria-hidden="true"
          className="h-[2px] w-full rounded-full bg-gradient-to-r from-blue/50 via-blue/20 to-blue/50 sm:w-auto sm:min-w-6 sm:flex-1"
        />
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-ink-muted sm:shrink-0">
          What we build underneath
        </p>
      </div>

      {below.map(renderLayer)}
    </Accordion.Root>
  );
}
