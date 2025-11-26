"use client";

import React, { memo, useCallback } from "react";
import { FileItem } from "./FileItem";
import { getFileIcon } from "@/utils/fileIcon";

type RecentFilesProps = {
  files: FileItem[];
  selectedRecentFile?: FileItem | null;
  onFileClick?: (file: FileItem) => void;
  onFileDoubleClick?: (file: FileItem) => void;
};

type FileCardProps = {
  file: FileItem;
  selectedRecentFile?: FileItem | null;
  onFileClick?: (file: FileItem) => void;
  onFileDoubleClick?: (file: FileItem) => void;
};

const FileCard = memo(
  ({
    file,
    selectedRecentFile,
    onFileClick,
    onFileDoubleClick,
  }: FileCardProps) => {
    const handleClick = useCallback(() => {
      onFileClick?.(file);
    }, [file, onFileClick]);

    const handleDoubleClick = useCallback(() => {
      onFileDoubleClick?.(file);
    }, [file, onFileDoubleClick]);

    const isSelected = selectedRecentFile?.id === file.id;

    return (
      <div
        className={`rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] transition-colors cursor-pointer group border-2 ${
          isSelected
            ? "bg-blue-100 border-transparent"
            : "bg-gray-50 hover:bg-gray-100 border-transparent"
        }`}
        data-file-item="true"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="mb-3">{getFileIcon(file.type, "small")}</div>

        <div className="text-sm text-gray-700 text-center font-medium truncate w-full">
          {file.name}
        </div>

        <div className="text-xs text-gray-500 mt-1">{file.category}</div>

        <div className="text-xs text-gray-400 mt-2">{file.size}</div>
      </div>
    );
  },
);

FileCard.displayName = "FileCard";

export const RecentFiles = memo(
  ({
    files,
    selectedRecentFile,
    onFileClick,
    onFileDoubleClick,
  }: RecentFilesProps) => {
    return (
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.slice(0, 4).map((file) => (
            <FileCard
              key={file.id}
              file={file}
              selectedRecentFile={selectedRecentFile}
              onFileClick={onFileClick}
              onFileDoubleClick={onFileDoubleClick}
            />
          ))}
        </div>
      </div>
    );
  },
);

RecentFiles.displayName = "RecentFiles";
