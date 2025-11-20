"use client";

import React, { memo, useCallback } from "react";
import { FileItem } from "./FileItem";
import { getFileIcon } from "../utils/fileIcon";

type RecentFilesProps = {
  files: FileItem[];
  onFileClick?: (file: FileItem) => void;
};

type FileCardProps = {
  file: FileItem;
  onFileClick?: (file: FileItem) => void;
}

const FileCard = memo(({ file, onFileClick }: FileCardProps) => {
  const handleClick = useCallback(() => {
    onFileClick?.(file);
  }, [file, onFileClick]);

  return (
    <div
      className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] hover:bg-gray-100 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      <div className="mb-3">
        {getFileIcon(file.type, "small")}
      </div>

      <div className="text-sm text-gray-700 text-center font-medium truncate w-full">
        {file.name}
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {file.category}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        {file.size}
      </div>
    </div>
  );
});

FileCard.displayName = 'FileCard';

export const RecentFiles = memo(({ files, onFileClick }: RecentFilesProps) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.slice(0, 4).map((file) => (
          <FileCard key={file.id} file={file} onFileClick={onFileClick} />
        ))}
      </div>
    </div>
  );
});

RecentFiles.displayName = 'RecentFiles';