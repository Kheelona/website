import Image from "next/image";
import { getBlogById } from "@/lib/wix/services/blogById";
import { getBlogs } from "@/lib/wix/services/blogs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BlogsGrid from "@/components/sections/BlogsGrid";

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { post }: any = await getBlogById(id);
  const allBlogs = await getBlogs();

  // Filter out the current blog from the list
  const relatedBlogs = allBlogs?.filter((blog: any) => blog.id !== id) || [];

  if (!post) {
    return <div className="py-40 text-center">Blog not found</div>;
  }

  const imageUrl = getWixImageUrl(post.media?.wixMedia?.image, 1200, 700);

  return (
    <>
      <Header />
      <section className="py-30 bg-white">
        <div className="mx-auto px-3 md:px-25">
          {/* Hero Image */}
          {imageUrl && (
            <div className="relative w-full h-100 md:h-128 rounded-2xl overflow-hidden mb-10">
              <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="px-3 md:px-25">
            {/* Author + Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full" />
                <span className="font-medium text-[12px] md:text-[20px]">Nandini Mogara</span>
              </div>

              <span className="font-medium text-[12px] md:text-[20px]">
                {new Date(post.firstPublishedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[24px]  font-lato md:text-[32px] font-semibold leading-tight mb-8"
              style={{ fontWeight: 700 }}
            >
              {post.title}
            </h1>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-[20px]"
              dangerouslySetInnerHTML={{
                __html: post.richContent?.html || post.excerpt || "",
              }}
            />
          </div>
        </div>
      </section>
      <BlogsGrid blogs={relatedBlogs} />
      <Footer />
    </>
  );
}
