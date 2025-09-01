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
      "https://sy7rt60g76.execute-api.ap-southeast-1.amazonaws.com/login",
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
      maxAge: Math.floor((accessTokenExpiresAt - Date.now()) / 1000),
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    return resp;
  } catch (err) {
    const resp = NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: UNAUTHORIZED }
    );
    resp.cookies.delete("access_token");
    resp.cookies.delete("refresh_token");
    return resp;
  }
}
