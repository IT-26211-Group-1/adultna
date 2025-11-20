"use client";

import { useState, useMemo, useCallback } from "react";
import { useFileboxFiles, useFileboxDownload } from "@/hooks/queries/useFileboxQueries";
import { formatFileSize, getFileType, DISPLAY_CATEGORY_MAPPING } from "@/types/filebox";
import { FileItem } from "../_components/FileItem";
import { ApiClient, ApiError } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import { addToast } from "@heroui/toast";
import { OTPAction } from "@/types/filebox";
import { logger } from "@/lib/logger";

export type FileboxState = {
  selectedFile: FileItem | null;
  showSidebar: boolean;
  selectedCategory: string;
  searchTerm: string;
  viewType: "grid" | "list";
  showUpload: boolean;
  showSecureAccess: boolean;
  showPreview: boolean;
  previewUrl: string;
  secureAction: OTPAction;
};

export const useFileboxOperations = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showUpload, setShowUpload] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [secureAction, setSecureAction] = useState<OTPAction>("preview");

  const downloadMutation = useFileboxDownload();

  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
  } = useFileboxFiles(
    selectedCategory === "all" ? undefined : selectedCategory,
  );

  const { files, fileMetadataMap } = useMemo(() => {
    if (!filesResponse?.success || !filesResponse.data?.files) {
      return { files: [], fileMetadataMap: new Map() };
    }

    const transformedFiles: FileItem[] = [];
    const metadataMap = new Map();

    filesResponse.data.files.forEach((file) => {
      const fileItem: FileItem = {
        id: file.id,
        name: file.fileName,
        category: DISPLAY_CATEGORY_MAPPING[file.category] || "Personal",
        size: formatFileSize(file.fileSize),
        uploadDate: new Date(file.uploadDate).toLocaleDateString(),
        lastAccessed: new Date(file.lastModified).toLocaleDateString(),
        type: getFileType(file.contentType),
        isSecure: file.isSecure || false,
      };

      transformedFiles.push(fileItem);
      metadataMap.set(file.id, file);
    });

    return { files: transformedFiles, fileMetadataMap: metadataMap };
  }, [filesResponse]);

  const filteredFiles = useMemo(() => {
    return files.filter((file: FileItem) => {
      const categoryMatch =
        selectedCategory === "all" || file.category === selectedCategory;

      const searchMatch =
        searchTerm === "" ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [files, selectedCategory, searchTerm]);

  const recentFiles = useMemo(() => {
    return [...files]
      .sort((a, b) => {
        // Get the metadata for both files to access the actual lastModified timestamps
        const fileA = fileMetadataMap.get(a.id);
        const fileB = fileMetadataMap.get(b.id);

        if (!fileA || !fileB) return 0;

        // Sort by lastModified date in descending order (most recent first)
        return new Date(fileB.lastModified).getTime() - new Date(fileA.lastModified).getTime();
      })
      .slice(0, 4);
  }, [files, fileMetadataMap]);

  const error = filesError
    ? filesError instanceof Error
      ? filesError.message
      : "Failed to load files"
    : null;

  const handleFileClick = useCallback(async (file: FileItem) => {
    setSelectedFile(file);
    setShowSidebar(true);

    if (file.isSecure) {
      setSecureAction("preview");
      setShowSecureAccess(true);
      return;
    }

    const fileMetadata = fileMetadataMap.get(file.id);

    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });
      return;
    }

    try {
      const response: any = await ApiClient.get(
        `/filebox/download/${fileMetadata.id}`,
        {},
        API_CONFIG.API_URL,
      );

      if (response.success && response.data?.downloadUrl) {
        setPreviewUrl(response.data.downloadUrl);
        setShowPreview(true);
      } else {
        throw new Error("Failed to generate preview URL");
      }
    } catch (error) {
      logger.error("Preview error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to open file",
          color: "danger",
        });
      } else {
        addToast({
          title: "Failed to open file",
          color: "danger",
        });
      }
    }
  }, [fileMetadataMap]);

  const handleDownload = useCallback(async () => {
    if (!selectedFile) return;

    const fileMetadata = fileMetadataMap.get(selectedFile.id);

    if (fileMetadata) {
      if (selectedFile.isSecure) {
        setShowPreview(false);
        setSecureAction("download");
        setShowSecureAccess(true);
        return;
      }

      try {
        await downloadMutation.mutateAsync(fileMetadata);
        addToast({
          title: "Download started",
          color: "success",
        });
      } catch (error) {
        logger.error("Download error:", error);
        if (error instanceof ApiError) {
          addToast({
            title: error.message || "Failed to download file",
            color: "danger",
          });
        }
      }
    }
  }, [selectedFile, fileMetadataMap, downloadMutation]);

  const closeSidebar = useCallback(() => {
    setShowSidebar(false);
    setSelectedFile(null);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    setSelectedFile(null);
    setPreviewUrl("");
  }, []);

  const handleSecureSuccess = useCallback((downloadUrl: string) => {
    setPreviewUrl(downloadUrl);
    setShowPreview(true);
  }, []);

  const closeSecureAccess = useCallback(() => {
    setShowSecureAccess(false);
    setSelectedFile(null);
  }, []);

  return {
    // State
    selectedFile,
    showSidebar,
    selectedCategory,
    searchTerm,
    viewType,
    showUpload,
    showSecureAccess,
    showPreview,
    previewUrl,
    secureAction,

    // Data
    files,
    filteredFiles,
    recentFiles,
    fileMetadataMap,
    filesLoading,
    error,

    // Actions
    setSelectedCategory,
    setSearchTerm,
    setViewType,
    setShowUpload,
    handleFileClick,
    handleDownload,
    closeSidebar,
    closePreview,
    handleSecureSuccess,
    closeSecureAccess,
  };
};