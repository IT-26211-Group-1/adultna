import { NextRequest, NextResponse } from "next/server";

const PROTECTED_FOLDERS = ["/dashboard"];

const PUBLIC_ONLY_PAGES = ["/login", "/register", "/verify-email", "/"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  if (
    PROTECTED_FOLDERS.some((folder) => pathname.startsWith(folder)) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (PUBLIC_ONLY_PAGES.some((page) => pathname === page) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};
