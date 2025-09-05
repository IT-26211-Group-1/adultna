"use client";

import { useState, useEffect, useCallback } from "react";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">(
    () => (sessionStorage.getItem("forgotPasswordStep") as any) ?? "email"
  );
  const [token, setToken] = useState(
    () => sessionStorage.getItem("forgotPasswordToken") || ""
  );
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("forgotPasswordEmail") || ""
  );

  useEffect(() => {
    sessionStorage.setItem("forgotPasswordStep", step);
    sessionStorage.setItem("forgotPasswordToken", token);
    sessionStorage.setItem("forgotPasswordEmail", email);
  }, [step, token, email]);

  const renderStep = useCallback(() => {
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
        return <OtpStep token={token} setStep={setStep} />;
      case "reset":
        return <ResetPasswordStep token={token} setStep={setStep} />;
      default:
        return null;
    }
  }, [step, email, token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        {renderStep()}
      </div>
    </div>
  );
}
