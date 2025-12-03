"use client";

import { useState, useMemo, useCallback } from "react";
import {
  useFileboxFiles,
  useFileboxDownload,
  useFileboxArchive,
  useFileboxRestore,
  useFileboxPermanentDelete,
} from "@/hooks/queries/useFileboxQueries";
import {
  formatFileSize,
  getFileType,
  DISPLAY_CATEGORY_MAPPING,
} from "@/types/filebox";
import { FileItem } from "@/app/(protected)/filebox/_components/FileItem";
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

type SortBy = "name" | "lastModified" | "category" | null;
type SortDirection = "asc" | "desc";

export const useFileboxOperations = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedRecentFile, setSelectedRecentFile] = useState<FileItem | null>(
    null
  );
  const [selectedMyFile, setSelectedMyFile] = useState<FileItem | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showUpload, setShowUpload] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [secureAction, setSecureAction] = useState<OTPAction>("preview");
  const [sortBy, setSortBy] = useState<SortBy>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const downloadMutation = useFileboxDownload();
  const archiveMutation = useFileboxArchive();
  const restoreMutation = useFileboxRestore();
  const permanentDeleteMutation = useFileboxPermanentDelete();

  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
  } = useFileboxFiles(
    selectedCategory === "all" ? undefined : selectedCategory
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
    let filtered = files.filter((file: FileItem) => {
      const categoryMatch =
        selectedCategory === "all" || file.category === selectedCategory;

      const searchMatch =
        searchTerm === "" ||
        file.name.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });

    if (sortBy) {
      filtered = filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "lastModified":
            const fileA = fileMetadataMap.get(a.id);
            const fileB = fileMetadataMap.get(b.id);

            if (!fileA || !fileB) return 0;
            aValue = new Date(fileA.lastModified).getTime();
            bValue = new Date(fileB.lastModified).getTime();
            break;
          case "category":
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;

        return 0;
      });
    }

    return filtered;
  }, [
    files,
    selectedCategory,
    searchTerm,
    sortBy,
    sortDirection,
    fileMetadataMap,
  ]);

  const recentFiles = useMemo(() => {
    return [...files]
      .sort((a, b) => {
        const fileA = fileMetadataMap.get(a.id);
        const fileB = fileMetadataMap.get(b.id);

        if (!fileA || !fileB) return 0;

        return (
          new Date(fileB.lastModified).getTime() -
          new Date(fileA.lastModified).getTime()
        );
      })
      .slice(0, 4);
  }, [files, fileMetadataMap]);

  const error = filesError
    ? filesError instanceof Error
      ? filesError.message
      : "Failed to load files"
    : null;

  const handleFileClick = useCallback((file: FileItem) => {
    setSelectedFile(file);
  }, []);

  const handleRecentFileClick = useCallback((file: FileItem) => {
    setSelectedRecentFile(file);
    setSelectedMyFile(null);
  }, []);

  const handleMyFileClick = useCallback((file: FileItem) => {
    setSelectedMyFile(file);
    setSelectedRecentFile(null);
    setSelectedFile(file);
  }, []);

  const handleFileDoubleClick = useCallback(
    async (file: FileItem) => {
      setSelectedFile(file);

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
          API_CONFIG.API_URL
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
    },
    [fileMetadataMap]
  );

  const handleShowDetails = useCallback((file: FileItem) => {
    setSelectedFile(file);
    setShowSidebar(true);
  }, []);

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

  const handleArchiveFile = useCallback(
    async (fileId: string) => {
      try {
        await archiveMutation.mutateAsync(fileId);
        addToast({
          title: "File archived successfully",
          color: "success",
        });
        closeSidebar();
      } catch (error) {
        logger.error("Archive error:", error);
        if (error instanceof ApiError) {
          addToast({
            title: error.message || "Failed to archive file",
            color: "danger",
          });
        }
      }
    },
    [archiveMutation]
  );

  const handleRestoreFile = useCallback(
    async (fileId: string) => {
      try {
        await restoreMutation.mutateAsync(fileId);
        addToast({
          title: "File restored successfully",
          color: "success",
        });
      } catch (error) {
        logger.error("Restore error:", error);
        if (error instanceof ApiError) {
          addToast({
            title: error.message || "Failed to restore file",
            color: "danger",
          });
        }
      }
    },
    [restoreMutation]
  );

  const handlePermanentDelete = useCallback(
    async (fileId: string) => {
      try {
        await permanentDeleteMutation.mutateAsync(fileId);
        addToast({
          title: "File permanently deleted",
          color: "success",
        });
      } catch (error) {
        logger.error("Permanent delete error:", error);
        if (error instanceof ApiError) {
          addToast({
            title: error.message || "Failed to permanently delete file",
            color: "danger",
          });
        }
      }
    },
    [permanentDeleteMutation]
  );

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

  const handleSort = useCallback(
    (field: SortBy) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("desc");
      }
    },
    [sortBy, sortDirection]
  );

  const clearAllSelections = useCallback(() => {
    setSelectedRecentFile(null);
    setSelectedMyFile(null);
  }, []);

  return {
    selectedFile,
    selectedRecentFile,
    selectedMyFile,
    showSidebar,
    selectedCategory,
    searchTerm,
    viewType,
    showUpload,
    showSecureAccess,
    showPreview,
    previewUrl,
    secureAction,
    sortBy,
    sortDirection,
    files,
    filteredFiles,
    recentFiles,
    fileMetadataMap,
    filesLoading,
    error,
    setSelectedCategory,
    setSearchTerm,
    setViewType,
    setShowUpload,
    handleFileClick,
    handleRecentFileClick,
    handleMyFileClick,
    handleFileDoubleClick,
    handleShowDetails,
    handleDownload,
    handleArchiveFile,
    handleRestoreFile,
    handlePermanentDelete,
    handleSort,
    clearAllSelections,
    closeSidebar,
    closePreview,
    handleSecureSuccess,
    closeSecureAccess,
  };
};
