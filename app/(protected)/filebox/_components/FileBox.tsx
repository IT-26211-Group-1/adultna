"use client";

import { useState } from "react";
import { SearchSection } from "./SearchSection";
import { UploadDocument } from "./UploadDocument";
import { SecureDocument } from "./SecureDocument";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { FileItem } from "./FileItem";

export function FileBox() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Nandito yung remaining lint warnings which will be gone once backend integration is done
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    // Search filter
    const searchMatch =
      searchTerm === "" ||
      file.name.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="p-6">
      <SearchSection
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        viewType={viewType}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onUploadClick={handleUploadClick}
        onViewTypeChange={setViewType}
      />

      {/* Files Section */}
      <div className="bg-white rounded-lg p-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500 text-center">
              <p className="mb-2">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && files.length === 0 && (
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
        {!error && files.length > 0 && filteredFiles.length === 0 && (
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
        {!error && filteredFiles.length > 0 && (
          <>
            {viewType === "grid" ? (
              <FileGrid files={filteredFiles} onFileClick={handleFileClick} />
            ) : (
              <FileList files={filteredFiles} onFileClick={handleFileClick} />
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
