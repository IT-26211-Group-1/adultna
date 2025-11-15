"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { UserAuthTitle } from "../../../register/_components/UserAuthTitle";
import { AuthButton } from "../../../register/_components/AuthButton";
import { ImageContainer } from "../../../register/_components/ImageContainer";
import { logger } from "@/lib/logger";

export const GoogleAuthorizePage = () => {
  const router = useRouter();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const code = sessionStorage.getItem("google_oauth_code");
    const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

    if (!code || !codeVerifier) {
      addToast({
        title: "Session Expired",
        description: "Please try signing up again",
        color: "danger",
      });
      router.replace("/auth/register");

      return;
    }

    setIsReady(true);
  }, [router]);

  const handleAuthorize = async () => {
    setIsAuthorizing(true);

    const code = sessionStorage.getItem("google_oauth_code");
    const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/auth/google/callback?mode=register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            code,
            codeVerifier,
          }),
        },
      );

      const data = await response.json();

      sessionStorage.removeItem("google_oauth_code");
      sessionStorage.removeItem("oauth_mode");

      if (data.success) {
        addToast({
          title: "Account Created",
          description: "Welcome to AdultNa!",
          color: "success",
        });

        setTimeout(() => {
          router.replace("/auth/onboarding");
        }, 300);
      } else {
        addToast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          color: "danger",
        });
        router.replace("/auth/register");
      }
    } catch (error) {
      logger.error("Authorization error:", error);
      addToast({
        title: "Error",
        description: "Failed to create account",
        color: "danger",
      });
      router.replace("/auth/register");
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem("google_oauth_code");
    sessionStorage.removeItem("pkce_code_verifier");
    sessionStorage.removeItem("oauth_mode");
    router.replace("/auth/register");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <LoadingSpinner fullScreen={false} size="lg" variant="default" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Authorization */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <UserAuthTitle
            subtitle="Review the permissions before creating your account"
            title="Authorize AdultNa"
          />

          <div className="space-y-6">
            {/* Google Account Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                Creating account with your Google account
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Google OAuth</p>
                  <p className="text-sm text-gray-600">
                    Your email and profile will be retrieved
                  </p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">
                AdultNa will be able to:
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">
                      Access your email address
                    </p>
                    <p className="text-sm text-gray-600">
                      Used for account identification and communication
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">
                      Access your basic profile info
                    </p>
                    <p className="text-sm text-gray-600">
                      Name and profile picture for personalization
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong className="text-gray-900">Privacy:</strong> We will
                never share your personal information without your consent. You
                can revoke access anytime.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <AuthButton
                loading={isAuthorizing}
                type="button"
                onClick={handleAuthorize}
              >
                {isAuthorizing ? "Creating Account..." : "Authorize & Continue"}
              </AuthButton>

              <button
                className="w-full py-3 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAuthorizing}
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer />
    </div>
  );
};
