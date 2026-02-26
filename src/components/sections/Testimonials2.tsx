"use client";
import Testimonials2 from "@/components/sections/Testimonials";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="pt-10">
      <Testimonials2 />
      <div className="w-full">
        <Image
          src="/images/community.webp"
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
