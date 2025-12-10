"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

// Lazy load Lottie
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="w-48 h-48 animate-pulse bg-gray-200 rounded-lg" />
  ),
});

type ResumeLoadingScreenProps = {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
};

export function ResumeLoadingScreen({
  isVisible,
  message = "Grading your resume...",
}: ResumeLoadingScreenProps) {
  const [animationData, setAnimationData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load the resume-specific Lottie animation file
    fetch("/resume-loading.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => logger.error("Error loading resume animation:", error));
  }, []);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);

            return 90;
          }

          return prev + Math.random() * 15 + 5;
        });
      }, 200);

      return () => clearInterval(progressInterval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Lottie Animation */}
        <div className="w-80 h-80 flex items-center justify-center">
          {animationData ? (
            <Lottie
              animationData={animationData}
              autoplay={true}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-900 mb-6">{message}</p>

          {/* Simple Progress Bar */}
          <div className="w-80 bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
}
