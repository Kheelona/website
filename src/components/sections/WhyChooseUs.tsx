"use client";

import { TickIcon } from "@/assets/icons/MemoTickIcon";
import { XCircle } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-muted-orange py-10 px-5 md:px-0">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-white text-sm text-[18px] md:text-[30px]  mb-5">Lumi vs Others</p>

        <h2 className="font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center mb-5">
          WHY SETTLE FOR LESS? <br /> UPGRADE TO LUMI
        </h2>
      </div>

      {/* Comparison Card */}
      <div className="mx-auto max-w-6xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-lg">
        {/* Lumi Way */}
        <div className="bg-tangerine p-10 text-white">
          <p className="text-sm opacity-90 mb-2 text-[13px] md:text-[16px] ">The Smart Choice</p>
          <h3 className="font-heading text-[24px] md:text-[30px] mb-6">
            <span className="text-stroke-tangerine">LUMI</span> WAY
          </h3>

          <ul className="space-y-4  text-[16px] md:text-[20px]">
            {[
              "Multi language conversations that encourage children to speak freely.",
              "Screen-free, thoughtful play that reduces digital dependency",
              "Helps children express feelings and build emotional confidence",
              "Boosts vocabulary, verbal skills, and language exposure",
              "Grows with your child through evolving conversations",
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-start">
                <TickIcon className="mt-1 h-5 w-5 text-lime-300 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Old Way */}
        <div className="bg-white p-10 text-gray-800">
          <p className="text-sm text-gray-500 mb-2 text-[13px] md:text-[16px] ">The Old Approach</p>
          <h3 className="font-heading text-[24px] md:text-[30px] mb-6">OLD WAY</h3>

          <ul className="space-y-4  text-[16px] md:text-[20px]">
            {[
              "The toy entertains, but doesn't actually engage or listen.",
              "Fun for five minutes, then ends up in the donation pile.",
              "Relies on loud noises and screens instead of imagination.",
              "Doesn't help the child express how they feel.",
              "It can't be used in new ways, so the child outgrows it fast.",
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-start">
                <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 flex justify-center">
        <button className="rounded-xl w-60 bg-sky-blue px-10 py-4 font-heading text-white text-lg shadow-md hover:bg-[#2a7b98] transition">
          ORDER NOW
        </button>
      </div>
    </section>
  );
}
