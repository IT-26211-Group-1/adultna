"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { addToast } from "@heroui/react";

// Types
export type ForgotPasswordSendOtpRequest = {
  email: string;
};

export type ForgotPasswordSendOtpResponse = {
  success: boolean;
  message: string;
  verificationToken: string;
};

export type ForgotPasswordVerifyOtpRequest = {
  otp: string;
  verificationToken: string;
};

export type ForgotPasswordVerifyOtpResponse = {
  success: boolean;
  message: string;
};

export type ForgotPasswordResetRequest = {
  verificationToken: string;
  password: string;
};

export type ForgotPasswordResetResponse = {
  success: boolean;
  message: string;
};

// API Functions
const forgotPasswordApi = {
  sendOtp: (
    data: ForgotPasswordSendOtpRequest,
  ): Promise<ForgotPasswordSendOtpResponse> =>
    ApiClient.post("/auth/forgot-password/send-otp", data),

  verifyOtp: (
    data: ForgotPasswordVerifyOtpRequest,
  ): Promise<ForgotPasswordVerifyOtpResponse> =>
    ApiClient.post("/auth/forgot-password/verify-otp", data),

  resetPassword: (
    data: ForgotPasswordResetRequest,
  ): Promise<ForgotPasswordResetResponse> =>
    ApiClient.post("/auth/forgot-password/reset", data),
};

// Query Hooks
export function useForgotPasswordFlow() {
  const { setSecureItem, getSecureItem, removeSecureItem } = useSecureStorage();

  // Send OTP Mutation
  const sendOtpMutation = useMutation({
    mutationFn: forgotPasswordApi.sendOtp,
    onSuccess: (data, variables) => {
      if (data.success) {
        addToast({
          title: "OTP sent to your email",
          color: "success",
        });

        // Store email and move to OTP step
        setSecureItem("forgotPasswordEmail", variables.email, 60); // 1 hour
        setSecureItem("forgotPasswordStep", "otp", 60); // 1 hour
        if (data.verificationToken) {
          setSecureItem("forgotPasswordToken", data.verificationToken, 60); // 1 hour
        } else {
          setSecureItem("forgotPasswordToken", "placeholder", 60); // 1 hour
        }
      }
    },
    onError: (error: any) => {
      addToast({
        title: "Error sending OTP",
        description: error?.message || "Failed to send OTP",
        color: "danger",
      });
    },
  });

  // Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: forgotPasswordApi.verifyOtp,
    onSuccess: (data) => {
      if (data.success) {
        addToast({
          title: "OTP verified successfully",
          color: "success",
        });

        // Move to reset password step
        setSecureItem("forgotPasswordStep", "reset", 60); // 1 hour
      }
    },
    onError: (error: any) => {
      addToast({
        title: "OTP verification failed",
        description: error?.message || "Please check your code",
        color: "danger",
      });
    },
  });

  // Reset Password Mutation
  const resetPasswordMutation = useMutation({
    mutationFn: forgotPasswordApi.resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        removeSecureItem("forgotPasswordToken");
        removeSecureItem("forgotPasswordEmail");
        removeSecureItem("forgotPasswordStep");
      }
    },
  });

  // Resend OTP
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const email = getSecureItem("forgotPasswordEmail");

      if (!email) {
        throw new Error("No email found for resend");
      }

      return forgotPasswordApi.sendOtp({ email });
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.verificationToken) {
          setSecureItem("forgotPasswordToken", data.verificationToken, 60); // 1 hour
        }
      }
    },
  });

  // Helper functions
  const getStoredEmail = () => getSecureItem("forgotPasswordEmail");
  const getStoredToken = () => getSecureItem("forgotPasswordToken");
  const getStoredStep = () =>
    getSecureItem("forgotPasswordStep") as "email" | "otp" | "reset" | null;

  const clearForgotPasswordData = () => {
    removeSecureItem("forgotPasswordToken");
    removeSecureItem("forgotPasswordEmail");
    removeSecureItem("forgotPasswordStep");
  };

  return {
    // Mutations
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendOtp: resendOtpMutation.mutate,

    // Loading states
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isResendingOtp: resendOtpMutation.isPending,

    // Errors
    sendOtpError: sendOtpMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resendOtpError: resendOtpMutation.error,

    // Success data
    sendOtpData: sendOtpMutation.data,
    verifyOtpData: verifyOtpMutation.data,
    resetPasswordData: resetPasswordMutation.data,
    resendOtpData: resendOtpMutation.data,

    // Helper functions
    getStoredEmail,
    getStoredToken,
    getStoredStep,
    clearForgotPasswordData,

    // Reset functions for cleanup
    resetSendOtp: sendOtpMutation.reset,
    resetVerifyOtp: verifyOtpMutation.reset,
    resetResetPassword: resetPasswordMutation.reset,
    resetResendOtp: resendOtpMutation.reset,
  };
}
