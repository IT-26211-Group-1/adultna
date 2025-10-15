"use client";

import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";

interface FileDisplayProps {
  viewType: "grid" | "list";
  files: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
  lastAccessed: string;
  type: "pdf" | "jpg" | "doc" | "png" | "docx";
  isSecure?: boolean;
}

export function FileDisplay({ viewType, files }: FileDisplayProps) {
  return (
    <div className="w-full">
      {viewType === "grid" ? (
        <FileGrid files={files} />
      ) : (
        <FileList files={files} />
      )}
    </div>
  );
}
