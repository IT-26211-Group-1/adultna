"use client";

import { RecentFiles } from "./RecentFiles";
import { MyFilesTable } from "./MyFilesTable";
import { FileItem } from "./FileItem";

type FileboxContentProps = {
  recentFiles: FileItem[];
  filteredFiles: FileItem[];
  fileMetadataMap: Map<string, any>;
  viewType: "grid" | "list";
  sortBy: "name" | "lastModified" | "category" | null;
  sortDirection: "asc" | "desc";
  selectedRecentFile: FileItem | null;
  selectedMyFile: FileItem | null;
  onRecentFileClick: (file: FileItem) => void;
  onMyFileClick: (file: FileItem) => void;
  onFileDoubleClick: (file: FileItem) => void;
  onViewTypeChange: (type: "grid" | "list") => void;
  onSort: (field: "name" | "lastModified" | "category" | null) => void;
};

export function FileboxContent({
  recentFiles,
  filteredFiles,
  fileMetadataMap,
  viewType,
  sortBy,
  sortDirection,
  selectedRecentFile,
  selectedMyFile,
  onRecentFileClick,
  onMyFileClick,
  onFileDoubleClick,
  onViewTypeChange,
  onSort,
}: FileboxContentProps) {
  return (
    <>
      <RecentFiles
        files={recentFiles}
        selectedRecentFile={selectedRecentFile}
        onFileClick={onRecentFileClick}
        onFileDoubleClick={onFileDoubleClick}
      />

      <MyFilesTable
        fileMetadataMap={fileMetadataMap}
        files={filteredFiles}
        selectedMyFile={selectedMyFile}
        sortBy={sortBy}
        sortDirection={sortDirection}
        viewType={viewType}
        onFileClick={onMyFileClick}
        onFileDoubleClick={onFileDoubleClick}
        onSort={onSort}
        onViewTypeChange={onViewTypeChange}
      />
    </>
  );
}
