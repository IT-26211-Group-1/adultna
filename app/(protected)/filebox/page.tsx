"use client";

import { RecentFiles } from "./_components/RecentFiles";
import { MyFilesTable } from "./_components/MyFilesTable";
import { FileDetailsSidebar } from "./_components/FileDetailsSidebar";
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
    showSidebar,
    selectedCategory,
    searchTerm,
    viewType,
    showUpload,
    showSecureAccess,
    showPreview,
    previewUrl,
    secureAction,
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
    handleDownload,
    closeSidebar,
    closePreview,
    handleSecureSuccess,
    closeSecureAccess,
  } = useFileboxOperations();

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Adulting Filebox
        </h1>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>
          <div className="p-6">
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
                  onFileClick={handleFileClick}
                />

                {/* My Files Table */}
                <MyFilesTable
                  files={filteredFiles}
                  fileMetadataMap={fileMetadataMap}
                  viewType={viewType}
                  onFileClick={handleFileClick}
                  onViewTypeChange={setViewType}
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

        {/* File Details Sidebar */}
        <FileDetailsSidebar
          selectedFile={selectedFile}
          fileMetadata={fileMetadataMap.get(selectedFile?.id || '')}
          isOpen={showSidebar}
          onClose={closeSidebar}
        />
      </div>

      {/* Modals */}
      {showUpload && <UploadDocument onClose={() => setShowUpload(false)} />}

      {showSecureAccess && selectedFile && (
        <SecureDocument
          action={secureAction}
          file={selectedFile}
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
