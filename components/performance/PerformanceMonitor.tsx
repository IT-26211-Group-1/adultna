"use client";

import { logger } from "@/lib/logger";
import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Only in development
    if (process.env.NODE_ENV !== "development") return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        let name = entry.name;
        let value: number | undefined;

        if (entry.entryType === "largest-contentful-paint") {
          name = "LCP";
          value = Math.round(
            (entry as PerformanceEntry & { startTime: number }).startTime,
          );
        } else if (entry.entryType === "first-input") {
          name = "FID";
          value = Math.round(
            (entry as PerformanceEventTiming).processingStart -
              (entry as PerformanceEventTiming).startTime,
          );
        } else if (entry.entryType === "layout-shift") {
          name = "CLS";
          value = Number((entry as PerformanceEntry & { value: number }).value);
        }

        logger.group(`🚀 Performance: ${name}`);
        logger.log(`Value: ${value}${name === "CLS" ? "" : "ms"}`);

        // Warn if metrics are poor
        if (name === "LCP" && value !== undefined && value > 2500) {
          logger.warn("❌ LCP is poor (>2.5s)");
        } else if (name === "FID" && value !== undefined && value > 100) {
          logger.warn("❌ FID is poor (>100ms)");
        } else if (name === "CLS" && value !== undefined && value > 0.1) {
          logger.warn("❌ CLS is poor (>0.1)");
        } else {
          logger.log("✅ Good performance");
        }
        logger.groupEnd();
      }
    });

    // Observe LCP, FID, CLS
    try {
      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    } catch {
      // Fallback for older browsers
      logger.log("Performance monitoring not supported");
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}
