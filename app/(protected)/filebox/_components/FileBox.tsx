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

  const fakeFiles: FileItem[] = [
    {
      id: "1",
      name: "Diploma.jpg",
      category: "Education",
      size: "1.8 MB",
      uploadDate: "1/15/2025",
      lastAccessed: "12/20/2025",
      type: "jpg",
      isSecure: false,
    },
    {
      id: "2",
      name: "Birth Certificate.pdf",
      category: "Government Documents",
      size: "2.4 MB",
      uploadDate: "1/15/2025",
      lastAccessed: "1/20/2025",
      type: "pdf",
      isSecure: true,
    },
    {
      id: "3",
      name: "Resume_2025.pdf",
      category: "Career",
      size: "1.2 MB",
      uploadDate: "1/10/2025",
      lastAccessed: "1/18/2025",
      type: "pdf",
      isSecure: false,
    },
    {
      id: "4",
      name: "Transcript.pdf",
      category: "Education",
      size: "3.1 MB",
      uploadDate: "12/20/2024",
      lastAccessed: "1/15/2025",
      type: "pdf",
      isSecure: false,
    },
  ];

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
  const filteredFiles = fakeFiles.filter((file) => {
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
        {/* File Display */}
        {viewType === "grid" ? (
          <FileGrid files={filteredFiles} onFileClick={handleFileClick} />
        ) : (
          <FileList files={filteredFiles} onFileClick={handleFileClick} />
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
