import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, message: "Missing code" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://uf1zclrd28.execute-api.ap-southeast-1.amazonaws.com/auth/google/callback?code=${encodeURIComponent(
      code,
    )}`,
    { method: "POST" },
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const token = data.accessToken;
  const redirectTo = data.isNew ? "/onboarding" : "/dashboard";

  const response = NextResponse.redirect(new URL(redirectTo, req.url));

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}
