"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";

export default function OurMission() {
  return (
    <section
      id="mission"
      className="relative bg-muted-orange py-10 md:py-16 px-4 overflow-hidden"
      aria-labelledby="mission"
    >
      <SectionHeader id="mission-heading" title="Our Mission" />

      <div className="px-5 md:px-10">
        {/* Card */}
        <div className="mt-5 md:mt-10 relative mx-auto rounded-3xl bg-tangerine max-w-3xl p-8 text-white">
          <p className=" text-[16px] md:text-[18px] font-semibold text-center leading-5 md:leading-6">
            To bridge the gap between &quot;Digital Minds&quot; and &quot;Analog Bodies&quot;. The
            world doesn&apos;t need more screens, it needs more imagination. At Kheelona, our
            mission is to turn every static toy into a living, breathing companion. We fuse embodied
            AI with physical play to create a world where learning isn&apos;t a chore, it&apos;s a
            conversation.
          </p>
        </div>
      </div>
    </section>
  );
}
