import { NextRequest, NextResponse } from "next/server";

import { RegisterPayload } from "@/types/auth";
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  TOO_MANY_REQUESTS,
} from "@/constants/http";
import arcjet, { protectSignup } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: { mode: "DRY_RUN", allow: [] },
      rateLimit: {
        mode: "LIVE",
        max: 5,
        interval: 60,
      },
    }),
  ],
});

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();

    const decision = await aj.protect(request, { email: body.email });

    if (decision.isDenied()) {
      let status = FORBIDDEN;
      let message = "Registration blocked";

      if (decision.reason.isRateLimit()) {
        status = TOO_MANY_REQUESTS;
        message = "Too many signup attempts. Try later.";
      } else if (decision.reason.isBot()) {
        message = "Bots are not allowed.";
      } else if (decision.reason.isEmail()) {
        message = "Invalid or disposable email.";
      }

      return NextResponse.json({ success: false, message }, { status });
    }

    if (!body.token) {
      return NextResponse.json(
        { success: false, message: "Captcha token missing" },
        { status: FORBIDDEN },
      );
    }

    const captchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: body.token,
        }),
      },
    );

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      console.error("Captcha verification failed:", captchaData);

      return NextResponse.json(
        { success: false, message: "Captcha verification failed", captchaData },
        { status: FORBIDDEN },
      );
    }

    const { firstName, lastName, email, password, acceptedTerms } = body;

    // Lambda Endpoint
    const response = await fetch(
      "https://obvl5xsdag.execute-api.ap-southeast-1.amazonaws.com/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          acceptedTerms,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Registration successful!",
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        verificationToken: data.verificationToken,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Registration Failed",
        err,
      },
      { status: INTERNAL_SERVER_ERROR },
    );
  }
}
