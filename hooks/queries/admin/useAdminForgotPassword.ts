"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { addToast } from "@heroui/toast";

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

const adminForgotPasswordApi = {
  sendOtp: (
    data: ForgotPasswordSendOtpRequest,
  ): Promise<ForgotPasswordSendOtpResponse> =>
    ApiClient.post("/admin/forgot-password/send-otp", data),

  verifyOtp: (
    data: ForgotPasswordVerifyOtpRequest,
  ): Promise<ForgotPasswordVerifyOtpResponse> =>
    ApiClient.post("/admin/forgot-password/verify-otp", data),

  resetPassword: (
    data: ForgotPasswordResetRequest,
  ): Promise<ForgotPasswordResetResponse> =>
    ApiClient.post("/admin/forgot-password/reset", data),
};

export function useAdminForgotPasswordFlow() {
  const { setSecureItem, getSecureItem, removeSecureItem } = useSecureStorage();

  const sendOtpMutation = useMutation({
    mutationFn: adminForgotPasswordApi.sendOtp,
    onSuccess: (data, variables) => {
      if (data.success) {
        addToast({
          title: "OTP sent to your email",
          color: "success",
        });

        setSecureItem("adminForgotPasswordEmail", variables.email, 60);
        setSecureItem("adminForgotPasswordStep", "otp", 60);
        if (data.verificationToken) {
          setSecureItem("adminForgotPasswordToken", data.verificationToken, 60);
        } else {
          setSecureItem("adminForgotPasswordToken", "placeholder", 60);
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

  const verifyOtpMutation = useMutation({
    mutationFn: adminForgotPasswordApi.verifyOtp,
    onSuccess: (data) => {
      if (data.success) {
        addToast({
          title: "OTP verified successfully",
          color: "success",
        });

        setSecureItem("adminForgotPasswordStep", "reset", 60);
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Please check your code";

      addToast({
        title: "OTP verification failed",
        description: errorMessage,
        color: "danger",
      });

      if (
        error?.message?.includes("Maximum OTP attempts exceeded") ||
        error?.status === 403
      ) {
        setTimeout(() => {
          removeSecureItem("adminForgotPasswordToken");
          removeSecureItem("adminForgotPasswordEmail");
          removeSecureItem("adminForgotPasswordStep");
          window.location.href = "/admin/login";
        }, 2000);
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: adminForgotPasswordApi.resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        removeSecureItem("adminForgotPasswordToken");
        removeSecureItem("adminForgotPasswordEmail");
        removeSecureItem("adminForgotPasswordStep");
      }
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      const email = getSecureItem("adminForgotPasswordEmail");

      if (!email) {
        throw new Error("No email found for resend");
      }

      return adminForgotPasswordApi.sendOtp({ email });
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.verificationToken) {
          setSecureItem("adminForgotPasswordToken", data.verificationToken, 60);
        }
      }
    },
  });

  const getStoredEmail = () => getSecureItem("adminForgotPasswordEmail");
  const getStoredToken = () => getSecureItem("adminForgotPasswordToken");
  const getStoredStep = () =>
    getSecureItem("adminForgotPasswordStep") as
      | "email"
      | "otp"
      | "reset"
      | null;

  const clearForgotPasswordData = () => {
    removeSecureItem("adminForgotPasswordToken");
    removeSecureItem("adminForgotPasswordEmail");
    removeSecureItem("adminForgotPasswordStep");
  };

  return {
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendOtp: resendOtpMutation.mutate,

    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isResendingOtp: resendOtpMutation.isPending,

    sendOtpError: sendOtpMutation.error,
    verifyOtpError: verifyOtpMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resendOtpError: resendOtpMutation.error,

    sendOtpData: sendOtpMutation.data,
    verifyOtpData: verifyOtpMutation.data,
    resetPasswordData: resetPasswordMutation.data,
    resendOtpData: resendOtpMutation.data,

    getStoredEmail,
    getStoredToken,
    getStoredStep,
    clearForgotPasswordData,

    resetSendOtp: sendOtpMutation.reset,
    resetVerifyOtp: verifyOtpMutation.reset,
    resetResetPassword: resetPasswordMutation.reset,
    resetResendOtp: resendOtpMutation.reset,
  };
}
