"use client";

import React, { useState, memo, useCallback } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { FileItem } from "./FileItem";
import { FileMetadata } from "@/types/filebox";
import { ViewType } from "./ViewType";
import { getFileIcon } from "../utils/fileIcon";

type MyFilesTableProps = {
  files: FileItem[];
  fileMetadataMap: Map<string, FileMetadata>;
  viewType: "grid" | "list";
  onFileClick?: (file: FileItem) => void;
  onViewTypeChange?: (viewType: "grid" | "list") => void;
};

export const MyFilesTable = memo(({
  files,
  fileMetadataMap,
  viewType,
  onFileClick,
  onViewTypeChange
}: MyFilesTableProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileClick = useCallback((file: FileItem) => {
    setSelectedFile(file.id);
    onFileClick?.(file);
  }, [onFileClick]);

  const getPermissionLabel = (file: FileItem) => {
    return file.isSecure ? "View Only" : "Editor";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        {/* Header with View Type controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">My Files</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {files.length} Total
            </span>
          </div>

          <ViewType
            selectedView={viewType}
            onViewChange={onViewTypeChange || (() => {})}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {viewType === "list" ? (
          /* List View - Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                      File Name
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 10l5 5 5-5"/>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                      Last Modified
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 10l5 5 5-5"/>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-700">
                      File Permission
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 10l5 5 5-5"/>
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr
                    key={file.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedFile === file.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleFileClick(file)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type, "small")}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                          <div className="text-sm text-gray-500">{file.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.lastAccessed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        !file.isSecure
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {getPermissionLabel(file)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <MoreHorizontalIcon size={16} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all cursor-pointer ${
                  selectedFile === file.id ? "border-blue-500 bg-blue-50" : "bg-white"
                }`}
                onClick={() => handleFileClick(file)}
              >
                <div className="flex items-start gap-3">
                  {getFileIcon(file.type, "small")}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{file.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{file.size}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        !file.isSecure
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {getPermissionLabel(file)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Modified {file.lastAccessed}
                    </p>
                  </div>
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontalIcon size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MyFilesTable.displayName = 'MyFilesTable';