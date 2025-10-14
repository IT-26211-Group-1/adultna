"use client";

import { Card, CardBody } from "@heroui/react";
import { FileActions } from "./FileActions";
import { FileItem } from "./FileItem";

interface FileListProps {
    files: FileItem[];
    onFileClick?: (file: FileItem) => void;
}

export function FileList({ files, onFileClick }: FileListProps) {
    return (
        <div className="space-y-3">
            {files.map((file) => (
                <Card
                    key={file.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    isPressable
                    onPress={() => onFileClick?.(file)}
                >
                    <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                            {/* Left Section - Icon and Details */}
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-gray-900 truncate">
                                        {file.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {file.category}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Middle Section - File Info */}
                            <div className="hidden md:flex flex-col items-end space-y-1 text-sm text-gray-500 mr-4">
                                <p>Uploaded: {file.uploadDate}</p>
                                <p>Last accessed: {file.lastAccessed}</p>
                            </div>
                            
                            {/* Right Section - Size and Actions */}
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500 hidden sm:block">
                                    {file.size}
                                </span>
                                <FileActions file={file} />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}