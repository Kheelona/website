"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";

export default function WhyJoinUs() {
  return (
    <section className="pt-10 md:pt-20 md:px-50 px-10 text-[18px] leading-5">
      <SectionHeader title="WHY JOIN US?" />

      <p>Expert Advice Without the Price Tag</p>
      <p className="mb-6">Why are we free?</p>

      <p className="mb-6 font-bold">
        Because we believe every parent deserves access to quality information.
      </p>

      <ul className="space-y-4">
        <li className="flex gap-3">
          <span>●</span>
          <span>
            <strong>Global Perspectives:</strong> Learn from parents across all geographies and
            cultures.
          </span>
        </li>

        <li className="flex gap-3">
          <span>●</span>
          <span>
            <strong>Zero Cost:</strong> All sessions, downloads, and groups are free.
          </span>
        </li>

        <li className="flex gap-3">
          <span>●</span>
          <span>
            <strong>Easy Learning:</strong> No complex jargon. Just simple, actionable steps you can
            use today.
          </span>
        </li>
      </ul>
    </section>
  );
}
