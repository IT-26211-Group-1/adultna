"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await res.json()) as {
        success: boolean;
        message?: string;
        needsVerification?: boolean;
        verificationToken?: string;
      };

      // Email not verified
      if (result.needsVerification) {
        localStorage.setItem("verificationToken", result.verificationToken!);

        addToast({
          title: "Email not verified",
          description: "Check your inbox for the OTP",
          color: "warning",
          timeout: 5000,
        });

        router.push("/verify-email");
        return;
      }

      // Login failed
      if (!result.success) {
        addToast({
          title: result.message || "Login failed",
          color: "danger",
          timeout: 5000,
        });
        setLoading(false);
        return;
      }

      // Success
      addToast({ title: "Login Successful!", color: "success", timeout: 3000 });
      router.push("/dashboard");
    } catch {
      addToast({ title: "Network error. Please try again.", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <div>
          <input
            {...register("email")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...register("password")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60 flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading && (
            <svg
              className="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                fill="currentColor"
              />
            </svg>
          )}
          <span>Login</span>
        </button>
      </form>
    </div>
  );
}
