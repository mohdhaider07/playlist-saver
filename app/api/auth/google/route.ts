import { NextRequest, NextResponse } from "next/server";
import { createGoogleOAuthUrl, getAppUrl } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") === "ar" ? "ar" : "en";
    const appUrl = getAppUrl(request);

    const { authUrl, nonce } = createGoogleOAuthUrl(appUrl, lang);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set("oauth_state", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("[GET /api/auth/google]", error);
    return NextResponse.json(
      { error: "Google authentication is not properly configured." },
      { status: 500 },
    );
  }
}
