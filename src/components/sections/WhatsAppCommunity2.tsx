"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function WhatsAppCommunity() {
  return (
    <section className="relative bg-muted-orange py-16 px-4 overflow-hidden">
      <SectionHeader title="JOIN THE WHATS APP PARENTING COMMUNITY" />
      <div className="px-5 md:px-10">
        {/* Card */}
        <div className="mt-10 relative mx-auto ma rounded-3xl bg-tangerine p-8 text-white shadow-xl pb-8 sm:pb-30 ">
          <p className="mb-15 hidden md:block text-[30px] font-medium  text-center ">
            Free online and offline counselling alternative Fridays !!
          </p>

          {/* WhatsApp Card */}
          <div className="relative mx-auto max-w-sm rounded-2xl bg-white p-6 text-center text-gray-800">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/testimonial.png"
                alt="Community Avatar"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>

            <h4 className="font-bold ">Welcome to the group: General</h4>
            <p className="mt-2 text-sm  ">
              All community members can use this chat to talk with each other
            </p>

            <Link href="#" className="mt-5 flex items-center justify-center">
              <Button variant="green" className="w-full">
                <span className="hidden md:block">
                  <MemoWhatsappIcon size={30} />
                </span>
                <span className="-mb-2">Join now</span>
              </Button>
            </Link>

            <div className="absolute -top-6 -right-6 flex h-25 w-25 items-center justify-center rounded-full border-4 border-muted-orange bg-white text-center font-bold text-sky-blue  text-[24px] leading-7">
              Its <br /> Free
            </div>
          </div>
          <p className=" mt-5 block md:hidden text-[16px] font-medium  text-center text-white">
            Free online and offline counselling alternative Fridays !!
          </p>
        </div>
      </div>
    </section>
  );
}
