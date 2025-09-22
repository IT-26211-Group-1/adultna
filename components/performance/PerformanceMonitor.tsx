"use client";

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Only in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const name = entry.name;
        const value = Math.round(entry.value);

        console.group(`🚀 Performance: ${name}`);
        console.log(`Value: ${value}ms`);

        // Warn if metrics are poor
        if (name === 'LCP' && value > 2500) {
          console.warn('❌ LCP is poor (>2.5s)');
        } else if (name === 'FID' && value > 100) {
          console.warn('❌ FID is poor (>100ms)');
        } else if (name === 'CLS' && value > 0.1) {
          console.warn('❌ CLS is poor (>0.1)');
        } else {
          console.log('✅ Good performance');
        }
        console.groupEnd();
      }
    });

    // Observe LCP, FID, CLS
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Fallback for older browsers
      console.log('Performance monitoring not supported');
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}