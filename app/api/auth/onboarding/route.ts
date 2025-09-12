import { NextRequest, NextResponse } from "next/server";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/constants/http";
import { apiFetch } from "@/utils/api";
import { cookies, headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const body = {
      displayName:
        typeof raw.displayName === "string" && raw.displayName.trim()
          ? raw.displayName.trim()
          : undefined,
      questionId:
        raw.questionId !== undefined && !Number.isNaN(Number(raw.questionId))
          ? Number(raw.questionId)
          : undefined,
      optionId:
        raw.optionId !== undefined && !Number.isNaN(Number(raw.optionId))
          ? Number(raw.optionId)
          : undefined,
      priorities: Array.isArray(raw.priorities)
        ? (raw.priorities as Array<{ questionId: unknown; optionId: unknown }>)
            .map((p) => ({
              questionId: Number(p?.questionId),
              optionId: Number(p?.optionId),
            }))
            .filter(
              (p) =>
                Number.isFinite(p.questionId) && Number.isFinite(p.optionId)
            )
        : undefined,
    };

    const hdrs = await headers();
    const authHeader = hdrs.get("authorization");
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;
    const auth =
      authHeader ?? (tokenFromCookie ? `Bearer ${tokenFromCookie}` : undefined);

    const res = await apiFetch(
      "https://6xaew9pl7l.execute-api.ap-southeast-1.amazonaws.com/onboarding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.success) {
      console.error("Error saving onboarding data:", res);

      return NextResponse.json(
        {
          success: false,
          message: res.message || "Onboarding failed",
        },
        { status: (res as any).status ?? BAD_REQUEST }
      );
    }

    return NextResponse.json(res.data);
  } catch (err) {
    console.error("[onboarding] route error:", err);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
