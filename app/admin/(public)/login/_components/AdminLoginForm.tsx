"use client";

import { LoadingButton } from "@/components/ui/Button";
import Link from "next/link";
import { useAdminLogin } from "@/hooks/queries/admin/useAdminLogin";

export const AdminLoginForm = () => {
  const { register, errors, loading, onSubmit } = useAdminLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F1F8F5] px-4">
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        onSubmit={onSubmit}
      >
        {/* Change font */}
        <h1 className="text-6xl font-bold text-center font-songmyung text-adult-green">
          AdultNa.
        </h1>
        <p className="text-center text-gray-600 text-sm">
          Hello there! Please log-in with your admin account to continue.
        </p>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
            placeholder="Email Address"
            type="email"
          />
          <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <input
            {...register("password")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
            placeholder="Password"
            type="password"
          />

          <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p>
        </div>

        <div className="text-center">
          <Link
            className="text-sm text-adult-green hover:underline"
            href="/admin/forgot-password"
          >
            Forgot Your Password?
          </Link>
        </div>

        <LoadingButton loading={loading} type="submit">
          Login
        </LoadingButton>
      </form>
    </div>
  );
};
