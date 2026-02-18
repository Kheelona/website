"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

export default function BlogsGrid({ blogs }: { blogs: any[] }) {
  const [active, setActive] = useState<"kids" | "parents">("kids");

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[16px] md:text-3xl font-semibold font-lato">Love Reading?</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setActive("kids")}
              className={clsx(
                "px-5 md:px-10 py-1 rounded-2xl text-[15px] md:text-[24px] transition cursor-pointer ",
                active === "kids" ? "bg-[#8ADAFF]" : "bg-[#D2F1FF] "
              )}
            >
              Kids
            </button>

            <button
              onClick={() => setActive("parents")}
              className={clsx(
                "px-5 md:33px-10 py-1 rounded-2xl text-[15px] md:text-[24px] transition cursor-pointer",
                active === "parents" ? "bg-[#8ADAFF]" : "bg-[#D2F1FF] "
              )}
            >
              Parents
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const imageUrl = getWixImageUrl(blog.media?.wixMedia?.image, 710, 565);
            return (
              <Link key={blog._id} href={`/blog/${blog._id}`} className="h-full">
                <article className="relative pb-5 h-full bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
                  {/* Image */}
                  <div className="relative h-45.5 bg-gray-200">
                    {imageUrl && (
                      <Image src={imageUrl} alt={blog.title} fill className="object-cover" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <span className="text-[15px]">Nandini Mogara</span>
                      </div>

                      <span className="text-[15px]">
                        {new Date(blog.firstPublishedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3
                      className="text-[20px] font-lato font-semibold leading-snug"
                      style={{ fontWeight: 900 }}
                    >
                      {blog.title}
                    </h3>

                    <span className="absolute bottom-5 right-6 text-gray-500 hover:text-black transition text-[12px] md:text-[18px]">
                      Read more
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-16">
          <button className="text-gray-600 hover:text-black transition">Read more</button>
        </div> */}
      </div>
    </section>
  );
}
