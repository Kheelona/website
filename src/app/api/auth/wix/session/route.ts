import { NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { getWixTokenStorage, isWixConfigured } from "@/lib/wix/auth";

type SessionResponse = {
  enabled: boolean;
  loggedIn: boolean;
};

export async function GET() {
  if (!isWixConfigured()) {
    return NextResponse.json<SessionResponse>({ enabled: false, loggedIn: false });
  }

  const tokenStorage = await getWixTokenStorage();
  const wixClient = createClient({
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokenStorage,
    }),
  });

  return NextResponse.json<SessionResponse>({
    enabled: true,
    loggedIn: wixClient.auth.loggedIn(),
  });
}
