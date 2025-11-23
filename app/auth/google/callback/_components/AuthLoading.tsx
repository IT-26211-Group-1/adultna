"use client";

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const AuthLoading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="flex flex-col items-center justify-center">
      <LoadingSpinner fullScreen={false} size="lg" variant="default" />
      <p className="mt-6 text-gray-600">Completing sign in with Google...</p>
    </div>
  </div>
);
