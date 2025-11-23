"use client";

import { useState, useRef } from "react";
import {
  useSecureStorageListener,
  useSecureStorage,
} from "@/hooks/useSecureStorage";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

const BackToLoginButton = () => {
  const { removeSecureItem } = useSecureStorage();

  const handleBackToLogin = () => {
    removeSecureItem("adminForgotPasswordEmail");
    removeSecureItem("adminForgotPasswordStep");
    removeSecureItem("adminForgotPasswordToken");
  };

  return (
    <div className="mb-6">
      <a
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-adult-green transition-colors"
        href="/admin/login"
        onClick={handleBackToLogin}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 19l-7-7 7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        Back to Login
      </a>
    </div>
  );
};

export default function ForgotPassword() {
  const initialized = useRef(false);
  const [loading, setLoading] = useState(() => typeof window === "undefined");

  const storedStep = useSecureStorageListener("adminForgotPasswordStep");
  const step = (storedStep as "email" | "otp" | "reset") || "email";

  if (!initialized.current && typeof window !== "undefined") {
    initialized.current = true;
    setLoading(false);
  }

  if (loading) {
    return null;
  }

  const renderStep = () => {
    switch (step) {
      case "email":
        return <EmailStep />;
      case "otp":
        return <OtpStep />;
      case "reset":
        return <ResetPasswordStep />;
      default:
        return null;
    }
  };

  const getStepContent = () => {
    switch (step) {
      case "email":
        return {
          title: "Forgot Password?",
          subtitle:
            "Enter your email address and we'll send you a verification code.",
        };
      case "otp":
        return {
          title: "OTP Verification",
          subtitle: "We've sent a verification code to your email address.",
        };
      case "reset":
        return {
          title: "Reset Password",
          subtitle: "Enter your new password below.",
        };
      default:
        return {
          title: "Forgot Password?",
          subtitle:
            "Enter your email address and we'll send you a verification code.",
        };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1F8F5] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6">
        <BackToLoginButton />

        <h1 className="text-6xl font-bold text-center font-songmyung text-adult-green">
          AdultNa.
        </h1>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {stepContent.title}
          </h2>
          <p className="text-sm text-gray-600">{stepContent.subtitle}</p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
