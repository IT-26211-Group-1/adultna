"use client";

import { useState, useEffect } from "react";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("forgotPasswordStep") as
      | "email"
      | "otp"
      | "reset"
      | null;
    const savedToken = sessionStorage.getItem("forgotPasswordToken") || "";
    const savedEmail = sessionStorage.getItem("forgotPasswordEmail") || "";

    if (savedStep) setStep(savedStep);
    if (savedToken) setToken(savedToken);
    if (savedEmail) setEmail(savedEmail);

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem("forgotPasswordStep", step);
    sessionStorage.setItem("forgotPasswordToken", token);
  }, [step, token, hydrated]);

  if (!hydrated) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        {step === "email" && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            setStep={setStep}
            setToken={setToken}
          />
        )}

        {step === "otp" && <OtpStep setStep={setStep} token={token} />}

        {step === "reset" && (
          <ResetPasswordStep setStep={setStep} token={token} />
        )}
      </div>
    </div>
  );
}
