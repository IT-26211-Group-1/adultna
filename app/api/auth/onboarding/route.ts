import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR } from "@/constants/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to onboarding Lambda
    const res = await fetch(
      "https://https://c5w27vri7g.execute-api.ap-southeast-1.amazonaws.com/onboarding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Onboarding failed:", err);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR },
    );
  }
}
