"use client";

import { useEffect } from "react";

export function HashNavigationHandler() {
  useEffect(() => {
    if (!window.location.hash) return;

    const sectionId = window.location.hash.substring(1);
    let attempts = 0;
    const maxAttempts = 50;

    const scrollToElement = () => {
      const element = document.getElementById(sectionId);

      if (element && element.offsetHeight > 0) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        requestAnimationFrame(scrollToElement);
      }
    };

    requestAnimationFrame(scrollToElement);
  }, []);

  return null;
}
