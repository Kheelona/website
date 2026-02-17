import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import {
  clearWixOAuthDataCookie,
  clearWixTokenCookie,
  getWixTokenStorage,
  isWixConfigured,
} from "@/lib/wix/auth";

function normalizeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/")) return "/";
  return value;
}

export async function GET(request: NextRequest) {
  const returnTo = normalizeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const fallbackUrl = new URL(returnTo, request.nextUrl.origin).toString();

  if (!isWixConfigured()) {
    return NextResponse.redirect(fallbackUrl);
  }

  const tokenStorage = await getWixTokenStorage();
  const wixClient = createClient({
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokenStorage,
    }),
  });

  let redirectUrl = fallbackUrl;

  try {
    const { logoutUrl } = await wixClient.auth.logout(fallbackUrl);
    if (logoutUrl) {
      redirectUrl = logoutUrl;
    }
  } catch {
    // Fallback to local redirect if Wix logout request fails
  }

  await clearWixTokenCookie();
  await clearWixOAuthDataCookie();

  return NextResponse.redirect(redirectUrl);
}
