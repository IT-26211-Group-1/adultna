import { INTERNAL_SERVER_ERROR } from "@/constants/http";
import { NextResponse } from "next/server";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(
      "https://6xaew9pl7l.execute-api.ap-southeast-1.amazonaws.com/onboarding/view",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      const errorText = await res.text();

      return NextResponse.json(
        {
          success: false,
          message: errorText || "Failed to fetch questions",
        },
        { status: res.status || INTERNAL_SERVER_ERROR }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    console.error("Fetching onboarding questions failed:");

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  } finally {
    clearTimeout(timeout);
  }
}
