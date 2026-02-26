"use client";

import Link from "next/link";
import Image from "next/image";

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

export default function BlogsGrid({ blogs }: { blogs: any[] }) {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <p className="text-[16px] md:text-[24px] font-semibold font-lato mb-10">Love Reading?</p>

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
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full" />
                        <span className="text-[13px]">Nandini Mogara</span>
                      </div>

                      <span className="text-[13px]">
                        {new Date(blog.firstPublishedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p
                      className="text-[16px] font-lato font-semibold leading-snug mb-2"
                      style={{ fontWeight: 900 }}
                    >
                      {blog.title}
                    </p>

                    <span className="absolute bottom-5 right-6 text-gray-500 hover:text-black transition text-[12px] md:text-[14px]">
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
