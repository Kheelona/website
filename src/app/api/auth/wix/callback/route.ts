import { NextRequest, NextResponse } from "next/server";
import { createClient, OAuthStrategy } from "@wix/sdk";
import {
  clearWixOAuthDataCookie,
  getWixOAuthDataCookie,
  getWixTokenStorage,
  isWixConfigured,
} from "@/lib/wix/auth";

function fallbackRedirect(origin: string) {
  return NextResponse.redirect(new URL("/?auth=error", origin));
}

function safeRedirectPath(path: string | undefined) {
  if (!path || !path.startsWith("/")) return "/";
  return path;
}

export async function GET(request: NextRequest) {
  if (!isWixConfigured()) {
    return NextResponse.json({ message: "Wix auth is not configured" }, { status: 503 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return fallbackRedirect(request.nextUrl.origin);
  }

  const oauthData = await getWixOAuthDataCookie();
  if (!oauthData) {
    return fallbackRedirect(request.nextUrl.origin);
  }

  try {
    const tokenStorage = await getWixTokenStorage();
    const wixClient = createClient({
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
        tokenStorage,
      }),
    });

    const memberTokens = await wixClient.auth.getMemberTokens(code, state, oauthData);
    tokenStorage.setTokens(memberTokens);

    await clearWixOAuthDataCookie();

    const redirectPath = safeRedirectPath(oauthData.originalUri);
    return NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));
  } catch {
    await clearWixOAuthDataCookie();
    return fallbackRedirect(request.nextUrl.origin);
  }
}
