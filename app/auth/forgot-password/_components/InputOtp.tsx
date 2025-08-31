"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/react";

interface Props {
  token: string;
  setStep: (step: "email" | "otp" | "reset") => void;
}

export default function InputOtp({ token, setStep }: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) return addToast({ title: "Enter OTP", color: "danger" });
    if (!token) return addToast({ title: "Missing token", color: "danger" });

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, verificationToken: token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      setStep("reset");
      addToast({ title: "OTP verified", color: "success" });
    } catch (err: any) {
      addToast({
        title: err.message || "OTP verification failed",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <LoadingButton loading={loading} onClick={handleVerifyOtp}>
        Verify OTP
      </LoadingButton>
    </>
  );
}
