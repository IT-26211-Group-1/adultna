"use client";

import { useState, useRef } from "react";
import { useSecureStorageListener } from "@/hooks/useSecureStorage";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { ImageContainer } from "../../register/_components/ImageContainer";

const BackToLoginButton = () => {
  return (
    <div className="mb-6">
      <a
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        href="/auth/login"
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


  // Listen to step changes from secure storage
  const storedStep = useSecureStorageListener("forgotPasswordStep");
  const step = (storedStep as "email" | "otp" | "reset") || "email";

  // Initialize loading state
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

  // Get step-specific content
  const getStepContent = () => {
    switch (step) {
      case "email":
        return {
          title: "Forgot Password?",
          subtitle:
            "Enter your email address and we'll send you a link to reset your password.",
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
            "Enter your email address and we'll send you a link to reset your password.",
        };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back to Login - Show on email and reset steps */}
          {(step === "email" || step === "reset") && <BackToLoginButton />}

          {/* Title and Subtitle */}
          {step === "otp" ? (
            <div className="text-center mb-6">
              <UserAuthTitle
                subtitle={stepContent.subtitle}
                title={stepContent.title}
              />
            </div>
          ) : (
            <UserAuthTitle
              subtitle={stepContent.subtitle}
              title={stepContent.title}
            />
          )}

          {/* Step Content */}
          <div className="space-y-6">{renderStep()}</div>
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer step={step} />
    </div>
  );
}
