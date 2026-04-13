// lib/getBlogById.ts
import { unstable_noStore as noStore } from "next/cache";
import { wixClient } from "../client";

export const getBlogBySlug = async (slug: string) => {
  noStore();

  const post = await wixClient.posts.getPostBySlug(slug, {
    fieldsets: ["RICH_CONTENT"] as any,
  } as any);

  return post;
};
