import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const isAuthenticated = Boolean(authToken);
  const url = request.nextUrl.clone();

  if (isAuthenticated && url.pathname === "/login") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  const protectedPaths = ["/home"];

  if (
    !isAuthenticated &&
    protectedPaths.some((path) => url.pathname.startsWith(path))
  ) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/home/:path*"],
};
