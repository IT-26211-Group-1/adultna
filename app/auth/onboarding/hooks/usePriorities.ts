"use client";

import { useState, useEffect, useCallback } from "react";
import { Question } from "@/types/onboarding";

interface Priority {
  questionId: number;
  optionId: number;
}

export function usePriorities() {
  const [prioritiesQuestion, setPrioritiesQuestion] = useState<Question | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get cookie value by name
  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }

    return null;
  };

  const fetchPrioritiesQuestion = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      setLoading(true);
      setError(null);

      // Get access token from cookies
      const accessToken = getCookie("access_token");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ONBOARDING_SERVICE_URL}/onboarding/view`,
        {
          headers,
          credentials: "include",
          signal: controller.signal,
        },
      );

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      console.log("Onboarding view response:", data);

      if (data.success) {
        const questionsArray = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.data?.data)
            ? data.data.data
            : [];

        const question = questionsArray.find(
          (q: Question) => q.category === "Priorities",
        );

        if (question) {
          setPrioritiesQuestion(question);
        } else {
          setError("No priorities question found.");
          console.error("No priorities question found in:", questionsArray);
        }
      } else {
        setError(data.message || "Failed to fetch priorities.");
      }
    } catch (err: any) {
      console.error("Error fetching priorities:", err);

      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        setError("Authentication required. Please login again.");
        // Redirect to login if unauthorized
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      } else {
        setError("Error fetching priorities. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePriority = useCallback(
    (
      questionId: number,
      optionId: number,
      selectedPriorities: Priority[],
      setSelectedPriorities: React.Dispatch<React.SetStateAction<Priority[]>>,
    ) => {
      setSelectedPriorities((prev) => {
        const exists = prev.some(
          (p) => p.questionId === questionId && p.optionId === optionId,
        );

        if (exists) {
          return prev.filter(
            (p) => !(p.questionId === questionId && p.optionId === optionId),
          );
        }

        return [...prev, { questionId, optionId }];
      });
    },
    [],
  );

  useEffect(() => {
    fetchPrioritiesQuestion();
  }, []);

  return {
    prioritiesQuestion,
    loading,
    error,
    togglePriority,
    refetch: fetchPrioritiesQuestion,
  };
}
