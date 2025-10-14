"use client";

import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Eye, Download, Trash2, EllipsisVertical } from "lucide-react";
import { FileItem } from "./FileItem";

interface FileActionsProps {
    file: FileItem;
    viewType?: "grid" | "list";
}

export function FileActions({ file, viewType = "grid" }: FileActionsProps) {
    const handleView = () => {
        console.log("View file:", file.name);
    };

    const handleDownload = () => {
        console.log("Download file:", file.name);
    };

    const handleDelete = () => {
        console.log("Delete file:", file.name);
    };

    if (viewType === "list") {
        // List view - show plain buttons
        return (
            <div className="flex items-center space-x-1">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleView}
                    className="text-gray-600 hover:text-blue-600"
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleDownload}
                    className="text-gray-600 hover:text-green-600"
                >
                    <Download className="w-4 h-4" />
                </Button>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={handleDelete}
                    className="text-gray-600 hover:text-red-600"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    // Grid view - show dropdown only
    return (
        <div>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-gray-600"
                    >
                        <EllipsisVertical className="w-4 h-4" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="File actions">
                    <DropdownItem
                        key="view"
                        startContent={<Eye className="w-4 h-4" />}
                        onPress={handleView}
                    >
                        View
                    </DropdownItem>
                    <DropdownItem
                        key="download"
                        startContent={<Download className="w-4 h-4" />}
                        onPress={handleDownload}
                    >
                        Download
                    </DropdownItem>
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<Trash2 className="w-4 h-4" />}
                        onPress={handleDelete}
                    >
                        Delete
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}