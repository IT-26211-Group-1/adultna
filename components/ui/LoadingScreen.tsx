"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Progress } from "@heroui/react";
import { logger } from "@/lib/logger";

type LoadingScreenProps = {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
};

export function LoadingScreen({
  isVisible,
  message = "Loading your roadmap...",
  onComplete,
  autoHide = false,
  duration = 3000,
}: LoadingScreenProps) {
  const [animationData, setAnimationData] = useState(null);
  const [show, setShow] = useState(isVisible);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load the Lottie animation file
    fetch("/roadmap-loading.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => logger.error("Error loading animation:", error));
  }, []);

  useEffect(() => {
    setShow(isVisible);

    if (isVisible) {
      // Reset progress when loading starts
      setProgress(0);

      // Simulate progress animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);

            return 90; // Stay at 90% until actual loading completes
          }

          return prev + Math.random() * 15 + 5; // Random increments
        });
      }, 200);

      return () => clearInterval(progressInterval);
    } else {
      // Complete the progress when loading finishes
      setProgress(100);
      setTimeout(() => setProgress(0), 500); // Reset after a brief moment
    }

    if (isVisible && autoHide && duration) {
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-6">
        {/* Lottie Animation */}
        <div className="w-48 h-48 md:w-64 md:h-64">
          {animationData && (
            <Lottie
              animationData={animationData}
              autoplay={true}
              loop={true}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        {/* Loading Message */}
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900 font-playfair mb-4">
            {message}
          </p>
          {/* Progress Bar */}
          <Progress
            className="w-64"
            classNames={{
              track: "bg-gray-200",
              indicator: "bg-adult-green",
            }}
            color="success"
            size="sm"
            value={progress}
          />
        </div>
      </div>
    </div>
  );
}
