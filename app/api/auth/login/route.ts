import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const res = await fetch(
      "https://sy7rt60g76.execute-api.ap-southeast-1.amazonaws.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data: LoginResponse = await res.json();

    if (data.needsVerification) {
      return NextResponse.json({
        success: false,
        message: data.message,
        needsVerification: true,
        verificationToken: data.verificationToken,
      });
    }

    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: data.message,
      });
    }

    const nextRes = NextResponse.json({
      success: true,
      message: data.message || "Login successful",
    });

    nextRes.cookies.set({
      name: "auth_token",
      value: data.token,
      httpOnly: true,
      path: "/dashboard",
      maxAge: 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV !== "development",
    });

    return nextRes;
  } catch (error) {
    console.error("Login Failed:", error);

    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      statusCode: INTERNAL_SERVER_ERROR,
    });
  }
}
