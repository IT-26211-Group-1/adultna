export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    access_type: "offline",
    prompt: "select_account",
  };

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    params
  ).toString()}`;

  return NextResponse.json({ url: googleUrl });
}
