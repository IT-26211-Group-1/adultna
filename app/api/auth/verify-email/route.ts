import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";
import { VerifyEmailResponse } from "@/types/auth";

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

    const response = await fetch(
      "https://uf1zclrd28.execute-api.ap-southeast-1.amazonaws.com/verify-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, verificationToken }),
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
      cooldownLeft: data.cooldownLeft ?? 0,
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
