"use client";

import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

const CARD_WIDTH = 400;
const GAP = 16;

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

export default function BlogsSwippable({ blogs }: { blogs: any[] }) {
  const viewportRef = React.useRef<HTMLDivElement>(null);

  return (
    <section className="">
      {/* <SectionHeader title="WHAT THE PARENTS SAY?" /> */}

      <ScrollArea.Root className="relative w-full mt-10">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="w-full flex overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
          }}
        >
          <div className="flex gap-4 p-4">
            {blogs.map((blog, i) => {
              const imageUrl = getWixImageUrl(blog.media?.wixMedia?.image, 710, 565);

              return (
                <article
                  key={blog._id}
                  className="
                    w-[80vw]  min-w-99.5   max-w-225  bg-white  rounded-2xl  border  border-[#BCBCBC] overflow-hidden  snap-center"
                >
                  {/* Cover Image */}
                  <div className="relative w-full h-65 bg-gray-200">
                    {imageUrl && (
                      <Image src={imageUrl} alt={blog.title} fill className="object-cover" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-4">
                    {/* Author + Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <span>Nandini Mogara</span>
                      </div>

                      <span>
                        {new Date(blog.firstPublishedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-lato font-black text-[12px] md:text-[36px] leading-snug">
                      {blog.title}
                    </h3>

                    {/* Read More */}
                    <a href={`/blog/${blog._id}`} className="ml-auto">
                      <button className="text-gray-500 text-sm text-right hover:text-black transition">
                        Read more
                      </button>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" /> <ScrollArea.Corner />
      </ScrollArea.Root>
    </section>
  );
}
