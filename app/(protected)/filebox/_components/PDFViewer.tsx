"use client";

import { useState } from "react";
import { Spinner } from "@heroui/react";

interface PDFViewerProps {
  previewUrl: string;
  onLoadError: (error: Error) => void;
}

export function PDFViewer({ previewUrl, onLoadError }: PDFViewerProps) {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="flex flex-col items-center w-full">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner color="success" size="lg" />
        </div>
      )}
      <iframe
        className="w-full rounded-lg shadow-lg"
        src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
        style={{
          height: "70vh",
          minHeight: "500px",
          display: loading ? "none" : "block"
        }}
        title="PDF Preview"
        onError={() => {
          setLoading(false);
          onLoadError(new Error("Failed to load PDF"));
        }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
