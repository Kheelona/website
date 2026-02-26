"use client";

import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";
import Link from "next/link";

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

      <ScrollArea.Root className="relative w-full mt-5">
        <ScrollArea.Viewport ref={viewportRef} className="w-full flex overflow-x-auto">
          <div className="flex gap-6 p-4">
            {blogs.map((blog) => {
              const imageUrl = getWixImageUrl(blog.media?.wixMedia?.image, 1346, 404);

              return (
                <article
                  key={blog._id}
                  className="
                    w-[80vw] md:min-w-99.5 max-w-336.5  bg-white  rounded-2xl  border  border-[#BCBCBC] overflow-hidden  snap-center"
                >
                  {/* Cover Image */}
                  <div className="relative w-full h-36.5 md:h-101 bg-gray-200">
                    {imageUrl && (
                      <Image src={imageUrl} alt={blog.title} fill className="object-cover" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="md:pt-8 p-2 md:px-32 md:pb-4 flex flex-col gap-4">
                    {/* Author + Date */}
                    <div className="flex items-center justify-between text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <span className="text-[12px] md:text-[20px]">Nandini Mogara</span>
                      </div>

                      <span className="text-[12px] md:text-[20px]">
                        {new Date(blog.firstPublishedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-lato text-[12px] md:text-[32px] leading-snug"
                      style={{ fontWeight: 700 }}
                    >
                      {blog.title}
                    </h3>

                    {/* Read More */}
                    <Link
                      href={`/blog/${blog._id}`}
                      className="ml-auto text-gray-500 text-sm text-right hover:text-black transition text-[12px] md:text-[20px] cursor-pointer"
                    >
                      Read more
                    </Link>
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
