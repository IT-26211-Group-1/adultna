import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { LoginPayload } from "@/types/auth";
import { apiFetch } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const response = await apiFetch<LoginPayload>(
      "https://sy7rt60g76.execute-api.ap-southeast-1.amazonaws.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response;

    if (!response.success) {
      return NextResponse.json({
        success: false,
        message: data.message,
      });
    }

    const nextRes = NextResponse.json({
      success: true,
      message: data.message || "Login Successful",
      data: {
        data: { userId: data.data?.userId },
      },
    });

    nextRes.cookies.set({
      name: "auth_token",
      value: data.data?.token || "",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "development",
    });

    return nextRes;
  } catch (error) {
    console.error("Login Failed: ", error);

    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      statusCode: INTERNAL_SERVER_ERROR,
    });
  }
}
