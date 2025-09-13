import { NextRequest, NextResponse } from "next/server";
import {
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST,
} from "@/constants/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add admin authentication/authorization check here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: UNAUTHORIZED }
    //   );
    // }

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "role"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: BAD_REQUEST }
      );
    }

    // Validate role
    const validRoles = ["user", "technical_admin", "verifier_admin"];
    if (!validRoles.includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: BAD_REQUEST }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: BAD_REQUEST }
      );
    }

    // Validate password strength only if password is provided
    if (body.password && body.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters long",
        },
        { status: BAD_REQUEST }
      );
    }

    const { firstName, lastName, email, password, role } = body;

    // Admin Auth Service Lambda Endpoint
    const response = await fetch(
      "https://ie6usme6ed.execute-api.ap-southeast-1.amazonaws.com/admin/create-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email.toLowerCase(),
          ...(password && { password }),
          role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to create account" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Account created successfully",
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
      },
    });
  } catch (err) {
    console.error("Admin create account API error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: INTERNAL_SERVER_ERROR }
    );
  }
}
