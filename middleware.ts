import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/auth/onboarding"];
const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/verify-email"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((p) => url.pathname.startsWith(p));
  const isPublic = PUBLIC_ROUTES.some((p) => url.pathname.startsWith(p));

  if (url.pathname.startsWith("/api/auth/refresh")) {
    return NextResponse.next();
  }

  const isAccessExpired = (() => {
    if (!accessToken) return true;
    const parts = accessToken.split(".");
    if (parts.length !== 3) return true;
    try {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
      const expMs = typeof payload.exp === "number" ? payload.exp * 1000 : 0;
      return !expMs || expMs <= Date.now();
    } catch {
      return true;
    }
  })();

  if (isProtected) {
    if (!accessToken || isAccessExpired) {
      if (refreshToken) {
        const refreshUrl = request.nextUrl.clone();
        refreshUrl.pathname = "/api/auth/refresh";
        refreshUrl.searchParams.set("redirect", url.pathname + url.search);
        return NextResponse.redirect(refreshUrl);
      }

      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  if (isPublic && accessToken) {
    url.pathname = "/dashboard";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/onboarding",
    // "/admin/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/verify-email",
  ],
};
