import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";

export async function POST(request: NextRequest) {
  try {
    const { verificationToken } = await request.json();

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: "Verification token is required" },
        { status: BAD_REQUEST }
      );
    }

    const response = await fetch(
      "https://uf1zclrd28.execute-api.ap-southeast-1.amazonaws.com/resend-otp",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationToken }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.success === false) {
      return NextResponse.json(
        { success: false, message: data.message || "Resend OTP failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "OTP sent successfully",
      data,
    });
  } catch (err) {
    console.error("Resend OTP error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
