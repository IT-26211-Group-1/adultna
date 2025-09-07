import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { apiFetch } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await apiFetch(
      "https://c5w27vri7g.execute-api.ap-southeast-1.amazonaws.com/onboarding/view",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.success || !res.success) {
      return NextResponse.json(
        {
          success: false,
          message: res.message || "Failed to fetch questions",
        },
        { status: INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({
      success: true,
      data: res.data,
    });
  } catch (error) {
    console.error("Fetching onboarding questions failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        statusCode: INTERNAL_SERVER_ERROR,
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
