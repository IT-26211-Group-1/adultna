"use client";
import { Categories } from './Categories';
import { Upload } from 'lucide-react';
import NextLink from 'next/link';
import { Card, CardBody, Button, Checkbox } from '@heroui/react';
import { useRef, useState } from 'react';

export function UploadDocument() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    }
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    }
    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    }

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    }
    const handleRemoveFile = () => {
        setUploadedFile(null);
    }
    // return (
    //     <div>
    //     <input type="file" id="fileInput" className="hidden" />
    //     <Categories/>
    //     </div>
    // );
    const handleCancel = () => {
        // Close modal or navigate back
        console.log("Cancel clicked");
    };

    const handleUploadDocument = () => {
        // Handle upload logic
        console.log("Upload Document clicked");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Upload a New Document
                    </h1>
                </div>

                {/* Select File Section */}
                <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium text-gray-700">Select File</label>
                    <Card
                        className={`border-2 border-dashed transition-all duration-200 ${
                            isDragOver
                                ? "border-green-400 bg-green-50"
                                : uploadedFile
                                    ? "border-green-300 bg-green-50"
                                    : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                        <CardBody
                            className="p-12 text-center cursor-pointer"
                            onClick={handleBrowseClick}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {uploadedFile ? (
                                // File uploaded state
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            {uploadedFile.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <Button
                                            color="default"
                                            variant="bordered"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile();
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                // Default upload state
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            {isDragOver
                                                ? "Drop your document here"
                                                : "Click to upload or drag and drop"}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        PDF, DOC, JPG, PNG up to 10MB
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        accept=".pdf,.docx,.doc,.jpg,.png"
                        className="hidden"
                        type="file"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Category Section */}
                <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <Categories
                        // props to customize the Categories component
                        includeAllCategories={false} 
                        placeholder="Select Category" 
                    />
                </div>

                {/* Checkbox Section */}
                <div className="py-2 mb-8">
                    <Checkbox size="md" classNames={{
                        label: "text-sm text-gray-700"
                    }}>
                        Enable secure access (OTP required)
                    </Checkbox>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="bordered"
                        className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                        onPress={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        className="flex-1 py-3 bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                        onPress={handleUploadDocument}
                        isDisabled={!uploadedFile}
                    >
                        Upload Document
                    </Button>
                </div>
            </div>
        </div>
    );
}