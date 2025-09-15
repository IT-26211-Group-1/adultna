import { NextRequest, NextResponse } from "next/server";
import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
  NOT_FOUND,
} from "@/constants/http";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: BAD_REQUEST }
      );
    }

    const body = await request.json();

    // TODO: Add admin authentication/authorization check here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: UNAUTHORIZED }
    //   );
    // }

    // Validate that at least one field is provided
    const { firstName, lastName, email } = body;

    if (!firstName && !lastName && !email) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one field must be updated",
        },
        { status: BAD_REQUEST }
      );
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Invalid email format" },
          { status: BAD_REQUEST }
        );
      }
    }

    const response = await fetch(
      `https://ie6usme6ed.execute-api.ap-southeast-1.amazonaws.com/admin/update-account/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update account" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Account updated successfully",
      user: data.user,
    });
  } catch (err) {
    console.error("Admin update account API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update account",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}

export const PUT = PATCH;
export const POST = PATCH;
