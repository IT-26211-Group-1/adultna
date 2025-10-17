"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import Image from "next/image";
import { FileItem } from "./FileItem";
import { FileMetadata } from "@/types/filebox";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Define PDF options outside component to prevent unnecessary re-renders
const PDF_OPTIONS = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
} as const;

interface FilePreviewProps {
  file: FileItem;
  fileMetadata?: FileMetadata;
  previewUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

export function FilePreview({
  file,
  fileMetadata,
  previewUrl,
  isOpen,
  onClose,
  onDownload,
}: FilePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    console.error("Preview URL:", previewUrl);
    console.error("File metadata:", fileMetadata);
    console.error("File info:", file);
    setLoading(false);
    setError("Failed to load PDF. Please try downloading the file.");
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const isPDF =
    fileMetadata?.contentType === "application/pdf" || file.type === "pdf";

  const isImage =
    fileMetadata?.contentType?.startsWith("image/") ||
    file.type === "jpg" ||
    file.type === "png";

  const isDocument =
    fileMetadata?.contentType === "application/msword" ||
    fileMetadata?.contentType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "doc" ||
    file.type === "docx";

  return (
    <Modal
      classNames={{
        base: "max-h-[85vh] bg-white",
        body: "p-6",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200",
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold truncate text-gray-900">
                  {file.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {file.size} • {file.category}
                </p>
              </div>
            </ModalHeader>

            <ModalBody className="flex items-center justify-center bg-gray-50">
              {isPDF ? (
                <div className="w-full">
                  {error && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button
                        className="bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                        onPress={onDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}

                  {!error && (
                    <div className="flex flex-col items-center">
                      <Document
                        file={previewUrl}
                        loading={
                          <div className="flex items-center justify-center py-12">
                            <Spinner color="success" size="lg" />
                          </div>
                        }
                        options={PDF_OPTIONS}
                        onLoadError={onDocumentLoadError}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page
                          className="shadow-lg rounded-lg"
                          pageNumber={pageNumber}
                          renderAnnotationLayer={true}
                          renderTextLayer={true}
                          width={Math.min(
                            typeof window !== "undefined"
                              ? window.innerWidth * 0.8
                              : 800,
                            800,
                          )}
                        />
                      </Document>

                      {!loading && numPages > 0 && (
                        <div className="flex items-center justify-center gap-4 mt-6 pb-4">
                          <Button
                            isIconOnly
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            isDisabled={pageNumber <= 1}
                            size="sm"
                            onPress={goToPrevPage}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-gray-700 font-medium">
                            Page {pageNumber} of {numPages}
                          </span>
                          <Button
                            isIconOnly
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            isDisabled={pageNumber >= numPages}
                            size="sm"
                            onPress={goToNextPage}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : isImage ? (
                <div
                  key={previewUrl}
                  className="w-full flex flex-col items-center justify-center py-8"
                >
                  {loading && !error && (
                    <div className="flex items-center justify-center py-12">
                      <Spinner color="success" size="lg" />
                    </div>
                  )}
                  {!error && (
                    <div
                      className="relative w-full max-w-4xl"
                      style={{ height: "600px" }}
                    >
                      <Image
                        fill
                        unoptimized
                        alt={file.name}
                        className={`object-contain rounded-lg shadow-md transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                        src={previewUrl}
                        onError={() => {
                          setLoading(false);
                          setError("Failed to load image");
                        }}
                        onLoad={() => setLoading(false)}
                      />
                    </div>
                  )}
                  {error && (
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button
                        className="bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                        onPress={onDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                </div>
              ) : isDocument ? (
                <div className="w-full flex flex-col items-center justify-center py-12">
                  <div className="text-center max-w-md">
                    <div className="mb-6">
                      <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Download className="w-10 h-10 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Document Preview Not Available
                      </h4>
                      <p className="text-gray-600 mb-6">
                        Word documents (.doc, .docx) cannot be previewed in the
                        browser. Download the file to view it in Microsoft Word
                        or your preferred document editor.
                      </p>
                    </div>
                    <Button
                      className="bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                      size="lg"
                      onPress={onDownload}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Preview not available for this file type.
                    </p>
                    <Button
                      className="bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                      onPress={onDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="gap-3">
              <Button
                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                variant="bordered"
                onPress={onClose}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              {onDownload && (
                <Button
                  className="bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                  onPress={onDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
