"use client";

import { useState, useMemo } from "react";
import { SearchSection } from "./SearchSection";
import { UploadDocument } from "./UploadDocument";
import { SecureDocument } from "./SecureDocument";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { FileItem } from "./FileItem";
import { useFileboxFiles } from "@/hooks/queries/useFileboxQueries";
import {
  formatFileSize,
  getFileType,
  DISPLAY_CATEGORY_MAPPING,
} from "@/types/filebox";
import { FileBoxSkeleton } from "./FileBoxSkeleton";
import { FilePreview } from "./FilePreview";
import { ApiClient, ApiError } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import { addToast } from "@heroui/toast";
import { useFileboxDownload } from "@/hooks/queries/useFileboxQueries";

import { OTPAction } from "@/types/filebox";
import { logger } from "@/lib/logger";

export function FileBox() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [secureAction, setSecureAction] = useState<OTPAction>("preview");

  const downloadMutation = useFileboxDownload();

  // Fetch files from API
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

  const error = filesError
    ? filesError instanceof Error
      ? filesError.message
      : "Failed to load files"
    : null;

  const handleFileClick = async (file: FileItem) => {
    if (file.isSecure) {
      setSelectedFile(file);
      setSecureAction("preview");
      setShowSecureAccess(true);

      return;
    }

    // Handle preview for non-secure files
    const fileMetadata = fileMetadataMap.get(file.id);

    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    setSelectedFile(file);

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
  };

  const handleUploadClick = () => {
    setShowUpload(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  // Filter files based on selected category and search term
  const filteredFiles = files.filter((file: FileItem) => {
    // Category filter
    const categoryMatch =
      selectedCategory === "all" || file.category === selectedCategory;

    // Search filter can change this to include the category if needed add nalang or ||
    const searchMatch =
      searchTerm === "" ||
      file.name.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-6 pb-0">
        <SearchSection
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          viewType={viewType}
          onCategoryChange={handleCategoryChange}
          onSearchChange={handleSearchChange}
          onUploadClick={handleUploadClick}
          onViewTypeChange={setViewType}
        />
      </div>

      {/* Files Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="bg-white rounded-lg p-6">
          {/* Loading State */}
          {filesLoading && <FileBoxSkeleton viewType={viewType} />}

          {/* Error Message */}
          {!filesLoading && error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500 text-center">
                <p className="mb-2">{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!filesLoading && !error && files.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 text-center">
                <p className="mb-2">No files found</p>
                <p className="text-sm">
                  Upload your first document to get started
                </p>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!filesLoading &&
            !error &&
            files.length > 0 &&
            filteredFiles.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 text-center">
                  <p className="mb-2">No files match your search criteria</p>
                  <p className="text-sm">
                    Try adjusting your search or category filter
                  </p>
                </div>
              </div>
            )}

          {/* File Display */}
          {!filesLoading && !error && filteredFiles.length > 0 && (
            <>
              {viewType === "grid" ? (
                <FileGrid
                  fileMetadataMap={fileMetadataMap}
                  files={filteredFiles}
                  onFileClick={handleFileClick}
                />
              ) : (
                <FileList
                  fileMetadataMap={fileMetadataMap}
                  files={filteredFiles}
                  onFileClick={handleFileClick}
                />
              )}
            </>
          )}
        </div>
      </div>

      {showUpload && <UploadDocument onClose={() => setShowUpload(false)} />}

      {showSecureAccess && selectedFile && (
        <SecureDocument
          action={secureAction}
          file={selectedFile}
          onClose={() => {
            setShowSecureAccess(false);
            setSelectedFile(null);
          }}
          onSuccess={(downloadUrl) => {
            // After OTP verification for preview, open FilePreview
            setPreviewUrl(downloadUrl);
            setShowPreview(true);
          }}
        />
      )}

      {showPreview && selectedFile && (
        <FilePreview
          file={selectedFile}
          fileMetadata={fileMetadataMap.get(selectedFile.id)}
          isOpen={showPreview}
          previewUrl={previewUrl}
          onClose={() => {
            setShowPreview(false);
            setSelectedFile(null);
            setPreviewUrl("");
          }}
          onDownload={async () => {
            const fileMetadata = fileMetadataMap.get(selectedFile.id);

            if (fileMetadata) {
              // Check if file is secure
              if (selectedFile.isSecure) {
                // Close preview and open OTP modal for download
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
          }}
        />
      )}
    </div>
  );
}
