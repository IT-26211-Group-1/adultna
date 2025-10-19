"use client";

import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Eye, Download, Trash2, EllipsisVertical } from "lucide-react";
import { FileItem } from "./FileItem";
import {
  useFileboxDownload,
  useFileboxDelete,
} from "@/hooks/queries/useFileboxQueries";
import { addToast } from "@heroui/toast";
import { ApiError, ApiClient } from "@/lib/apiClient";
import { FileMetadata, OTPAction } from "@/types/filebox";
import { API_CONFIG } from "@/config/api";
import { FilePreview } from "./FilePreview";
import { SecureDocument } from "./SecureDocument";

interface FileActionsProps {
  file: FileItem;
  fileMetadata?: FileMetadata;
  viewType?: "grid" | "list";
}

export function FileActions({
  file,
  fileMetadata,
  viewType = "grid",
}: FileActionsProps) {
  const downloadMutation = useFileboxDownload();
  const deleteMutation = useFileboxDelete();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [secureAction, setSecureAction] = useState<OTPAction>("preview");

  const handleView = async () => {
    // Check if file is secure
    if (file.isSecure) {
      setSecureAction("preview");
      setShowSecureAccess(true);

      return;
    }
    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    setIsLoadingPreview(true);
    try {
      const response: any = await ApiClient.get(
        `/filebox/download/${fileMetadata.id}`,
        {},
        API_CONFIG.API_URL,
      );

      if (response.success && response.data?.downloadUrl) {
        setPreviewUrl(response.data.downloadUrl);
        onPreviewOpen();
      } else {
        throw new Error("Failed to generate preview URL");
      }
    } catch (error) {
      console.error("View error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to open file",
          color: "danger",
        });
      } else {
        addToast({
          title: "Failed to open file",
          color: "danger",
        });
      }
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownload = async () => {
    // Check if file is secure
    if (file.isSecure) {
      setSecureAction("download");
      setShowSecureAccess(true);

      return;
    }

    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    try {
      await downloadMutation.mutateAsync(fileMetadata);
      addToast({
        title: "Download started",
        color: "success",
      });
    } catch (error) {
      console.error("Download error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to download file",
          color: "danger",
        });
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    try {
      await deleteMutation.mutateAsync(fileMetadata.id);
      addToast({
        title: "File deleted successfully",
        color: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to delete file",
          color: "danger",
        });
      }
    }
  };

  const handleDelete = () => {
    // Check if file is secure
    if (file.isSecure) {
      setSecureAction("delete");
      setShowSecureAccess(true);

      return;
    }

    onDeleteOpen();
  };

  const handleSecureSuccess = (downloadUrl: string) => {
    if (secureAction === "preview") {
      // Open preview with the URL
      setPreviewUrl(downloadUrl);
      onPreviewOpen();
    } else if (secureAction === "delete") {
      // Proceed with delete confirmation
      onDeleteOpen();
    }
    // For download, SecureDocument handles it directly
  };

  if (viewType === "list") {
    // List view - show plain buttons based on the figma design
    return (
      <>
        {/* Secure Document OTP Modal */}
        {showSecureAccess && (
          <SecureDocument
            action={secureAction}
            file={file}
            onClose={() => setShowSecureAccess(false)}
            onSuccess={handleSecureSuccess}
          />
        )}

        <div className="flex items-center space-x-1">
          <Button
            isIconOnly
            className="text-gray-600 hover:text-blue-600"
            isDisabled={isLoadingPreview}
            size="sm"
            variant="light"
            onPress={handleView}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            className="text-gray-600 hover:text-green-600"
            isDisabled={downloadMutation.isPending}
            size="sm"
            variant="light"
            onPress={handleDownload}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            className="text-gray-600 hover:text-red-600"
            size="sm"
            variant="light"
            onPress={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* File Preview Modal */}
        <FilePreview
          file={file}
          fileMetadata={fileMetadata}
          isOpen={isPreviewOpen}
          previewUrl={previewUrl}
          onClose={onPreviewClose}
          onDownload={handleDownload}
        />

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete File
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete <strong>{file.name}</strong>
                    ? This action cannot be undone.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={deleteMutation.isPending}
                    onPress={async () => {
                      await handleDeleteConfirm();
                      onClose();
                    }}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Grid view - show dropdown only
  return (
    <>
      {/* Secure Document OTP Modal */}
      {showSecureAccess && (
        <SecureDocument
          action={secureAction}
          file={file}
          onClose={() => setShowSecureAccess(false)}
          onSuccess={handleSecureSuccess}
        />
      )}

      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              className="text-gray-600"
              size="sm"
              variant="light"
            >
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="File actions">
            <DropdownItem
              key="view"
              isDisabled={isLoadingPreview}
              startContent={<Eye className="w-4 h-4" />}
              onPress={handleView}
            >
              {isLoadingPreview ? "Opening..." : "View"}
            </DropdownItem>
            <DropdownItem
              key="download"
              isDisabled={downloadMutation.isPending}
              startContent={<Download className="w-4 h-4" />}
              onPress={handleDownload}
            >
              {downloadMutation.isPending ? "Downloading..." : "Download"}
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

      {/* File Preview Modal */}
      <FilePreview
        file={file}
        fileMetadata={fileMetadata}
        isOpen={isPreviewOpen}
        previewUrl={previewUrl}
        onClose={onPreviewClose}
        onDownload={handleDownload}
      />

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete File
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete <strong>{file.name}</strong>?
                  This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={deleteMutation.isPending}
                  onPress={async () => {
                    await handleDeleteConfirm();
                    onClose();
                  }}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
