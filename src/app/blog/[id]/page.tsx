import Image from "next/image";
import { getBlogById } from "@/lib/wix/services/blogById";
import { getBlogs } from "@/lib/wix/services/blogs";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BlogsGrid from "@/components/sections/BlogsGrid";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity";

export const getWixImageUrl = (wixImage: string, width = 800, height = 600) => {
  if (!wixImage) return "";

  const imageId = wixImage.split("/")[3];
  // 7303e2_06733c7a98f542a3aabe9de534d7cc60~mv2.jpeg

  return `https://static.wixstatic.com/media/${imageId}/v1/fill/w_${width},h_${height},al_c,q_90/${imageId}`;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toWixMediaUrl(mediaId?: string): string {
  if (!mediaId) return "";
  return `https://static.wixstatic.com/media/${mediaId}`;
}

function applyTextDecorations(text: string, decorations: any[] = []): string {
  let html = text;
  const safeColor = decorations.find((d) => d?.type === "COLOR")?.colorData?.foreground;

  if (decorations.some((d) => d?.type === "UNDERLINE")) {
    html = `<u>${html}</u>`;
  }
  if (decorations.some((d) => d?.type === "ITALIC")) {
    html = `<em>${html}</em>`;
  }
  if (decorations.some((d) => d?.type === "BOLD")) {
    html = `<strong>${html}</strong>`;
  }
  if (typeof safeColor === "string" && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(safeColor)) {
    html = `<span style="color:${safeColor}">${html}</span>`;
  }

  return html;
}

function findFirstRichContentImageUrl(richContent: any): string {
  const nodes = richContent?.nodes;
  if (!Array.isArray(nodes)) return "";

  const walk = (node: any): string => {
    if (!node || typeof node !== "object") return "";

    if (node.type === "IMAGE" || node.type === "image") {
      const mediaId = node?.imageData?.image?.src?.id;
      return toWixMediaUrl(mediaId);
    }

    if (!Array.isArray(node.nodes)) return "";
    for (const child of node.nodes) {
      const found = walk(child);
      if (found) return found;
    }
    return "";
  };

  for (const node of nodes) {
    const found = walk(node);
    if (found) return found;
  }

  return "";
}

function richContentToHtml(richContent: any, firstImageToSkip = ""): string {
  const nodes = richContent?.nodes;
  if (!Array.isArray(nodes)) return "";

  const toHtml = (node: any): string => {
    if (!node || typeof node !== "object") return "";

    if (node.type === "TEXT" || node.type === "text") {
      const rawText = String(node?.textData?.text ?? node?.text ?? "");
      const escapedText = escapeHtml(rawText).replaceAll("\n", "<br />");
      return applyTextDecorations(escapedText, node?.textData?.decorations);
    }

    const childrenHtml = Array.isArray(node.nodes) ? node.nodes.map(toHtml).join("") : "";
    const hasChildren = childrenHtml.replace(/<br\s*\/?>/gi, "").trim().length > 0;

    switch (node.type) {
      case "PARAGRAPH":
      case "paragraph":
        if (!hasChildren) return "";
        return `<p>${childrenHtml}</p>`;
      case "HEADING":
      case "heading": {
        const level = Math.min(Math.max(Number(node?.headingData?.level ?? 2), 1), 6);
        if (!hasChildren) return "";
        return `<h${level}>${childrenHtml}</h${level}>`;
      }
      case "BULLETED_LIST":
      case "bulletedList":
        if (!hasChildren) return "";
        return `<ul>${childrenHtml}</ul>`;
      case "ORDERED_LIST":
      case "orderedList":
        if (!hasChildren) return "";
        return `<ol>${childrenHtml}</ol>`;
      case "LIST_ITEM":
      case "listItem":
        if (!hasChildren) return "";
        return `<li>${childrenHtml}</li>`;
      case "BLOCKQUOTE":
      case "blockquote":
        if (!hasChildren) return "";
        return `<blockquote>${childrenHtml}</blockquote>`;
      case "IMAGE":
      case "image": {
        const mediaId = node?.imageData?.image?.src?.id;
        const alt = escapeHtml(String(node?.imageData?.altText ?? ""));
        const src = toWixMediaUrl(mediaId);
        if (!src) return "";
        if (src === firstImageToSkip) return "";
        return `<p><img src="${src}" alt="${alt}" loading="lazy" /></p>`;
      }
      case "DIVIDER":
      case "divider":
        return "<hr />";
      default:
        return childrenHtml;
    }
  };

  return nodes.map(toHtml).join("");
}

function getPostHtml(post: any, firstImageToSkip = ""): string {
  if (post?.richContent?.nodes) {
    return richContentToHtml(post?.richContent, firstImageToSkip) || post?.excerpt || "";
  }

  if (typeof post?.richContent?.html === "string") {
    if (!firstImageToSkip) return post.richContent.html;
    return post.richContent.html.replace(/<p>\s*<img[^>]*>\s*<\/p>/i, "");
  }

  return post?.content || post?.excerpt || "";
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { post }: any = await getBlogById(id);
  const allBlogs = await getBlogs();

  // Filter out the current blog from the list
  const relatedBlogs = allBlogs?.filter((blog: any) => blog._id !== id) || [];

  if (!post) {
    return <div className="py-40 text-center">Blog not found</div>;
  }

  const firstInlineImageUrl = findFirstRichContentImageUrl(post?.richContent);
  const imageUrl = firstInlineImageUrl || getWixImageUrl(post.media?.wixMedia?.image, 1200, 700);
  const postHtml = getPostHtml(post, firstInlineImageUrl);

  return (
    <>
      <Header />
      <section className="py-30 bg-white">
        <div className="mx-auto px-5 md:px-25">
          {/* Hero Image */}
          {imageUrl && (
            <div className="relative mx-auto lg:w-5xl w-full h-60 md:h-100 rounded-2xl overflow-hidden mb-10">
              <Image src={imageUrl} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="px-3 md:w-4xl mx-auto">
            {/* Author + Date */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full" />
                <span className="font-medium text-[12px] md:text-[18px]">Nandini Mogara</span>
              </div>

              <span className="font-medium text-[12px] md:text-[18px]">
                {new Date(post.firstPublishedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-[20px] font-lato md:text-[26px] font-semibold leading-tight mb-8"
              style={{ fontWeight: 700 }}
            >
              {post.title}
            </h1>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none text-[18px]"
              dangerouslySetInnerHTML={{
                __html: postHtml,
              }}
            />
          </div>
        </div>
      </section>
      <BlogsGrid blogs={relatedBlogs} />
      <WhatsAppCommunity />
      <Footer />
    </>
  );
}
