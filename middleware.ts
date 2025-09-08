import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/auth/onboarding"];
const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/verify-email"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const accessToken = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED_ROUTES.some((p) => url.pathname.startsWith(p));
  const isPublic = PUBLIC_ROUTES.some((p) => url.pathname.startsWith(p));

  if (isProtected && !accessToken) {
    url.pathname = "/auth/login";

    return NextResponse.redirect(url);
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
