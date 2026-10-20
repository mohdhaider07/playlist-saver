import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getAppUrl(request: NextRequest): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Google authentication is not properly configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") === "ar" ? "ar" : "en";

  const appUrl = getAppUrl(request);
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const nonce = crypto.randomBytes(16).toString("hex");
  const statePayload = JSON.stringify({ nonce, lang });
  const encodedState = Buffer.from(statePayload).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", encodedState);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(googleAuthUrl.toString());

  response.cookies.set("oauth_state", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
