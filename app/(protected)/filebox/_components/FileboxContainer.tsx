"use client";

import { useEffect } from "react";
import { useFileboxOperations } from "@/hooks/useFileboxOperations";
import { SearchBar } from "./SearchBar";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { EmptyState } from "./EmptyState";
import { FileboxContent } from "./FileboxContent";
import { FileboxModals } from "./FileboxModals";

export function FileboxContainer() {
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

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const isFileItem = target.closest('[data-file-item="true"]');

      if (!isFileItem) {
        clearAllSelections();
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
    };
  }, [clearAllSelections]);

  useEffect(() => {
    if (showUpload || showSecureAccess || showPreview) {
      clearAllSelections();
    }
  }, [showUpload, showSecureAccess, showPreview, clearAllSelections]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-6 mx-12">
            <SearchBar
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
              onUploadClick={() => setShowUpload(true)}
            />

            {filesLoading && <LoadingState viewType={viewType} />}

            {!filesLoading && error && <ErrorState error={error} />}

            {!filesLoading && !error && files.length > 0 && (
              <FileboxContent
                fileMetadataMap={fileMetadataMap}
                filteredFiles={filteredFiles}
                recentFiles={recentFiles}
                selectedMyFile={selectedMyFile}
                selectedRecentFile={selectedRecentFile}
                sortBy={sortBy}
                sortDirection={sortDirection}
                viewType={viewType}
                onFileDoubleClick={handleFileDoubleClick}
                onMyFileClick={handleMyFileClick}
                onRecentFileClick={handleRecentFileClick}
                onSort={handleSort}
                onViewTypeChange={setViewType}
              />
            )}

            {!filesLoading && !error && files.length === 0 && <EmptyState />}
          </div>
        </main>
      </div>

      <FileboxModals
        fileMetadataMap={fileMetadataMap}
        previewUrl={previewUrl}
        secureAction={secureAction}
        selectedFile={selectedFile}
        showPreview={showPreview}
        showSecureAccess={showSecureAccess}
        showUpload={showUpload}
        onClosePreview={closePreview}
        onCloseSecureAccess={closeSecureAccess}
        onCloseUpload={() => setShowUpload(false)}
        onDownload={handleDownload}
        onSecureSuccess={handleSecureSuccess}
      />
    </div>
  );
}
