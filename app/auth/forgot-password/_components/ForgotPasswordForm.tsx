"use client";
import { useState, useEffect } from "react";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

// Import the components we created for registration
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { ImageContainer } from "../../register/_components/ImageContainer";


// Component: BackToLoginButton.tsx
const BackToLoginButton = () => {
  return (
    <div className="mb-6">
      <a
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Login
      </a>
    </div>
  );
};

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [token, setToken] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedStep = sessionStorage.getItem("forgotPasswordStep");
      const storedToken = sessionStorage.getItem("forgotPasswordToken");
      const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
      if (storedStep) setStep(storedStep as "email" | "otp" | "reset");
      if (storedToken) setToken(storedToken);
      if (storedEmail) setEmail(storedEmail);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("forgotPasswordStep", step);
      sessionStorage.setItem("forgotPasswordToken", token);
    }
  }, [step, token]);

  if (loading) {
    return null;
  }

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <EmailStep
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            setToken={setToken}
          />
        );
      case "otp":
        return <OtpStep email={email} setStep={setStep} token={token} />;
      case "reset":
        return <ResetPasswordStep setStep={setStep} token={token} />;
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
          subtitle: "Enter your email address and we'll send you a link to reset your password."
        };
      case "otp":
        return {
          title: "OTP Verification",
          subtitle: "We've sent a verification code to your email address."
        };
      case "reset":
        return {
          title: "Reset Password",
          subtitle: "Enter your new password below."
        };
      default:
        return {
          title: "Forgot Password?",
          subtitle: "Enter your email address and we'll send you a link to reset your password."
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
                title={stepContent.title}
                subtitle={stepContent.subtitle}
              />
            </div>
          ) : (
            <UserAuthTitle
              title={stepContent.title}
              subtitle={stepContent.subtitle}
            />
          )}

          {/* Step Content */}
          <div className="space-y-6">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer step={step} />
    </div>
  );
}