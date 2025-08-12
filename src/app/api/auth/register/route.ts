import { NextRequest, NextResponse } from "next/server";
import { RegisterPayload } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();

    // Call your AWS Lambda endpoint
    const response = await fetch(
      "https://jeqsy9bhci.execute-api.ap-southeast-2.amazonaws.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Registration successful!",
      data: data.data,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
