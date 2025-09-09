import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";
import { VerifyEmailResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: BAD_REQUEST },
      );
    }

    const response = await fetch(
      `https://sy7rt60g76.execute-api.ap-southeast-1.amazonaws.com/verify-email?token=${encodeURIComponent(
        token,
      )}`,
      { method: "POST" },
    );

    const data: VerifyEmailResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Verification failed" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        token: data.token,
        userId: data.userId,
      },
      message: data.message || "Email verified successfully",
    });
  } catch (err) {
    console.error("Verify email error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: INTERNAL_SERVER_ERROR },
    );
  }
}
