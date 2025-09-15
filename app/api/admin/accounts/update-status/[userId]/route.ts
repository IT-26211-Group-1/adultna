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
    const { status } = body;

    // TODO: Add admin authentication/authorization check here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: UNAUTHORIZED }
    //   );
    // }

    // Validate status
    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: BAD_REQUEST }
      );
    }

    if (!["active", "inactive"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status must be either 'active' or 'inactive'",
        },
        { status: BAD_REQUEST }
      );
    }

    // Admin Auth Service Lambda Endpoint
    const response = await fetch(
      `https://ie6usme6ed.execute-api.ap-southeast-1.amazonaws.com/admin/update-status/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update status" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Account status updated successfully",
      user: data.user,
    });
  } catch (err) {
    console.error("Admin update status API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update account status",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}

export const PUT = PATCH;
export const POST = PATCH;
