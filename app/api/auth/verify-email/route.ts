import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";
import { VerifyEmailResponse } from "@/types/auth";
import { apiFetch } from "@/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { otp, verificationToken } = await request.json();

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: "Verification token is required" },
        { status: BAD_REQUEST }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP is required" },
        { status: BAD_REQUEST }
      );
    }

    const apiResponse = await apiFetch<VerifyEmailResponse>(
      "https://uf1zclrd28.execute-api.ap-southeast-1.amazonaws.com/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, verificationToken }),
      }
    );

    console.log(apiResponse);

    if (!apiResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP",
        },
        { status: BAD_REQUEST }
      );
    }

    const data = apiResponse.data!;

    const response = NextResponse.json({
      success: true,
      message: data.message,
      cooldownLeft: data.cooldownLeft ?? 0,
      user: data.userId,
      accessTokenExpiresAt: data.accessTokenExpiresAt,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    });

    console.log(response);
    // Set access token cookie
    if (data.accessToken && data.accessTokenExpiresAt) {
      const maxAge = Math.max(
        0,
        Math.floor((Number(data.accessTokenExpiresAt) - Date.now()) / 1000)
      );
      response.cookies.set({
        name: "access_token",
        value: data.accessToken,
        httpOnly: true,
        path: "/",
        maxAge: maxAge,
        sameSite: "lax",
        secure: process.env.NODE_ENV !== "development",
      });
    }

    // Set refresh token cookie
    if (data.refreshToken && data.refreshTokenExpiresAt) {
      const maxAge = Math.max(
        0,
        Math.floor((Number(data.accessTokenExpiresAt) - Date.now()) / 1000)
      );
      response.cookies.set({
        name: "refresh_token",
        value: data.refreshToken,
        httpOnly: true,
        path: "/api/auth/refresh",
        maxAge: maxAge,
        sameSite: "lax",
        secure: process.env.NODE_ENV !== "development",
      });
    }

    console.log(data);

    return response;
  } catch (err) {
    console.error("Verify email error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
