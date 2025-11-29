"use client";

import { useState } from "react";
import { FileText, Download, ZoomIn, ZoomOut } from "lucide-react";

interface ResumePreviewProps {
  fileName: string;
  fileSize?: number;
  fileUrl?: string;
  className?: string;
}

export function ResumePreview({
  fileName,
  fileSize,
  fileUrl,
  className = "",
}: ResumePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [zoom, setZoom] = useState(100);

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 truncate max-w-xs">
                {fileName}
              </h3>
              {fileSize && (
                <p className="text-sm text-gray-500">
                  {formatFileSize(fileSize)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              disabled={zoom >= 150}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            {fileUrl && (
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-2"
                onClick={() => window.open(fileUrl, '_blank')}
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area - Sized for exact resume page dimensions */}
      <div className="bg-white relative overflow-hidden" style={{ width: '612px', height: '792px' }}>
        {fileUrl ? (
          <div className="h-full relative">
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading PDF preview...</p>
                </div>
              </div>
            )}

            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Preview not available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Unable to display PDF in this browser
                  </p>
                </div>
              </div>
            )}

            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=fit&view=FitH`}
              className="w-full h-full border-none"
              onLoad={() => {
                setIsLoaded(true);
                setHasError(false);
              }}
              onError={() => {
                setHasError(true);
                setIsLoaded(false);
              }}
              title="Resume Preview"
              style={{
                width: '100%',
                height: '100%',
                transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
                transformOrigin: 'top center'
              }}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {fileName}
              </h3>
              <p className="text-sm text-gray-500">
                Resume uploaded successfully
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Preview will be available after processing
              </p>
              {fileSize && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatFileSize(fileSize)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}