"use client";

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
    <section className="py-24 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-semibold">Love Reading?</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setActive("kids")}
              className={clsx(
                "px-5 py-2 rounded-full text-sm transition",
                active === "kids" ? "bg-sky-400 text-white" : "bg-sky-100 text-gray-700"
              )}
            >
              Kids
            </button>

            <button
              onClick={() => setActive("parents")}
              className={clsx(
                "px-5 py-2 rounded-full text-sm transition",
                active === "parents" ? "bg-sky-400 text-white" : "bg-sky-100 text-gray-700"
              )}
            >
              Parents
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const imageUrl = getWixImageUrl(blog.media?.wixMedia?.image, 710, 565);
            return (
              <article
                key={blog._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative h-55 bg-gray-200">
                  {imageUrl && (
                    <Image src={imageUrl} alt={blog.title} fill className="object-cover" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-4">
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

                  <h3 className="text-lg font-semibold leading-snug">{blog.title}</h3>

                  <a href={`/blog/${blog._id}`} className="ml-auto">
                    <button className="text-sm text-gray-500 text-right hover:text-black transition">
                      Read more
                    </button>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="text-gray-600 hover:text-black transition">Read more</button>
        </div>
      </div>
    </section>
  );
}
