"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/react";

interface Props {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: "email" | "otp" | "reset") => void;
  setToken: (token: string) => void;
}

export default function InputEmail({
  email,
  setEmail,
  setStep,
  setToken,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) return addToast({ title: "Enter your email", color: "danger" });

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setToken(data.verificationToken);
      setStep("otp");
      addToast({ title: "OTP sent to your email", color: "success" });
    } catch (err: any) {
      addToast({ title: err.message || "Error sending OTP", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <LoadingButton loading={loading} onClick={handleSendEmail}>
        Send OTP
      </LoadingButton>
    </>
  );
}
