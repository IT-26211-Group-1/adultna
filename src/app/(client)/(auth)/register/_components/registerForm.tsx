"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/validators/auth/registerSchema";
import { useRegister } from "@/hooks/auth/useRegister";
import { z } from "zod";
import { useState } from "react";

export const RegisterForm = () => {
  const { register: registerUser, error } = useRegister();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    await registerUser(data);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(registerUser)}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* First + Last Name */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex-1">
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Register
        </button>
      </form>
    </div>
  );
};
