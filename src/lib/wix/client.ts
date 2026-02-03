import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

export const wixClient = createClient({
  modules: { products },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
  }),
});
