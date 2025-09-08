import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, BAD_REQUEST } from "@/constants/http";
import { apiFetch } from "@/utils/api";

export async function POST(request: NextRequest) {
  try {
    const { verificationToken } = await request.json();

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, message: "Verification token is required" },
        { status: BAD_REQUEST },
      );
    }

    const apiResponse = await apiFetch<{ success: boolean; message?: string }>(
      "https://uf1zclrd28.execute-api.ap-southeast-1.amazonaws.com/resend-otp",
      {
        method: "POST",
        body: JSON.stringify({ verificationToken }),
      },
    );

    if (!apiResponse.success) {
      return NextResponse.json(
        { success: false, message: apiResponse.message || "Resend OTP failed" },
        { status: BAD_REQUEST },
      );
    }

    return NextResponse.json({
      success: true,
      message: apiResponse.data?.message || "OTP resent successfully",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: INTERNAL_SERVER_ERROR },
    );
  }
}
