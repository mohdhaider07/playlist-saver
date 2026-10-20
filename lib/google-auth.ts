import { NextRequest } from "next/server";
import crypto from "crypto";
import { getUsersCollection } from "./db";
import { UserDocument } from "@/types";

export const GOOGLE_AUTH_CALLBACK_PATH = "/api/auth/callback/google";

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
  expires_in: number;
  token_type: string;
  error?: string;
  error_description?: string;
}

interface OAuthStatePayload {
  nonce: string;
  lang: string;
}

/**
 * Resolves the application base URL from environment or request headers.
 */
export function getAppUrl(request: NextRequest): string {
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

/**
 * Builds the Google OAuth consent URL and CSRF nonce.
 */
export function createGoogleOAuthUrl(
  appUrl: string,
  lang: string,
): { authUrl: string; nonce: string } {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Missing GOOGLE_CLIENT_ID configuration");
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  const statePayload: OAuthStatePayload = { nonce, lang };
  const encodedState = Buffer.from(JSON.stringify(statePayload)).toString(
    "base64url",
  );

  const redirectUri = `${appUrl}${GOOGLE_AUTH_CALLBACK_PATH}`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", encodedState);
  authUrl.searchParams.set("prompt", "select_account");

  return { authUrl: authUrl.toString(), nonce };
}

/**
 * Validates the state parameter returned by Google against the saved nonce cookie.
 */
export function verifyOAuthState(
  state: string | null,
  savedNonce?: string,
): { isValid: boolean; lang: string } {
  if (!state || !savedNonce) {
    return { isValid: false, lang: "en" };
  }

  try {
    const parsed: OAuthStatePayload = JSON.parse(
      Buffer.from(state, "base64url").toString("utf-8"),
    );
    const lang = parsed.lang === "ar" ? "ar" : "en";
    const isValid = parsed.nonce === savedNonce;
    return { isValid, lang };
  } catch {
    return { isValid: false, lang: "en" };
  }
}

/**
 * Exchanges the Google authorization code for an access token.
 */
export async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth configuration");
  }

  const tokenParams = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenParams.toString(),
  });

  const data: GoogleTokenResponse = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || "Failed to exchange Google code");
  }

  return data.access_token;
}

/**
 * Fetches the user profile from Google's UserInfo endpoint.
 */
export async function fetchGoogleProfile(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Google user profile");
  }

  const profile: GoogleUserInfo = await res.json();
  if (!profile.email) {
    throw new Error("Google profile is missing an email address");
  }

  return profile;
}

/**
 * Finds or creates a user account from Google profile details.
 * Implements account linking and auto-verification for existing unverified accounts.
 */
export async function syncGoogleUser(
  profile: GoogleUserInfo,
): Promise<{ user: UserDocument; isNew: boolean }> {
  const emailLower = profile.email.toLowerCase().trim();
  const users = await getUsersCollection();
  const existing = await users.findOne({ email: emailLower });

  if (existing) {
    // Existing user: Auto-verify email and link Google ID
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          isEmailVerified: true,
          googleId: profile.sub,
          name: existing.name || profile.name || "Learner",
          avatar: existing.avatar || profile.picture,
          otpCode: null,
          otpExpiresAt: null,
          updatedAt: new Date(),
        },
      },
    );

    const updated = await users.findOne({ _id: existing._id });
    return {
      user: {
        _id: existing._id.toString(),
        name: updated?.name || existing.name,
        email: existing.email,
        passwordHash: existing.passwordHash,
        googleId: profile.sub,
        avatar: existing.avatar || profile.picture,
        isEmailVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      },
      isNew: false,
    };
  }

  // New user registration via Google
  const now = new Date();
  const newUser = {
    name: profile.name || "Learner",
    email: emailLower,
    googleId: profile.sub,
    avatar: profile.picture,
    authProvider: "google" as const,
    isEmailVerified: true,
    otpCode: null,
    otpExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(newUser);
  return {
    user: {
      _id: result.insertedId.toString(),
      ...newUser,
    },
    isNew: true,
  };
}
