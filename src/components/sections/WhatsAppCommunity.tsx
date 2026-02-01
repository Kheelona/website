"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";

export default function WhatsAppCommunity() {
  return (
    <section className="relative bg-muted-orange py-16 px-4 overflow-hidden">
      {/* Heading */}
      <h2 className="font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center">
        JOIN THE WHATS APP <br />
        PARENTING COMMUNITY
      </h2>
      <div className="px-5 md:px-10">
        {/* Card */}
        <div className="mt-10 relative mx-auto ma rounded-3xl bg-tangerine p-8 text-white shadow-xl pb-10 sm:pb-30 md:pb-105">
          <p className="mb-15 hidden md:block text-[30px] font-medium font-lato text-center ">
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

            <h4 className="font-bold font-lato">Welcome to the group: General</h4>
            <p className="mt-2 text-sm font-lato ">
              All community members can use this chat to talk with each other
            </p>

            <Link
              href="#"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-semibold font-heading text-[24px] md:text-[32px] text-white hover:bg-green-600 transition"
            >
              <span className="hidden md:block">
                <MemoWhatsappIcon size={30} />
              </span>
              <span className="-mb-2">Join now</span>
            </Link>

            {/* Free Badge */}
            <div className="absolute -top-6 -right-6 flex h-25 w-25 items-center justify-center rounded-full border-4 border-muted-orange bg-white text-center font-bold text-sky-blue font-lato text-[24px] leading-7">
              Its <br /> Free
            </div>
          </div>
          <p className="my-15 block md:hidden text-[16px] font-medium font-lato text-center text-white">
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
            priority
          />
        </div>
      </div>
    </section>
  );
}
