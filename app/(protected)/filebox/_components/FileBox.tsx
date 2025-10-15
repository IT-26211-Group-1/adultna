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
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    
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
        }
    ];

    const handleFileClick = (file: FileItem) => {
        if (file.isSecure) {
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

    // Filter files based on selected category
    const filteredFiles = selectedCategory === "all" 
        ? fakeFiles 
        : fakeFiles.filter(file => file.category === selectedCategory);

    return (
        <div className="p-6">
            <SearchSection 
                viewType={viewType}
                onViewTypeChange={setViewType}
                onUploadClick={handleUploadClick}
                onCategoryChange={handleCategoryChange}
                selectedCategory={selectedCategory}
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
            {showUpload && (
                <UploadDocument onClose={() => setShowUpload(false)} />
            )}
            
            {showSecureAccess && (
                <SecureDocument onClose={() => setShowSecureAccess(false)} />
            )}
        </div>
    );
}
