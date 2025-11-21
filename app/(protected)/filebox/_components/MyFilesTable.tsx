"use client";

import React, { memo, useCallback } from "react";
import { Lock } from "lucide-react";
import { FileItem } from "./FileItem";
import { FileMetadata } from "@/types/filebox";
import { ViewType } from "./ViewType";
import { getFileIcon } from "../utils/fileIcon";
import { FileActions } from "./FileActions";

type SortBy = "name" | "lastModified" | "category" | null;
type SortDirection = "asc" | "desc";

type MyFilesTableProps = {
  files: FileItem[];
  fileMetadataMap: Map<string, FileMetadata>;
  viewType: "grid" | "list";
  sortBy: SortBy;
  sortDirection: SortDirection;
  selectedMyFile?: FileItem | null;
  onFileClick?: (file: FileItem, event?: React.MouseEvent) => void;
  onFileDoubleClick?: (file: FileItem) => void;
  onViewTypeChange?: (viewType: "grid" | "list") => void;
  onSort?: (field: SortBy) => void;
};

export const MyFilesTable = memo(({
  files,
  fileMetadataMap,
  viewType,
  sortBy,
  sortDirection,
  selectedMyFile,
  onFileClick,
  onFileDoubleClick,
  onViewTypeChange,
  onSort
}: MyFilesTableProps) => {
  const handleFileClick = useCallback((file: FileItem) => {
    onFileClick?.(file);
  }, [onFileClick]);

  const handleFileDoubleClick = useCallback((file: FileItem) => {
    onFileDoubleClick?.(file);
  }, [onFileDoubleClick]);


  const getCategoryColors = (category: string) => {
    switch (category.toLowerCase()) {
      case "medical":
        return "bg-green-100 text-green-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "government documents":
        return "bg-blue-100 text-blue-800";
      case "education":
        return "bg-indigo-100 text-indigo-800";
      case "career":
        return "bg-orange-100 text-orange-800";
      case "financial":
        return "bg-emerald-100 text-emerald-800";
      case "legal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSortIcon = (field: SortBy) => {
    if (sortBy !== field) {
      return (
        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10l5 5 5-5"/>
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M17 14l-5-5-5 5"/>
      </svg>
    ) : (
      <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M7 10l5 5 5-5"/>
      </svg>
    );
  };

  const renderSortableHeader = (label: string, field: SortBy) => (
    <div
      className={`flex items-center gap-2 cursor-pointer hover:text-gray-700 ${sortBy === field ? 'text-gray-900' : ''}`}
      onClick={() => onSort?.(field)}
    >
      {label}
      {getSortIcon(field)}
    </div>
  );

  return (
    <div className="bg-white rounded-lg">
      <div className="pr-6 py-4 border-b border-gray-200">
        {/* Header with View Type controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">My Files</h3>
          </div>

          <ViewType
            selectedView={viewType}
            onViewChange={onViewTypeChange || (() => {})}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="pr-6 pt-6 pb-6">
        {viewType === "list" ? (
          /* List View - Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {renderSortableHeader("File Name", "name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {renderSortableHeader("Last Modified", "lastModified")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {renderSortableHeader("Category", "category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => {
                  const isSelected = selectedMyFile?.id === file.id;
                  return (
                  <tr
                    key={file.id}
                    data-file-item="true"
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100 hover:bg-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFileClick(file)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type, "small")}
                        <div className="flex items-center gap-2 flex-1">
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {file.name}
                              {file.isSecure && (
                                <div title="Secured file">
                                  <Lock size={14} className="text-orange-600" />
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{file.size}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.lastAccessed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColors(file.category)}`}>
                        {file.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FileActions
                        file={file}
                        fileMetadata={fileMetadataMap.get(file.id)}
                        viewType="list"
                      />
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => {
              const isSelected = selectedMyFile?.id === file.id;
              return (
              <div
                key={file.id}
                data-file-item="true"
                className={`p-4 border-2 rounded-lg transition-all cursor-pointer relative group min-h-[140px] ${
                  isSelected
                    ? 'border-transparent bg-blue-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleFileClick(file)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >

                {/* Top Right Actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {/* More Options - Always Visible */}
                  <div>
                    <FileActions
                      file={file}
                      fileMetadata={fileMetadataMap.get(file.id)}
                      viewType="grid"
                    />
                  </div>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col h-full">
                  {/* File Icon - Upper Left */}
                  <div className="mb-3">
                    {getFileIcon(file.type, "small")}
                  </div>

                  {/* Text Content Under Icon */}
                  <div className="flex-1 pr-16">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      {file.isSecure && (
                        <div title="Secured file">
                          <Lock size={12} className="text-orange-600 flex-shrink-0" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">{file.size}</div>
                    <p className="text-xs text-gray-400">
                      Modified {file.lastAccessed}
                    </p>
                  </div>

                  {/* Category Tag - Bottom Right */}
                  <div className="absolute bottom-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColors(file.category)}`}>
                      {file.category}
                    </span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

MyFilesTable.displayName = 'MyFilesTable';