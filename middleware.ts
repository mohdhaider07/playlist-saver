import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import {
  getPathLocale,
  getPreferredLocale,
  localeCookieName,
  stripLocale,
} from "@/lib/i18n/config";
import { initializeYoutubePlaylistCron } from "@/lib/cron-scheduler";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "your_very_long_random_secret_here_at_least_64_chars";

// Initialize cron job on server startup
initializeYoutubePlaylistCron();

const protectedRoutes = ["/dashboard", "/playlist", "/profile"];
const authRoutes = ["/login", "/register"];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthPath(pathname: string) {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function withLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

function getRequestCountry(request: NextRequest) {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocale = getPathLocale(pathname);

  if (!pathnameLocale) {
    const locale = getPreferredLocale(
      request.headers.get("accept-language"),
      request.cookies.get(localeCookieName)?.value,
      getRequestCountry(request),
    );
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return withLocaleCookie(NextResponse.redirect(url), locale);
  }

  const pathWithoutLocale = stripLocale(pathname);

  let token = request.cookies.get("token")?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  let isAuthenticated = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isProtectedPath(pathWithoutLocale) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${pathnameLocale}/login`;
    return withLocaleCookie(NextResponse.redirect(url), pathnameLocale);
  }

  if (isAuthPath(pathWithoutLocale) && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `/${pathnameLocale}/dashboard`;
    return withLocaleCookie(NextResponse.redirect(url), pathnameLocale);
  }

  return withLocaleCookie(NextResponse.next(), pathnameLocale);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
