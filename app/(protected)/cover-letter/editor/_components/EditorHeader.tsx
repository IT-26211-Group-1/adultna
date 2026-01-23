"use client";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Download, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import InlineEditableTitle from "./InlineEditableTitle";

type EditorHeaderProps = {
  title: string;
  isSaving: boolean;
  hasSaved: boolean;
  hasUnsavedChanges: boolean;
  onExport: () => void;
  onExportDocx: () => void;
  isExporting: boolean;
  coverLetterId: string;
  onTitleChange: (newTitle: string) => void;
};

export default function EditorHeader({
  title,
  isSaving,
  hasSaved,
  hasUnsavedChanges,
  onExport,
  onExportDocx,
  isExporting,
  coverLetterId,
  onTitleChange,
}: EditorHeaderProps) {
  return (
    <div className="bg-transparent w-full flex-shrink-0">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-4">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center space-x-1 text-sm flex-1 min-w-0"
              >
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Link
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                  href="/cover-letter"
                >
                  Cover Letter
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="truncate">
                  <InlineEditableTitle
                    coverLetterId={coverLetterId}
                    currentTitle={title}
                    onTitleChange={onTitleChange}
                  />
                </div>
              </nav>
              <Button
                disableAnimation
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 shadow-lg ml-2 flex-shrink-0"
                isLoading={isExporting}
                size="sm"
                startContent={isExporting ? null : <Download size={14} />}
                onPress={onExport}
              >
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>
            <div className="flex justify-center">
              <SaveStatusIndicator
                hasSaved={hasSaved}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
              />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center space-x-1 text-sm overflow-x-auto scrollbar-hide"
                >
                  <Link
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Link
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap"
                    href="/cover-letter"
                  >
                    Cover Letter
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <InlineEditableTitle
                    coverLetterId={coverLetterId}
                    currentTitle={title}
                    onTitleChange={onTitleChange}
                  />
                </nav>
                <SaveStatusIndicator
                  hasSaved={hasSaved}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isSaving={isSaving}
                />
              </div>

              <div className="flex items-center gap-3">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      disableAnimation
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 shadow-lg"
                      endContent={
                        isExporting ? null : <ChevronDown size={14} />
                      }
                      isLoading={isExporting}
                      size="sm"
                      startContent={isExporting ? null : <Download size={16} />}
                    >
                      {isExporting ? "Exporting..." : "Export"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Export options">
                    <DropdownItem
                      key="pdf"
                      startContent={<Download size={16} />}
                      onPress={onExport}
                    >
                      Export as PDF
                    </DropdownItem>
                    <DropdownItem
                      key="docx"
                      startContent={<Download size={16} />}
                      onPress={onExportDocx}
                    >
                      Export as Word
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
