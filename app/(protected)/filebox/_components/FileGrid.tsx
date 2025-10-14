"use client";

import { Card, CardBody } from "@heroui/react";
import { FileActions } from "./FileActions";
import { FileItem } from "./FileItem";

interface FileGridProps {
    files: FileItem[];
    onFileClick?: (file: FileItem) => void;
}

export function FileGrid({ files, onFileClick }: FileGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {files.map((file) => (
                <Card
                    key={file.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    isPressable
                    onPress={() => onFileClick?.(file)}
                >
                    <CardBody className="p-4">
                        <div className="flex flex-col items-center space-y-3">
                            {/* File Name */}
                            <h3 className="font-medium text-gray-900 text-center truncate w-full">
                                {file.name}
                            </h3>
                            
                            {/* File Details */}
                            <div className="text-xs text-gray-500 text-center space-y-1">
                                <p>{file.category}</p>
                                <p>Uploaded: {file.uploadDate}</p>
                                <p>Last accessed: {file.lastAccessed}</p>
                                <span className="text-last">{file.size}</span>
                            </div>
                            
                            {/* Actions */}
                            <FileActions file={file} />
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}