"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function CommunityHeroSection() {
  return (
    <section className="relative h-screen pt-35 pb-10 overflow-hidden">
      <div className="px-4">
        <SectionHeader title="Parenting is Hard. Doing it Alone is Harder." />
      </div>
      <p className="text-center font-bold">🥗 Nutrition 🧠 Wellness 💡Parenting tips</p>
      <div className="px-5 md:px-10">
        {/* Card */}
        <div className="mt-5 relative mx-auto ma rounded-3xl p-8 text-white  ">
          {/* WhatsApp Card */}
          <div className="relative mx-auto max-w-sm rounded-2xl bg-white p-6 text-center text-gray-800 border border-gray-200">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/testimonial.png"
                alt="Community Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>

            <p className="font-bold text-sm ">Welcome to the group: General</p>
            <p className="mt-2 text-sm  ">
              All community members can use this chat to talk with each other
            </p>

            <Link
              href="https://chat.whatsapp.com/D2kenBUYhhRBaXT9lCJzKB?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className=" flex items-center justify-center"
            >
              <Button variant="green" className="w-full rounded-full">
                <MemoWhatsappIcon size={30} />
                <span className="-mb-2">Join now</span>
              </Button>
            </Link>

            <div className="absolute -top-6 -right-6 flex h-25 w-25 items-center justify-center rounded-full border-1 border-muted-orange bg-white text-center font-bold text-sky-blue  text-[24px] leading-7">
              Its <br /> Free
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 h-60 w-full">
        <Image
          src="/images/growth.webp"
          alt="Parenting Community"
          width={2400}
          height={600}
          className="mx-auto"
          priority
        />
      </div>
    </section>
  );
}
