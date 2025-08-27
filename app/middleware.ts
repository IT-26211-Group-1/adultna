import { NextRequest, NextResponse } from "next/server";

const PROTECTED_FOLDERS = ["/dashboard"];

const PUBLIC_ONLY_PAGES = ["/login", "/register", "/verify-email", "/"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  const authPages = ["/login", "/register", "/check-inbox", "/verify-email"];

  if (token && authPages.includes(pathname)) {
    const dashboardUrl = req.nextUrl.clone();

    dashboardUrl.pathname = "/dashboard";

    return dashboardUrl;
  }

  if (!token) {
    const loginUrl = req.nextUrl.clone();

    loginUrl.pathname = "/login";

    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("Authorization", `Bearer ${token}`);

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};
