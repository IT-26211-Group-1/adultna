"use client";

import { Button, Input, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useAdminLogin } from "@/hooks/queries/admin/useAdminLogin";

export const AdminLoginForm = () => {
  const { register, errors, loading, onSubmit } = useAdminLogin();

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#F1F8F5] overflow-hidden m-0 p-0">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-none border border-white/20">
        <CardBody className="p-8 space-y-6">
          <div className="flex justify-center mb-4">
            <Image
              alt="AdultNa Logo"
              className="object-contain"
              height={80}
              src="/AdultNa-Logo.png"
              width={200}
            />
          </div>
          <p className="text-center text-gray-600 text-sm">
            Hello there! Please log-in with your admin account to continue.
          </p>

          <form className="space-y-6" onSubmit={onSubmit}>
            {/* Email */}
            <div>
              <Input
                {...register("email")}
                classNames={{
                  input: "focus:ring-adult-green",
                  inputWrapper:
                    "border-1 border-gray-400 focus-within:border-adult-green rounded-md",
                }}
                placeholder="Email Address"
                size="lg"
                type="email"
                variant="bordered"
              />
              {errors.email?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("password")}
                classNames={{
                  input: "focus:ring-adult-green",
                  inputWrapper:
                    "border-1 border-gray-400 focus-within:border-adult-green rounded-md",
                }}
                placeholder="Password"
                size="lg"
                type="password"
                variant="bordered"
              />
              <div className="flex justify-between items-center mt-2">
                <div>
                  {errors.password?.message && (
                    <p className="text-sm text-red-500">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <Link
                  className="text-sm text-adult-green hover:text-adult-green/80 transition-colors font-medium"
                  href="/admin/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              className="w-full bg-adult-green text-white hover:bg-adult-green/90"
              disableAnimation
              isLoading={loading}
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
