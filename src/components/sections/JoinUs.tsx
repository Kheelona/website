"use client";

import Image from "next/image";
import Link from "next/link";

export default function JoinUs() {
  return (
    <section
      id="join-us"
      className="relative py-16 px-4 overflow-hidden"
      aria-labelledby="join-us-heading"
    >
      <div className="px-5 md:px-10">
        {/* Card */}
        <div className=" relative mx-auto rounded-3xl p-8 pb-50 sm:pb-30 md:pb-105">
          <p className="text-center text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-6">
            Join our team of visionary creators based in Bangalore, dedicated to crafting joy-filled
            products!
          </p>

          <p className="text-center text-gray-500 max-w-2xl mx-auto">
            We&apos;re looking for stars like you! Propel your resume to {" "}
            <a href="mailto:connect@kheelona.com" className="text-sky-blue underline">
              connect@kheelona.com
            </a>
             and join our constellation of creative minds!
          </p>

          <div className="flex justify-center my-5">
            <Link
              href={"https://www.linkedin.com/company/kheelona/"}
              aria-label={`Follow us on LinkedIn`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center overflow-hidden text-xl"
            >
              <Image
                src={"/images/social/in.png"}
                alt=""
                width={20}
                height={20}
                className="h-10 w-10 bg-white"
                aria-hidden="true"
              />
            </Link>
          </div>
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
