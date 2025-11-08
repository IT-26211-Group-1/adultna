"use client";

import { useEffect, useRef } from "react";

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes of inactivity

const ACTIVITY_EVENTS = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];

export function useIdleTimeout(onIdle: () => void, enabled: boolean = true) {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetIdleTimer = () => {
    lastActivityRef.current = Date.now();

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    if (enabled) {
      idleTimerRef.current = setTimeout(() => {
        const idleTime = Date.now() - lastActivityRef.current;

        if (idleTime >= IDLE_TIMEOUT) {
          onIdle();
        }
      }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!enabled) {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

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
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [enabled, onIdle]);

  return { resetIdleTimer };
}
