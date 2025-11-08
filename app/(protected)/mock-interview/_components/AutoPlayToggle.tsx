"use client";

import React, { memo } from "react";

type AutoPlayToggleProps = {
  isMuted: boolean;
  onToggle: () => void;
  isReady?: boolean;
};

export const AutoPlayToggle = memo(function AutoPlayToggle({
  isMuted,
  onToggle,
  isReady = true,
}: AutoPlayToggleProps) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isMuted
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
          : "bg-adult-green/10 text-adult-green hover:bg-adult-green/20"
      }`}
      disabled={!isReady}
      title={isMuted ? "Enable auto-play" : "Disable auto-play"}
      onClick={onToggle}
    >
      {!isReady ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          <span className="text-sm font-medium">Loading...</span>
        </>
      ) : isMuted ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Muted
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Auto-play
        </>
      )}
    </button>
  );
});
