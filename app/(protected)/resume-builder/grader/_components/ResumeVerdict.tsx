"use client";

import { Chip } from "@heroui/react";
import { Target } from "lucide-react";

interface ResumeVerdictProps {
  verdict: string;
  workingWell: string[];
  hasJobDescription?: boolean;
  className?: string;
}

export function ResumeVerdict({
  verdict,
  workingWell,
  hasJobDescription = false,
  className = "",
}: ResumeVerdictProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Verdict Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-300 flex-1" />
          <h3 className="text-lg font-bold text-gray-900">Verdict</h3>
          <div className="h-px bg-gray-300 flex-1" />
          {hasJobDescription && (
            <Chip
              color="secondary"
              size="sm"
              startContent={<Target className="w-3 h-3" />}
              variant="flat"
            >
              Job-Targeted
            </Chip>
          )}
        </div>
        <p className="text-gray-700 leading-relaxed text-center px-4">
          {verdict}
        </p>
      </div>

      {/* What's Working Well Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-300 flex-1" />
          <h3 className="text-lg font-bold text-gray-900">
            What&apos;s Working Well
          </h3>
          <div className="h-px bg-gray-300 flex-1" />
        </div>
        <div className="grid gap-3">
          {workingWell.length > 0 ? (
            workingWell.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-2"
              >
                <span className="text-green-500 text-lg leading-none">✓</span>
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-4">
              Complete more sections to see detailed feedback
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-gray-200">
        <div className="space-y-3 flex flex-col items-center">
          <button
            className="px-8 py-3 bg-adult-green text-white rounded-lg font-medium transition-all duration-200 hover:bg-emerald-700 transform hover:scale-105 active:scale-95 w-full max-w-xs"
            onClick={() => {
              const newUrl = new URL(window.location.href);

              newUrl.searchParams.delete("results");
              newUrl.searchParams.delete("resumeId");
              window.history.replaceState({}, "", newUrl.toString());
              window.location.reload();
            }}
          >
            Grade Another Resume
          </button>
          <button
            className="px-6 py-2 text-gray-600 text-sm transition-all duration-200 hover:text-gray-800 transform hover:scale-105 active:scale-95"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
