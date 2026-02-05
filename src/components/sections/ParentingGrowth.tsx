"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ParentingHelpSection() {
  return (
    <section className="w-full overflow-hidden -mt-20">
      {/* Top Illustration */}
      <div className="relative w-full h-70 md:h-90">
        <Image
          src="/images/growth.webp"
          alt="Happy parents illustration"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Section Heading Overlay */}
      <div className="bg-muted-orange p-10">
        <SectionHeader subtitle="Tracking growth" title="How it helps in parenting?" />
      </div>

      {/* Content */}
      <div className="px-5 w-full flex md:flex-row flex-col-reverse gap-12 items-center md:items-end bg-muted-orange justify-center">
        {/* Left Phone Mock */}
        <div className="relative h-full">
          <Image
            src="/images/iphone.png"
            alt="App notification mock"
            width={420}
            height={820}
            className="object-contain"
            priority
          />
        </div>

        {/* Right Cards */}
        <div className="grid grid-cols-6 gap-2 md:gap-5 w-full md:w-150  text-[13px] md:text-[24px] mb-5">
          {/* Hi Parent */}
          <div className="col-span-2 bg-white rounded-3xl border-4 border-tangerine p-4 font-semibold">
            Hi, <br />
            <span className="font-bold">Parent</span>
          </div>

          {/* Line Graph */}
          <div className="col-span-4 bg-white rounded-3xl border-4 border-tangerine p-4">
            <p className="font-semibold mb-2 text-center">New learnt words</p>
            <Image
              src="/images/graph.png"
              alt="tracking graph"
              width={360}
              height={180}
              className="w-55 h-auto mx-auto object-contain"
            />
          </div>

          {/* Read Hindi */}
          <div className="col-span-2 bg-white rounded-3xl border-4 border-tangerine p-4">
            Please read one Page of Hindi book with your kid.
          </div>

          {/* Bar Chart */}
          <div className="col-span-2 bg-white rounded-3xl border-4 border-tangerine p-4 flex justify-center">
            <Image
              src="/images/chart.png"
              alt="chart"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Bullying Alert */}
          <div className="col-span-2 bg-white rounded-3xl border-4 border-tangerine p-4">
            He is being bullied by a kid of his class.
          </div>
        </div>
      </div>
    </section>
  );
}
