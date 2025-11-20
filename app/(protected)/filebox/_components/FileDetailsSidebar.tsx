"use client";

import React from "react";
import { EyeIcon, EditIcon, MessageSquareIcon, ShareIcon, TrashIcon } from "lucide-react";
import { FileItem } from "./FileItem";
import { FileMetadata } from "@/types/filebox";
import { getFileIcon } from "../utils/fileIcon";

type FileDetailsSidebarProps = {
  selectedFile: FileItem | null;
  fileMetadata?: FileMetadata;
  isOpen: boolean;
  onClose: () => void;
};

export const FileDetailsSidebar = ({ selectedFile, fileMetadata, isOpen, onClose }: FileDetailsSidebarProps) => {
  if (!isOpen || !selectedFile) {
    return null;
  }

  const stats = [
    { icon: EyeIcon, label: "Total Views", value: "198" },
    { icon: EditIcon, label: "Edits", value: "16" },
    { icon: MessageSquareIcon, label: "Comments", value: "11" },
    { icon: ShareIcon, label: "Share", value: "87" },
    { icon: TrashIcon, label: "Deletes", value: "77" },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">File Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* File Info */}
        <div className="flex items-start gap-3">
          {getFileIcon(selectedFile.type, "medium")}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900">{selectedFile.name}</h3>
              {selectedFile.isSecure && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18,8H17V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8Z" />
                  </svg>
                  Editor
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Modified {selectedFile.lastAccessed}</p>
          </div>
        </div>
      </div>

      {/* File Overview */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">File Overview</h3>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">{stat.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Properties</h3>
        <div className="space-y-3">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedFile.category}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedFile.size}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Uploaded</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedFile.uploadDate}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Accessed</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedFile.lastAccessed}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{selectedFile.type.toUpperCase()}</dd>
          </div>
        </div>
      </div>
    </div>
  );
};