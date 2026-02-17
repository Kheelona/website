import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { getWixTokenStorage, isWixConfigured, setWixOAuthDataCookie } from "@/lib/wix/auth";

const CALLBACK_PATH = "/api/auth/wix/callback";

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  if (!isWixConfigured()) {
    return NextResponse.json({ message: "Wix auth is not configured" }, { status: 503 });
  }

  const tokenStorage = await getWixTokenStorage();
  const wixClient = createClient({
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokenStorage,
    }),
  });

  const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const redirectUri = new URL(CALLBACK_PATH, request.nextUrl.origin).toString();
  const oauthData = wixClient.auth.generateOAuthData(redirectUri, returnTo);

  await setWixOAuthDataCookie(oauthData);

  const { authUrl } = await wixClient.auth.getAuthUrl(oauthData, { prompt: "login" });
  return NextResponse.redirect(authUrl);
}
