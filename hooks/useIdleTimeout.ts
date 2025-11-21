"use client";

import { useEffect, useRef } from "react";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // Show warning 2 minutes before timeout

const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];

interface UseIdleTimeoutOptions {
  onIdle: () => void;
  onWarning?: () => void;
  enabled?: boolean;
  warningTime?: number; // milliseconds before timeout to show warning
}

export function useIdleTimeout(
  onIdle: (() => void) | UseIdleTimeoutOptions,
  enabled: boolean = true,
) {
  // Support both old and new API
  const options: UseIdleTimeoutOptions =
    typeof onIdle === "function"
      ? { onIdle, enabled }
      : { ...onIdle, enabled: onIdle.enabled ?? true };

  const {
    onIdle: idleCallback,
    onWarning,
    warningTime = WARNING_BEFORE_TIMEOUT,
  } = options;
  const isEnabled =
    typeof onIdle === "function" ? enabled : (options.enabled ?? true);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  const clearAllTimers = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  };

  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;

    clearAllTimers();

    if (isEnabled) {
      // Set warning timer if callback is provided
      if (onWarning && warningTime < IDLE_TIMEOUT) {
        warningTimerRef.current = setTimeout(() => {
          const idleTime = Date.now() - lastActivityRef.current;
          const timeUntilTimeout = IDLE_TIMEOUT - warningTime;

          if (idleTime >= timeUntilTimeout && !warningShownRef.current) {
            warningShownRef.current = true;
            onWarning();
          }
        }, IDLE_TIMEOUT - warningTime);
      }

      // Set idle timeout timer
      idleTimerRef.current = setTimeout(() => {
        const idleTime = Date.now() - lastActivityRef.current;

        if (idleTime >= IDLE_TIMEOUT) {
          idleCallback();
        }
      }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      clearAllTimers();

      return;
    }

    // Set initial timer
    resetIdleTimer();

    // Add activity listeners
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    return () => {
      // Cleanup
      clearAllTimers();

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [isEnabled, idleCallback, onWarning]);

  return { resetIdleTimer };
}
