"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { PRESS_TINT } from "@/lib/interactions";

export type FaqEntry = { q: string; a: string };

/** FAQ accordion on Radix (§8.13): arrow-key/Home/End roving focus, proper
 *  region semantics, animated height via --radix-accordion-content-height
 *  (keyframes in globals.css). Restyled with brand tokens only. */
export function Faq({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={items[0]?.q}
      className="divide-y divide-line-soft rounded-(--radius-card) bg-white"
    >
      {items.map((item) => (
        <Accordion.Item key={item.q} value={item.q}>
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-display text-[20px] font-bold text-ink-head transition-colors hover:text-orange-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset ${PRESS_TINT}`}>
                {item.q}
                <Plus
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45"
                />
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-(--animate-accordion-up) data-[state=open]:animate-(--animate-accordion-down)">
            <p className="px-6 pb-6 text-[16.5px] text-ink">{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
