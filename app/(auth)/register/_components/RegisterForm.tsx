"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { apiFetch } from "@/utils/api";
import { RegisterPayload } from "@/types/auth";
import ReCAPTCHA from "react-google-recaptcha";

export const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema> & { emailVerified?: boolean }>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaToken(token);
    } else {
      setCaptchaToken(null);
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);

    if (!captchaToken) {
      addToast({
        title: "Please verify captcha before submitting",
        color: "warning",
        timeout: 5000,
      });
      setLoading(false);

      return;
    }

    try {
      const response = await apiFetch<RegisterPayload>(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token: captchaToken }),
      });

      if (!response.success) {
        addToast({
          title: response.message || "Registration Failed",
          color: "danger",
          timeout: 5000,
        });
        setLoading(false);

        return;
      }
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);

      // Registration success
      addToast({
        title: "Registration Successful!",
        color: "success",
      });
    } catch {
      setError("Please try again.");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              {...register("firstName")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
            />
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex-1">
            <input
              {...register("lastName")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
            />
            <p className="text-sm text-red-500 mt-1">
              {errors.lastName?.message}
            </p>
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
          />
          <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <input
            {...register("confirmPassword")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            type="password"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* Accepted Terms */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("acceptedTerms")}
            className="w-4 h-4"
            id="acceptedTerms"
          />
          <label className="text-sm" htmlFor="acceptedTerms">
            I accept the terms and conditions
          </label>
        </div>
        <p className="text-sm text-red-500 mt-1">
          {errors.acceptedTerms?.message}
        </p>

        {/* reCAPTCHA */}
        <div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
        </div>

        {/* Submit Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {/* Loading animation */}
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
          <span>Register</span>
        </button>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};
