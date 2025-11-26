"use client";

import { UploadDocument } from "./UploadDocument";
import { SecureDocument } from "./SecureDocument";
import { FilePreview } from "./FilePreview";
import { FileItem } from "./FileItem";
import { OTPAction } from "@/types/filebox";

type FileboxModalsProps = {
  showUpload: boolean;
  showSecureAccess: boolean;
  showPreview: boolean;
  selectedFile: FileItem | null;
  previewUrl: string;
  secureAction: OTPAction;
  fileMetadataMap: Map<string, any>;
  onCloseUpload: () => void;
  onCloseSecureAccess: () => void;
  onClosePreview: () => void;
  onSecureSuccess: (downloadUrl: string) => void;
  onDownload: () => void;
};

export function FileboxModals({
  showUpload,
  showSecureAccess,
  showPreview,
  selectedFile,
  previewUrl,
  secureAction,
  fileMetadataMap,
  onCloseUpload,
  onCloseSecureAccess,
  onClosePreview,
  onSecureSuccess,
  onDownload,
}: FileboxModalsProps) {
  return (
    <>
      {showUpload && <UploadDocument onClose={onCloseUpload} />}

      {selectedFile && (
        <SecureDocument
          action={secureAction}
          file={selectedFile}
          isOpen={showSecureAccess}
          onClose={onCloseSecureAccess}
          onSuccess={onSecureSuccess}
        />
      )}

      {showPreview && selectedFile && (
        <FilePreview
          file={selectedFile}
          fileMetadata={fileMetadataMap.get(selectedFile.id)}
          isOpen={showPreview}
          previewUrl={previewUrl}
          onClose={onClosePreview}
          onDownload={onDownload}
        />
      )}
    </>
  );
}
