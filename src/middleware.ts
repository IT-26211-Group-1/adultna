import { authMiddleware } from "@/lib/middleware";

export const middleware = authMiddleware;

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
