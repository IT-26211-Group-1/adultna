"use client";

import { logger } from "@/lib/logger";
import { useCallback, useState, useEffect, useRef } from "react";

const TIMER_KEY = "resend_timer";

export function useResendTimer() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const initialized = useRef(false);

  const checkExistingTimer = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(TIMER_KEY);

      if (!stored) return;

      const timerData = JSON.parse(stored);
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.ceil((timerData.expiresAt - now) / 1000),
      );

      if (remaining > 0) {
        setTimeLeft(remaining);
        setIsActive(true);
      } else {
        sessionStorage.removeItem(TIMER_KEY);
      }
    } catch (error) {
      logger.warn("Failed to parse timer data:", error);
      sessionStorage.removeItem(TIMER_KEY);
    }
  }, []);

  const startTimer = useCallback((seconds: number) => {
    const expiresAt = Date.now() + seconds * 1000;

    setTimeLeft(seconds);
    setIsActive(true);

    try {
      sessionStorage.setItem(TIMER_KEY, JSON.stringify({ expiresAt }));
    } catch (error) {
      logger.warn("Failed to store timer data:", error);
    }
  }, []);

  const stopTimer = useCallback(() => {
    setTimeLeft(0);
    setIsActive(false);
    sessionStorage.removeItem(TIMER_KEY);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, "0")}`
      : `${secs}s`;
  }, []);

  // Initialize timer on first render using ref to avoid re-running
  if (!initialized.current) {
    initialized.current = true;
    checkExistingTimer();
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            setIsActive(false);
            sessionStorage.removeItem(TIMER_KEY);

            return 0;
          }

          const expiresAt = Date.now() + newTime * 1000;

          try {
            sessionStorage.setItem(TIMER_KEY, JSON.stringify({ expiresAt }));
          } catch (error) {
            logger.warn("Failed to update timer data:", error);
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  return {
    timeLeft,
    isActive,
    startTimer,
    stopTimer,
    formatTime,
    canResend: !isActive || timeLeft <= 0,
  };
}
