import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";
import { VerifyEmailResponse } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: BAD_REQUEST }
      );
    }

    const response = await fetch(
      "https://sy7rt60g76.execute-api.ap-southeast-1.amazonaws.com/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    const data: VerifyEmailResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Verification failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Email verified successfully",
      data,
    });
  } catch (err) {
    console.error("Verify email error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
