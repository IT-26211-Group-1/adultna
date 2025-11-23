"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { logger } from "@/lib/logger";

export const useGoogleCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        logger.error("❌ OAuth error parameter:", error);
        addToast({
          title: "Authentication Error",
          description: "Google authentication was cancelled or failed",
          color: "danger",
        });
        router.replace("/auth/login");

        return;
      }

      if (!code) {
        logger.error("❌ No authorization code received");
        addToast({
          title: "Registration Failed",
          color: "danger",
        });
        router.replace("/auth/login");

        return;
      }

      const storedState = sessionStorage.getItem("oauth_state");
      const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

      logger.log("🔍 Retrieved from sessionStorage:", {
        storedState: storedState ? "exists" : "missing",
        codeVerifier: codeVerifier ? "exists" : "missing",
      });

      if (!state || state !== storedState) {
        logger.error("❌ State validation failed:", { state, storedState });
        addToast({
          title: "Security Error",
          description: "Invalid state parameter",
          color: "danger",
        });

        // Clean up before redirect
        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("pkce_code_verifier");
        router.replace("/auth/login");

        return;
      }

      // Clear state after validation
      sessionStorage.removeItem("oauth_state");

      let mode: "login" | "register" = "login";

      try {
        const stateData = JSON.parse(atob(state));

        mode = stateData.mode || "login";
        logger.log("🔍 OAuth mode extracted from state:", mode);
      } catch (error) {
        logger.error("Failed to parse state:", error);
      }

      if (!codeVerifier) {
        logger.error("❌ PKCE verifier not found in sessionStorage");
        addToast({
          title: "Authentication Error",
          description: "PKCE verifier not found",
          color: "danger",
        });
        sessionStorage.removeItem("pkce_code_verifier");
        router.replace("/auth/login");

        return;
      }

      // For registration, redirect to authorization page
      if (mode === "register") {
        logger.log(
          "✅ Registration mode detected - redirecting to authorize page",
        );
        // Store OAuth data for authorization page
        sessionStorage.setItem("google_oauth_code", code);
        // Keep codeVerifier in sessionStorage for authorize page to use
        sessionStorage.setItem("pkce_code_verifier", codeVerifier);

        // Store mode for authorization page
        sessionStorage.setItem("oauth_mode", mode);

        // Redirect to authorization consent page
        router.replace("/auth/google/authorize");

        return;
      }

      // For login mode, clear the codeVerifier after we're done with it
      sessionStorage.removeItem("pkce_code_verifier");

      logger.log("ℹ️ Login mode - proceeding with login flow");

      // For login, proceed with authentication
      try {
        const redirectUri = `${window.location.origin}/auth/google/callback`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/auth/google/callback?mode=${mode}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              code,
              codeVerifier,
              redirectUri,
            }),
          },
        );

        const data = await response.json();

        logger.log("📥 Google OAuth response:", {
          status: response.status,
          success: data.success,
          isNew: data.isNew,
          message: data.message,
          headers: response.headers.get("set-cookie"),
        });

        logger.log("🍪 Checking cookies:", document.cookie);

        if (data.success) {
          addToast({
            title: data.isNew ? "Registration Successful" : "Login Successful",
            description: data.isNew ? "Welcome to AdultNa!" : "Welcome back!",
            color: "success",
          });

          logger.log("✅ Redirecting to:", data.isNew ? "/auth/onboarding" : "/dashboard");

          // Wait longer for cookies to be properly set
          setTimeout(() => {
            logger.log("🍪 Cookies before redirect:", document.cookie);
            if (data.isNew) {
              router.replace("/auth/onboarding");
            } else {
              router.replace("/dashboard");
            }
          }, 1000);
        } else {
          addToast({
            title: "Authentication Failed",
            description: data.message || "Something went wrong",
            color: "danger",
          });
          router.replace("/auth/login");
        }
      } catch (error) {
        logger.error("Google auth error:", error);
        addToast({
          title: "Authentication Error",
          description: "Failed to authenticate with Google",
          color: "danger",
        });
        router.replace("/auth/login");
      }
    };

    processCallback();
  }, [searchParams, router]);
};
