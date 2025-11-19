"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface IdleWarningModalProps {
  open: boolean;
  onStayActive: () => void;
  onLogout: () => void;
  countdownSeconds?: number;
}

export const IdleWarningModal = ({
  open,
  onStayActive,
  onLogout,
  countdownSeconds = 120, // 2 minutes default
}: IdleWarningModalProps) => {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds);

  useEffect(() => {
    if (!open) {
      setTimeLeft(countdownSeconds);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdownSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Modal open={open} onClose={onStayActive} title="Are you still there?" size="sm">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          You've been inactive for a while. For your security, you will be automatically
          logged out in:
        </p>

        <div className="flex justify-center">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg px-6 py-4">
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 text-center tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={onStayActive}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
          >
            Stay Logged In
          </Button>
          <Button
            onClick={onLogout}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            Logout Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
