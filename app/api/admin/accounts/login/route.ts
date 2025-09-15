import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "@/constants/http";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const res = await fetch(
      "https://ie6usme6ed.execute-api.ap-southeast-1.amazonaws.com/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data: LoginResponse = await res.json();

    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: data.message,
      });
    }

    const { accessTokenExpiresAt, refreshTokenExpiresAt } = data;

    if (!accessTokenExpiresAt || !refreshTokenExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token expiration",
        },
        { status: UNAUTHORIZED }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: data.message,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });

    // Access token
    response.cookies.set({
      name: "admin_access_token",
      value: data.accessToken,
      httpOnly: true,
      path: "/admin",
      maxAge: Math.floor((Number(accessTokenExpiresAt) - Date.now()) / 1000),
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    // Refresh token
    response.cookies.set({
      name: "admin_refresh_token",
      value: data.refreshToken,
      httpOnly: true,
      path: "/admin",
      maxAge: Math.max(
        0,
        Math.floor((Number(refreshTokenExpiresAt) - Date.now()) / 1000)
      ),
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    return response;
  } catch (error) {
    console.error("Admin Login Failed:", error);

    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      statusCode: INTERNAL_SERVER_ERROR,
    });
  }
}
