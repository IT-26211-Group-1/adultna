import { NextRequest, NextResponse } from "next/server";
import { LoginPayload } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const response = await fetch(
      "https://jh41npczh5.execute-api.ap-southeast-2.amazonaws.com/login",
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
        { success: false, message: data.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Login successful!",
      data: {
        token: data.token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
