"use client";

import { useEffect, useState, useMemo, useCallback } from "react";

interface DateDisplayProps {
  format?: "full" | "date" | "time" | "datetime" | "relative";
  className?: string;
  showIcon?: boolean;
  date?: Date;
  updateInterval?: number;
}

export function DateDisplay({
  format = "datetime",
  className = "",
  showIcon = false,
  date,
  updateInterval,
}: DateDisplayProps) {
  const [currentDate, setCurrentDate] = useState<Date>(date || new Date());

  const getRelativeTime = useCallback((d: Date): string => {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formattedDate = useMemo(() => {
    switch (format) {
      case "full":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "date":
        return currentDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      case "time":
        return currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "datetime":
        return currentDate.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "relative":
        return getRelativeTime(currentDate);
      default:
        return currentDate.toLocaleString();
    }
  }, [currentDate, format, getRelativeTime]);

  useEffect(() => {
    if (!date && updateInterval) {
      const interval = setInterval(() => {
        setCurrentDate(new Date());
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [date, updateInterval]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span>{formattedDate}</span>
    </div>
  );
}
