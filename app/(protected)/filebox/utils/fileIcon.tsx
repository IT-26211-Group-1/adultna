"use client";

import { FileIcon } from "lucide-react";

export type FileIconSize = "small" | "medium" | "large";

type FileType = "pdf" | "doc" | "docx" | "jpg" | "png" | string;

const sizeClasses: Record<FileIconSize, string> = {
  small: "w-8 h-8",
  medium: "w-12 h-12",
  large: "w-16 h-16"
};

const iconSizeClasses: Record<FileIconSize, string> = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8"
};

export const getFileIcon = (type: FileType, size: FileIconSize = "small") => {
  const containerClasses = sizeClasses[size];
  const iconClasses = iconSizeClasses[size];

  switch (type) {
    case "pdf":
      return (
        <div className={`${containerClasses} bg-red-100 rounded-lg flex items-center justify-center`}>
          <svg className={`${iconClasses} text-red-600`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      );
    case "doc":
    case "docx":
      return (
        <div className={`${containerClasses} bg-blue-100 rounded-lg flex items-center justify-center`}>
          <svg className={`${iconClasses} text-blue-600`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      );
    case "jpg":
    case "png":
      return (
        <div className={`${containerClasses} bg-green-100 rounded-lg flex items-center justify-center`}>
          <svg className={`${iconClasses} text-green-600`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,7V4H5V7H19M16,19H8V16H16M19,15H5V12H19M19,11H5V8H19V11Z" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${containerClasses} bg-gray-100 rounded-lg flex items-center justify-center`}>
          <FileIcon size={size === "small" ? 16 : size === "medium" ? 24 : 32} className="text-gray-600" />
        </div>
      );
  }
};