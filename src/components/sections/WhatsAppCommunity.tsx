"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function WhatsAppCommunity() {
  return (
    <section
      id="contact"
      className="relative bg-muted-orange py-16 px-4 overflow-hidden"
      aria-labelledby="contact-heading"
    >
      <SectionHeader
        id="contact-heading"
        title="JOIN THE WHATS APP PARENTING COMMUNITY"
        className="mx-auto w-70 md:w-120"
      />
      <div className="px-5 md:px-10">
        {/* Card */}
        <div className="mt-10 relative mx-auto rounded-3xl bg-tangerine p-8 text-white shadow-xl pb-10 sm:pb-30 md:pb-105">
          <p className="mb-15 hidden md:block text-[16px] md:text-[24px]  font-medium  text-center ">
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

            <h4 className="font-bold font-lato text-xl">Welcome to the group: General</h4>
            <p className="mt-2 ">All community members can use this chat to talk with each other</p>

            <Link
              href="https://chat.whatsapp.com/D2kenBUYhhRBaXT9lCJzKB?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center"
            >
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
          <p className="my-15 block md:hidden text-[16px] font-medium  text-center text-white">
            Free online and offline counselling alternative Fridays !!
          </p>
        </div>

        {/* Bottom Illustration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
          <Image
            src="/images/community.webp"
            alt="Parenting Community"
            width={2400}
            height={600}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
