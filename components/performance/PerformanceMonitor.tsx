"use client";

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
            (entry as PerformanceEntry & { startTime: number }).startTime
          );
        } else if (entry.entryType === "first-input") {
          name = "FID";
          value = Math.round(
            (entry as PerformanceEventTiming).processingStart -
              (entry as PerformanceEventTiming).startTime
          );
        } else if (entry.entryType === "layout-shift") {
          name = "CLS";
          value = Number((entry as PerformanceEntry & { value: number }).value);
        }

        console.group(`🚀 Performance: ${name}`);
        console.log(`Value: ${value}${name === "CLS" ? "" : "ms"}`);

        // Warn if metrics are poor
        if (name === "LCP" && value !== undefined && value > 2500) {
          console.warn("❌ LCP is poor (>2.5s)");
        } else if (name === "FID" && value !== undefined && value > 100) {
          console.warn("❌ FID is poor (>100ms)");
        } else if (name === "CLS" && value !== undefined && value > 0.1) {
          console.warn("❌ CLS is poor (>0.1)");
        } else {
          console.log("✅ Good performance");
        }
        console.groupEnd();
      }
    });

    // Observe LCP, FID, CLS
    try {
      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    } catch (e) {
      // Fallback for older browsers
      console.log("Performance monitoring not supported");
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}
