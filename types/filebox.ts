/**
 * FileBox API Types
 * Types for the filebox service API responses and requests
 */

// File categories matching backend enum
export type FileCategory =
  | "government-id"
  | "employment"
  | "education"
  | "financial"
  | "healthcare"
  | "legal"
  | "other";

// Mapping frontend categories to backend categories
export const CATEGORY_MAPPING: Record<string, FileCategory> = {
  "Government Documents": "government-id",
  Education: "education",
  Career: "employment",
  Medical: "healthcare",
  Personal: "other",
} as const;

// Reverse mapping for display
export const DISPLAY_CATEGORY_MAPPING: Record<FileCategory, string> = {
  "government-id": "Government Documents",
  employment: "Career",
  education: "Education",
  financial: "Personal",
  healthcare: "Medical",
  legal: "Personal",
  other: "Personal",
} as const;

export interface FileMetadata {
  id: string;
  fileName: string;
  category: FileCategory;
  mimeType: string;
  fileSize: number;
  uploadDate: string;
  lastModified: string;
  contentType: string;
}

export interface UserQuota {
  usedBytes: number;
  maxBytes: number;
  usedPercentage: number;
  remainingBytes: number;
  fileCount: number;
  maxFileSize: number;
}

// API Response types
export interface UploadUrlResponse {
  success: boolean;
  message: string;
  data: {
    uploadUrl: string;
    fileId: string;
    expiresAt: string;
  };
}

export interface DownloadUrlResponse {
  success: boolean;
  message: string;
  data: {
    downloadUrl: string;
    fileName: string;
    expiresAt: string;
  };
}

export interface ListFilesResponse {
  success: boolean;
  message: string;
  data: {
    files: FileMetadata[];
  };
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

export interface QuotaResponse {
  success: boolean;
  message: string;
  data: UserQuota;
}

// Request types
export interface GenerateUploadUrlRequest {
  fileName: string;
  category: FileCategory;
  contentType: string;
  fileSize: number;
}

export interface ListFilesRequest {
  category?: FileCategory;
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Helper function to get file extension
export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");

  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

// Helper function to get file type for icon display
export function getFileType(
  mimeType: string
): "pdf" | "doc" | "docx" | "jpg" | "png" {
  const typeMap: Record<string, "pdf" | "doc" | "docx" | "jpg" | "png"> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/jpeg": "jpg",
    "image/png": "png",
  };

  return typeMap[mimeType] || "pdf";
}
