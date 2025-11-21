"use client";

import { useGoogleCallback } from "@/hooks/useGoogleCallback";
import { AuthLoading } from "./AuthLoading";

export const GoogleCallbackClient = () => {
  useGoogleCallback();

  return <AuthLoading />;
};
