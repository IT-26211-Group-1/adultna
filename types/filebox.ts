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

export type FileMetadata = {
  id: string;
  fileName: string;
  category: FileCategory;
  contentType: string;
  fileSize: number;
  fileSizeMB: number;
  uploadDate: string;
  lastModified: string;
  isSecure: boolean;
}

export type UserQuota = {
  userId: string;
  usedStorageBytes: number;
  usedStorageMB: number;
  maxStorageBytes: number;
  maxStorageMB: number;
  remainingStorageBytes: number;
  remainingStorageMB: number;
  percentageUsed: number;
  isQuotaExceeded: boolean;
  fileCount: number;
}

// API Response types
export type UploadUrlResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    uploadUrl: string;
    fileId: string;
    fileKey: string;
    expiresIn: number;
    duplicateFileId?: string;
    duplicateFileName?: string;
  };
}

export type DownloadUrlResponse = {
  success: boolean;
  message: string;
  data: {
    downloadUrl: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    expiresIn: number;
  };
}

export type ListFilesResponse = {
  success: boolean;
  message: string;
  data: {
    files: FileMetadata[];
    totalFiles: number;
    totalStorageBytes: number;
    totalStorageMB: number;
  };
}

export type DeleteFileResponse = {
  success: boolean;
  message: string;
}

export type QuotaResponse = {
  success: boolean;
  message: string;
  data: UserQuota;
}

// Request types
export type GenerateUploadUrlRequest = {
  fileName: string;
  category: FileCategory;
  contentType: string;
  fileSize: number;
  isSecure?: boolean;
  replaceDuplicate?: boolean;
  keepBoth?: boolean;
}

export type ListFilesRequest = {
  category?: FileCategory;
}

// Document OTP types
export type OTPAction = "preview" | "download" | "delete";

export type RequestDocumentOTPRequest = {
  action?: OTPAction;
}

export type RequestDocumentOTPResponse = {
  success: boolean;
  message: string;
}

export type VerifyDocumentOTPRequest = {
  otp: string;
  action?: OTPAction;
}

export type VerifyDocumentOTPResponse = {
  success: boolean;
  message: string;
  downloadUrl?: string;
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
  contentType: string,
): "pdf" | "doc" | "docx" | "jpg" | "png" {
  const typeMap: Record<string, "pdf" | "doc" | "docx" | "jpg" | "png"> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
  };

  return typeMap[contentType] || "pdf";
}
