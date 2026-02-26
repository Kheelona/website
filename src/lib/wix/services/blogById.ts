// lib/getBlogById.ts
import { wixClient } from "../client";

export const getBlogById = async (postId: string) => {
  const post = await wixClient.posts.getPost(postId, {
    fieldsets: ["RICH_CONTENT"] as any,
  } as any);

  return post;
};
