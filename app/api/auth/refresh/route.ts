import { NextRequest, NextResponse } from "next/server";
import { UNAUTHORIZED } from "@/constants/http";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token" },
      { status: UNAUTHORIZED }
    );
  }

  try {
    const backendRes = await fetch(
      "https://obvl5xsdag.execute-api.ap-southeast-1.amazonaws.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await backendRes.json();

    if (!data.success) {
      const resp = NextResponse.json(
        { success: false, message: "Session expired" },
        { status: UNAUTHORIZED }
      );

      resp.cookies.delete("access_token");
      resp.cookies.delete("refresh_token");

      return resp;
    }

    const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt } = data;

    const normalizeExpiryMs = (maybeMs: number): number => {
      if (typeof maybeMs !== "number" || Number.isNaN(maybeMs))
        return Date.now();

      return maybeMs < 1e12 ? maybeMs * 1000 : maybeMs;
    };

    const accessExpiryMs = normalizeExpiryMs(accessTokenExpiresAt);

    const resp = NextResponse.json({
      success: true,
      message: "Access token refreshed",
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    resp.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      maxAge: Math.max(0, Math.floor((accessExpiryMs - Date.now()) / 1000)),
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    return resp;
  } catch {
    const resp = NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: UNAUTHORIZED }
    );

    resp.cookies.delete("access_token");
    resp.cookies.delete("refresh_token");

    return resp;
  }
}

export async function GET(req: NextRequest) {
  const redirectUrl = req.nextUrl.searchParams.get("redirect");
  const refreshToken = req.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const backendRes = await fetch(
      "https://obvl5xsdag.execute-api.ap-southeast-1.amazonaws.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await backendRes.json();

    if (!data.success) {
      const resp = NextResponse.redirect(new URL("/auth/login", req.url));

      resp.cookies.delete("access_token");
      resp.cookies.delete("refresh_token");

      return resp;
    }

    const { accessToken, accessTokenExpiresAt } = data;

    const normalizeExpiryMs = (maybeMs: number): number => {
      if (typeof maybeMs !== "number" || Number.isNaN(maybeMs))
        return Date.now();

      return maybeMs < 1e12 ? maybeMs * 1000 : maybeMs;
    };

    const accessExpiryMs = normalizeExpiryMs(accessTokenExpiresAt);

    const resp = NextResponse.redirect(
      new URL(redirectUrl || "/dashboard", req.url)
    );

    resp.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      path: "/",
      maxAge: Math.max(0, Math.floor((accessExpiryMs - Date.now()) / 1000)),
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    return resp;
  } catch {
    const resp = NextResponse.redirect(new URL("/auth/login", req.url));

    resp.cookies.delete("access_token");
    resp.cookies.delete("refresh_token");

    return resp;
  }
}
