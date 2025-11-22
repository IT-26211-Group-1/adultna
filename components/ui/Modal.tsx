"use client";

import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null;

  const sizeClass =
    size === "xs"
      ? "max-w-sm"
      : size === "sm"
        ? "max-w-md"
        : size === "lg"
          ? "max-w-3xl"
          : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-4">
      <div
        aria-hidden
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className={`relative w-full ${sizeClass} mx-4 my-auto`}>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-h-[90vh] flex flex-col">
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
            <div>
              {title && <h3 className="text-xl font-semibold">{title}</h3>}
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            <button
              aria-label="close"
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
              onClick={onClose}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>

          <div className="overflow-y-auto p-6 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
