import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { posts } from "@wix/blog";

export const wixClient = createClient({
  modules: { posts, products },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
  }),
});
