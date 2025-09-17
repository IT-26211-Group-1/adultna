import React, { Suspense } from "react";
import { RegisterForm } from "./_components/RegisterForm";

const RegisterPageSkeleton = () => (
  <div className="min-h-screen flex">
    <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="hidden lg:block lg:w-1/2 bg-gray-100"></div>
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<RegisterPageSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
