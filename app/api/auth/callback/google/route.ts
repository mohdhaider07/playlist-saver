import { NextRequest, NextResponse } from "next/server";
import { generateToken, setAuthCookie } from "@/lib/auth";
import {
  exchangeGoogleCode,
  fetchGoogleProfile,
  getAppUrl,
  syncGoogleUser,
  verifyOAuthState,
} from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl(request);
  const redirectUri = `${appUrl}${request.nextUrl.pathname}`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const googleError = searchParams.get("error");

  const savedNonce = request.cookies.get("oauth_state")?.value;
  const { isValid: isValidState, lang } = verifyOAuthState(state, savedNonce);

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

  try {
    const accessToken = await exchangeGoogleCode(code, redirectUri);
    const profile = await fetchGoogleProfile(accessToken);
    const { user } = await syncGoogleUser(profile);

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email,
    });

    const callbackRedirectUrl = new URL(
      `/${lang}/auth/callback?token=${encodeURIComponent(token)}`,
      appUrl,
    );

    const response = NextResponse.redirect(callbackRedirectUrl);
    setAuthCookie(response, token);
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
