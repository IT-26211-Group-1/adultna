"use client";

import { useState, useEffect } from "react";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        {renderStep()}
      </div>
    </div>
  );
}
