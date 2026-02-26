"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function OnlineSession() {
  return (
    <section className="relative bg-muted-orange py-16 px-10 overflow-hidden">
      <SectionHeader title="Online Sessions alternate Fridays" className="md:w-100 w-50 mx-auto" />
      <div className="mb-4 flex justify-center">
        <Image
          src="/images/online.jpg"
          alt="Community Avatar"
          width={800}
          height={400}
          className="md:w-200 md:h-100 md:border-6 border-4 border-white rounded-xl"
        />
      </div>
      <Link
        href="https://chat.whatsapp.com/D2kenBUYhhRBaXT9lCJzKB?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-center"
      >
        <Button variant="green" className="px-30 rounded-2xl">
          <MemoWhatsappIcon size={30} />
          <span className="-mb-2">Join now</span>
        </Button>
      </Link>
    </section>
  );
}
