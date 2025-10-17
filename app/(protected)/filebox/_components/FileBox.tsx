"use client";

import { useState, useMemo } from "react";
import { SearchSection } from "./SearchSection";
import { UploadDocument } from "./UploadDocument";
import { SecureDocument } from "./SecureDocument";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { FileItem } from "./FileItem";
import {
  useFileboxFiles,
  useFileboxQuota,
} from "@/hooks/queries/useFileboxQueries";
import {
  formatFileSize,
  getFileType,
  DISPLAY_CATEGORY_MAPPING,
} from "@/types/filebox";
import { FileBoxSkeleton } from "./FileBoxSkeleton";

export function FileBox() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch files from API
  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
  } = useFileboxFiles(
    selectedCategory === "all" ? undefined : selectedCategory
  );

  // Fetch user quota
  const { data: quotaResponse } = useFileboxQuota();

  // Transform backend files to frontend FileItem format
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
        uploadDate: new Date(file.uploadedAt).toLocaleDateString(),
        lastAccessed: new Date(file.uploadedAt).toLocaleDateString(),
        type: getFileType(file.mimeType),
        isSecure: false, // TODO: Implement secure file detection when backend supports it
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

  const handleFileClick = (file: FileItem) => {
    if (file.isSecure) {
      setSelectedFile(file);
      setShowSecureAccess(true);
    } else {
      console.log("Opening file:", file.name);
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
          file={selectedFile}
          onClose={() => {
            setShowSecureAccess(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
}
