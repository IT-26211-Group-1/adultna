import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(
    "https://obvl5xsdag.execute-api.ap-southeast-1.amazonaws.com/forgot-password/reset",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
