import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { apiFetch } from "@/utils/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to onboarding Lambda
    const res = await apiFetch(
      "https://https://c5w27vri7g.execute-api.ap-southeast-1.amazonaws.com/onboarding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.success) {
      return NextResponse.json({
        success: false,
        message: res.message || "Onboarding failed",
      });
    }

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("Onboarding failed:", err);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
