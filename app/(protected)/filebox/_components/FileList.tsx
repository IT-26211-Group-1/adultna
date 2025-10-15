"use client";

import { FileActions } from "./FileActions";
import { FileItem } from "./FileItem";

interface FileListProps {
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
}

export function FileList({ files, onFileClick }: FileListProps) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {/* Left Section - File Details */}
          <div
            className="flex items-center space-x-4 flex-1 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => onFileClick?.(file)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFileClick?.(file);
              }
            }}
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">{file.category}</p>
            </div>
          </div>

          {/* Middle Section - File Info */}
          <div className="hidden md:flex items-center space-x-8 text-sm text-gray-500">
            <span>{file.size}</span>
            <span>Uploaded: {file.uploadDate}</span>
            <span>Last accessed: {file.lastAccessed}</span>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center">
            <FileActions file={file} viewType="list" />
          </div>
        </div>
      ))}
    </div>
  );
}
