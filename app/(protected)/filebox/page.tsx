"use client";

import { useEffect } from "react";
import { RecentFiles } from "./_components/RecentFiles";
import { MyFilesTable } from "./_components/MyFilesTable";
import { Search } from "./_components/Search";
import { Categories } from "./_components/Categories";
import { Button } from "@heroui/button";
import { UploadDocument } from "./_components/UploadDocument";
import { SecureDocument } from "./_components/SecureDocument";
import { FilePreview } from "./_components/FilePreview";
import { FileBoxSkeleton } from "./_components/FileBoxSkeleton";
import { useFileboxOperations } from "./hooks/useFileboxOperations";

export default function FileBoxPage() {
  const {
    selectedFile,
    selectedRecentFile,
    selectedMyFile,
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
    handleRecentFileClick,
    handleMyFileClick,
    handleFileDoubleClick,
    handleDownload,
    handleSort,
    clearAllSelections,
    closePreview,
    handleSecureSuccess,
    closeSecureAccess,
  } = useFileboxOperations();

  // Global click handler to clear selections when clicking outside file items
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Element;
      // Check if click is within a file item
      const isFileItem = target.closest('[data-file-item="true"]');

      if (!isFileItem) {
        clearAllSelections();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [clearAllSelections]);

  // Clear selections when modals open
  useEffect(() => {
    if (showUpload || showSecureAccess || showPreview) {
      clearAllSelections();
    }
  }, [showUpload, showSecureAccess, showPreview, clearAllSelections]);


  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-6 mx-12">
            {/* Search and Action Controls */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                </div>
                <div className="flex items-center gap-3">
                  <Categories
                    selectedCategory={selectedCategory}
                    onSelectionChange={setSelectedCategory}
                    className="w-56"
                    includeAllCategories={true}
                  />

                  <Button
                    className="bg-[#11553F] text-white hover:bg-[#0e4634] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    onPress={() => setShowUpload(true)}
                  >
                    + Upload
                  </Button>
                </div>
              </div>
            </div>


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

            {/* Content when files are loaded */}
            {!filesLoading && !error && files.length > 0 && (
              <>
                {/* Recent Files Section */}
                <RecentFiles
                  files={recentFiles}
                  selectedRecentFile={selectedRecentFile}
                  onFileClick={handleRecentFileClick}
                  onFileDoubleClick={handleFileDoubleClick}
                />

                {/* My Files Table */}
                <MyFilesTable
                  files={filteredFiles}
                  fileMetadataMap={fileMetadataMap}
                  viewType={viewType}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  selectedMyFile={selectedMyFile}
                  onFileClick={handleMyFileClick}
                  onFileDoubleClick={handleFileDoubleClick}
                  onViewTypeChange={setViewType}
                  onSort={handleSort}
                />
              </>
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
          </div>
        </main>
      </div>

      {/* Modals */}
      {showUpload && <UploadDocument onClose={() => setShowUpload(false)} />}

      {selectedFile && (
        <SecureDocument
          action={secureAction}
          file={selectedFile}
          isOpen={showSecureAccess}
          onClose={closeSecureAccess}
          onSuccess={handleSecureSuccess}
        />
      )}

      {showPreview && selectedFile && (
        <FilePreview
          file={selectedFile}
          fileMetadata={fileMetadataMap.get(selectedFile.id)}
          isOpen={showPreview}
          previewUrl={previewUrl}
          onClose={closePreview}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
