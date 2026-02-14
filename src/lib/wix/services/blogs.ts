import { wixClient } from "../client";

export const getBlogs = async () => {
  const { posts } = await wixClient.posts.listPosts({
    paging: { limit: 10 },
    sort: [{ fieldName: "firstPublishedDate", order: "DESC" }] as any,
  });

  return posts;
};
