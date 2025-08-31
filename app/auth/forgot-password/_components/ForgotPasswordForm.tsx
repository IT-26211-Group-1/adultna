"use client";

import { useState } from "react";
import EmailStep from "./InputEmail";
import OtpStep from "./InputOtp";
import ResetPasswordStep from "./ResetPassword";

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

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

        {step === "otp" && <OtpStep token={token} setStep={setStep} />}

        {step === "reset" && (
          <ResetPasswordStep token={token} setStep={setStep} />
        )}
      </div>
    </div>
  );
}
