"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ParentingHelpSection() {
  return (
    <section className="w-full overflow-hidden -mt-20">
      {/* Top Illustration */}
      <div className="relative w-full h-50 md:h-115">
        <Image
          src="/images/growth.webp"
          alt="Happy parents illustration"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      <div className="bg-muted-orange">
        {/* Section Heading Overlay */}
        <div className="pt-10 md:p-10 ">
          <SectionHeader
            subtitle="Tracking growth"
            title="How it helps in parenting?"
            className="md:w-full w-[50vw] mx-auto "
          />
        </div>

        {/* Content */}
        <div className="px-5 md:px-30  w-full flex md:flex-row flex-col-reverse gap-0 md:gap-20 items-center md:items-end justify-center pt-0">
          {/* Left Phone Mock */}
          <div className="relative h-59.1 w-70 md:w-156.75 md:h-106.5flex items-end">
            <Image
              src="/images/iphone.png"
              alt="App notification mock"
              width={426}
              height={627}
              priority
              className="object-contain w-full"
            />
          </div>

          {/* Right Cards */}
          <div className="grid grid-cols-22 gap-2 md:gap-5 w-full md:w-150 text-[13px] md:text-[18px] mb-5">
            {/* Hi Parent */}
            <div className="col-span-7 bg-white rounded-3xl border-4 border-tangerine p-2 md:p-4 font-semibold leading-3.5 md:leading-7">
              Hi, <br />
              <span className="font-bold">Parent</span>
            </div>

            {/* Line Graph */}
            <div className="col-span-15 bg-white rounded-3xl border-4 border-tangerine p-2 md:p-4">
              <p className="font-semibold text-center mb-0">New learnt words</p>
              <Image
                src="/images/graph.png"
                alt="tracking graph"
                width={226}
                height={121}
                className="h-15 md:h-20 w-30 mx-auto object-cover"
              />
            </div>

            {/* Read Hindi */}
            <div className="col-span-8 bg-white rounded-3xl border-4 border-tangerine p-2 md:p-4 leading-3.5 md:leading-5">
              Please read one Page of Hindi book with your kid.
            </div>

            {/* Bar Chart */}
            <div className="col-span-6 bg-white rounded-3xl border-4 border-tangerine p-2 md:p-4 flex justify-center">
              <Image
                src="/images/chart.png"
                alt="chart"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>

            {/* Bullying Alert */}
            <div className="col-span-8 bg-white rounded-3xl border-4 border-tangerine p-4 leading-3.5 md:leading-5">
              He is being bullied by a kid of his class.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
