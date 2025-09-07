import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://c5w27vri7g.execute-api.ap-southeast-1.amazonaws.com/onboarding/view",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch questions",
        },
        { status: res.status || INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
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
