"use client";

import { useState } from "react";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  setStep: (step: "email" | "otp" | "reset") => void;
}

export default function ResetPassword({ token, setStep }: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return addToast({ title: "Fill all fields", color: "danger" });
    if (newPassword !== confirmPassword)
      return addToast({ title: "Passwords do not match", color: "danger" });
    if (!token) return addToast({ title: "Missing token", color: "danger" });

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationToken: token,
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset password failed");

      router.replace("/auth/login");

      addToast({ title: "Password reset successful", color: "success" });
    } catch (err: any) {
      addToast({
        title: err.message || "Error resetting password",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Retype New Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <LoadingButton loading={loading} onClick={handleResetPassword}>
        Reset Password
      </LoadingButton>
    </>
  );
}
