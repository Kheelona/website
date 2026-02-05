"use client";

import Image from "next/image";
import Link from "next/link";
import { MemoWhatsappIcon } from "@/assets/icons/MemoWhatsappIcon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export default function OnlineSession() {
  return (
    <section className="relative bg-muted-orange py-16 px-10 overflow-hidden">
      <SectionHeader title="Online Sessions alternate Fridays" />
      <div className="mb-4 flex justify-center">
        <Image
          src="/images/online.jpg"
          alt="Community Avatar"
          width={302}
          height={162}
          className="rounded-2xl"
        />
      </div>
      <Link href="#" className="mt-5 flex items-center justify-center">
        <Button variant="green" className="px-30 rounded-2xl">
          <MemoWhatsappIcon size={30} />
          <span className="-mb-2">Join now</span>
        </Button>
      </Link>
    </section>
  );
}
