"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useFormSubmit } from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/Button";
import Link from "next/link";
import { LoginResponse } from "@/types/auth";

export const AdminLoginForm = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1F8F5] px-4">
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        // onSubmit={handleSubmit(onSubmit)}
      >
        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center text-[#11553F]">
          AdultNa.
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Hello there! Please log-in with your admin account to continue.
        </p>

        {/* Email */}
        <div>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#11553F]"
            placeholder="Email Address"
            type="email"
          />
          {/* <p className="text-sm text-red-500 mt-1">
            {errors.email?.message}
          </p> */}
        </div>

        <div>
          <input
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#11553F]"
            placeholder="Password"
            type="password"
          />
          {/* <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p> */}
        </div>

        <div className="text-center">
          <Link
            className="text-sm text-[#11553F] hover:underline"
            href="/admin/forgot-password"
          >
            Forgot Your Password?
          </Link>
        </div>

        {/* Submit */}
        {/* <LoadingButton
          loading={loading}
          type="submit"
          className="w-full bg-[#11553F] text-white py-2 rounded-md hover:bg-[#0d3f2f] transition-colors"
        >
          Login
        </LoadingButton> */}
      </form>
    </div>
  );
};
