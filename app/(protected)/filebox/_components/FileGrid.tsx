"use client";

import { Card, CardBody } from "@heroui/react";
import { FileActions } from "./FileActions";
import { FileItem } from "./FileItem";

interface FileGridProps {
    files: FileItem[];
    onFileClick?: (file: FileItem) => void;
}

export function FileGrid({ files }: FileGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {files.map((file) => (
                <Card
                    key={file.id}
                    className="hover:shadow-md transition-shadow border border-gray-200"
                >
                    <CardBody className="p-6">
                        <div className="space-y-3">
                            {/* Header - File Name and Actions */}
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-2">
                                    {file.name}
                                </h3>
                                <FileActions file={file} viewType="grid" />
                            </div>
                            
                            {/* Category Badge */}
                            <div>
                                <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-full">
                                    {file.category}
                                </span>
                            </div>
                            
                            {/* Date Information and File Size */}
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div>Uploaded: {file.uploadDate}</div>
                                    <div>Last accessed: {file.lastAccessed}</div>
                                </div>
                                <div className="text-sm text-gray-900 font-medium">
                                    {file.size}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}