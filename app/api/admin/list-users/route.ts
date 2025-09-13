import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "@/constants/http";

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication/authorization check here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: UNAUTHORIZED }
    //   );
    // }

    // Admin Auth Service Lambda Endpoint
    const response = await fetch(
      "https://ie6usme6ed.execute-api.ap-southeast-1.amazonaws.com/admin/list-users",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to list users" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      users: data.users,
    });
  } catch (err) {
    console.error("Admin list users API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve users",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
