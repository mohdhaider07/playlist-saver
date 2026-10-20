import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { generateToken, getTokenMaxAge } from "@/lib/auth";

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

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl(request);
  const redirectUri = `${appUrl}${request.nextUrl.pathname}`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const googleError = searchParams.get("error");

  let lang = "en";
  let isValidState = false;

  if (state) {
    try {
      const parsed = JSON.parse(
        Buffer.from(state, "base64url").toString("utf-8"),
      );
      if (parsed.lang === "ar" || parsed.lang === "en") {
        lang = parsed.lang;
      }
      const savedNonce = request.cookies.get("oauth_state")?.value;
      if (savedNonce && savedNonce === parsed.nonce) {
        isValidState = true;
      }
    } catch {
      isValidState = false;
    }
  }

  const errorRedirect = (reason: string) => {
    const response = NextResponse.redirect(
      new URL(`/${lang}/login?error=${encodeURIComponent(reason)}`, appUrl),
    );
    response.cookies.set("oauth_state", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    });
    return response;
  };

  if (googleError) {
    return errorRedirect("cancelled");
  }

  if (!code || !isValidState) {
    return errorRedirect("invalid_state");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorRedirect("config_error");
  }

  try {
    // 1. Exchange authorization code for Google tokens
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    const tokenData: GoogleTokenResponse = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("[Google OAuth] Token exchange error:", tokenData);
      return errorRedirect("token_exchange_failed");
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    if (!profileRes.ok) {
      return errorRedirect("profile_fetch_failed");
    }

    const profile: GoogleUserInfo = await profileRes.json();

    if (!profile.email) {
      return errorRedirect("email_missing");
    }

    const emailLower = profile.email.toLowerCase().trim();
    const users = await getUsersCollection();
    const existingUser = await users.findOne({ email: emailLower });

    let userId: string;

    if (existingUser) {
      userId = existingUser._id.toString();

      await users.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            isEmailVerified: true,
            googleId: profile.sub,
            name: existingUser.name || profile.name || "Learner",
            avatar: existingUser.avatar || profile.picture,
            otpCode: null,
            otpExpiresAt: null,
            updatedAt: new Date(),
          },
        },
      );
    } else {
      const newUser = {
        name: profile.name || "Learner",
        email: emailLower,
        googleId: profile.sub,
        avatar: profile.picture,
        authProvider: "google" as const,
        isEmailVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await users.insertOne(newUser);
      userId = result.insertedId.toString();
    }

    // 3. Issue application session token
    const token = generateToken({
      sub: userId,
      email: emailLower,
    });

    // 4. Set HTTP-only session cookie and redirect to client sync page
    const callbackRedirectUrl = new URL(
      `/${lang}/auth/callback?token=${encodeURIComponent(token)}`,
      appUrl,
    );

    const response = NextResponse.redirect(callbackRedirectUrl);

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getTokenMaxAge(),
    });

    response.cookies.set("oauth_state", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error("[GET /api/auth/callback/google]", error);
    return errorRedirect("server_error");
  }
}
