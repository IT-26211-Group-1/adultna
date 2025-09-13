import { NextRequest, NextResponse } from "next/server";
import { BAD_REQUEST } from "@/constants/http";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, message: "Missing code" },
      { status: BAD_REQUEST },
    );
  }

  const res = await fetch(
    `https://obvl5xsdag.execute-api.ap-southeast-1.amazonaws.com/auth/google/callback?code=${encodeURIComponent(
      code,
    )}`,
    { method: "POST" },
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const accessToken = data.accessToken as string | undefined;
  const refreshToken = data.refreshToken as string | undefined;
  const accessTokenExpiresAt = data.accessTokenExpiresAt as number | undefined;
  const refreshTokenExpiresAt = data.refreshTokenExpiresAt as
    | number
    | undefined;
  const redirectTo = data.isNew ? "/auth/onboarding" : "/dashboard";

  const response = NextResponse.redirect(new URL(redirectTo, req.url));

  if (accessToken) {
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      ...(typeof accessTokenExpiresAt === "number"
        ? {
            maxAge: Math.max(
              0,
              Math.floor((accessTokenExpiresAt - Date.now()) / 1000),
            ),
          }
        : {}),
    });
  }

  if (refreshToken) {
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
      path: "/",
      ...(typeof refreshTokenExpiresAt === "number"
        ? {
            maxAge: Math.max(
              0,
              Math.floor((refreshTokenExpiresAt - Date.now()) / 1000),
            ),
          }
        : {}),
    });
  }

  return response;
}
