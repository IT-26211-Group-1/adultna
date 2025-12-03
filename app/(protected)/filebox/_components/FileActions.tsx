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
import {
  Eye,
  Download,
  Trash2,
  EllipsisVertical,
  Edit3,
  Lock,
  LockOpen,
  Archive,
} from "lucide-react";
import { FileItem } from "./FileItem";
import {
  useFileboxDownload,
  useFileboxDelete,
  useFileboxRename,
  useToggleFileProtection,
  useFileboxArchive,
} from "@/hooks/queries/useFileboxQueries";
import { addToast } from "@heroui/toast";
import { ApiError, ApiClient } from "@/lib/apiClient";
import { FileMetadata, OTPAction } from "@/types/filebox";
import { API_CONFIG } from "@/config/api";
import { FilePreview } from "./FilePreview";
import { SecureDocument } from "./SecureDocument";
import { RenameFileModal } from "./RenameFileModal";
import { ReplaceFileConfirmation } from "./ReplaceFileConfirmation";
import { logger } from "@/lib/logger";

type FileActionsProps = {
  file: FileItem;
  fileMetadata?: FileMetadata;
  viewType?: "grid" | "list";
};

export function FileActions({
  file,
  fileMetadata,
  viewType = "grid",
}: FileActionsProps) {
  const downloadMutation = useFileboxDownload();
  const deleteMutation = useFileboxDelete();
  const archiveMutation = useFileboxArchive();
  const renameMutation = useFileboxRename();
  const toggleProtectionMutation = useToggleFileProtection();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onOpenChange: onArchiveOpenChange,
  } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isRenameOpen,
    onOpen: onRenameOpen,
    onClose: onRenameClose,
  } = useDisclosure();
  const {
    isOpen: isReplaceOpen,
    onOpen: onReplaceOpen,
    onClose: onReplaceClose,
  } = useDisclosure();
  const {
    isOpen: isUnprotectConfirmOpen,
    onOpen: onUnprotectConfirmOpen,
    onClose: onUnprotectConfirmClose,
  } = useDisclosure();
  const {
    isOpen: isProtectConfirmOpen,
    onOpen: onProtectConfirmOpen,
    onClose: onProtectConfirmClose,
  } = useDisclosure();

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showSecureAccess, setShowSecureAccess] = useState(false);
  const [secureAction, setSecureAction] = useState<OTPAction>("preview");
  const [pendingRename, setPendingRename] = useState<string | null>(null);
  const [verifiedOtp, setVerifiedOtp] = useState<string | null>(null);
  const [, setOtpVerifiedAt] = useState<number | null>(null);

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
        API_CONFIG.API_URL
      );

      if (response.success && response.data?.downloadUrl) {
        setPreviewUrl(response.data.downloadUrl);
        onPreviewOpen();
      } else {
        throw new Error("Failed to generate preview URL");
      }
    } catch (error) {
      logger.error("View error:", error);

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
      logger.error("Download error:", error);

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
      logger.error("Delete error:", error);

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

  const handleArchive = async () => {
    console.log("handleArchive function called");

    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });
      return;
    }

    if (file.isSecure) {
      console.log("File is secure, showing OTP modal");
      setSecureAction("archive");
      setShowSecureAccess(true);
      return;
    }

    // Archive directly without modal
    try {
      await archiveMutation.mutateAsync(fileMetadata.id);
      addToast({
        title: "File archived successfully",
        color: "success",
      });
    } catch (error) {
      logger.error("Archive error:", error);
      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to archive file",
          color: "danger",
        });
      } else {
        addToast({
          title: "Failed to archive file",
          color: "danger",
        });
      }
    }
  };
  const handleArchiveConfirm = async () => {
    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    try {
      await archiveMutation.mutateAsync(fileMetadata.id);
      addToast({
        title: "File archived successfully",
        color: "success",
      });
    } catch (error) {
      logger.error("Archive error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to archive file",
          color: "danger",
        });
      }
    }
  };

  const handleRenameClick = () => {
    // Check if file is secure
    if (file.isSecure) {
      setSecureAction("rename");
      setShowSecureAccess(true);

      return;
    }

    onRenameOpen();
  };

  const handleRename = async (newFileName: string, otp?: string) => {
    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    try {
      // Use verifiedOtp if available (from SecureDocument), otherwise use provided otp
      const otpToUse = verifiedOtp || otp;

      const response = await renameMutation.mutateAsync({
        fileId: fileMetadata.id,
        fileName: newFileName,
        otp: otpToUse,
        replaceDuplicate: false,
      });

      if (response.statusCode === 409) {
        setPendingRename(newFileName);
        onRenameClose();
        onReplaceOpen();

        return;
      }

      if (response.success) {
        addToast({
          title: "File renamed successfully",
          color: "success",
        });
        setVerifiedOtp(null); // Clear the stored OTP
        onRenameClose();
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Duplicate file detected - show modal instead of error toast
        setPendingRename(newFileName);
        onRenameClose();
        onReplaceOpen();

        return;
      }

      logger.error("Rename error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to rename file",
          color: "danger",
        });
      }
    }
  };

  const handleToggleProtection = async () => {
    if (!fileMetadata) {
      addToast({
        title: "File metadata not available",
        color: "danger",
      });

      return;
    }

    const newSecureState = !file.isSecure;

    // If unprotecting, require OTP
    if (file.isSecure && !newSecureState) {
      setSecureAction("unprotect");
      setShowSecureAccess(true);

      return;
    }

    // If protecting, show confirmation modal
    if (!file.isSecure && newSecureState) {
      onProtectConfirmOpen();

      return;
    }
  };

  const handleProtectConfirm = async () => {
    if (!fileMetadata) {
      return;
    }

    try {
      await toggleProtectionMutation.mutateAsync({
        fileId: fileMetadata.id,
        isSecure: true,
      });

      addToast({
        title: "File protected successfully",
        color: "success",
      });
      onProtectConfirmClose();
    } catch (error) {
      logger.error("Protect file error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to protect file",
          color: "danger",
        });
      }
    }
  };

  const handleReplaceConfirm = async () => {
    if (!fileMetadata || !pendingRename) {
      return;
    }

    try {
      const response = await renameMutation.mutateAsync({
        fileId: fileMetadata.id,
        fileName: pendingRename,
        replaceDuplicate: true,
        keepBoth: false,
      });

      if (response.success) {
        onReplaceClose();
        setPendingRename(null);
      }
    } catch (error) {
      logger.error("Replace error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to rename file",
          color: "danger",
        });
      }
    }
  };

  const handleKeepBothConfirm = async () => {
    if (!fileMetadata || !pendingRename) {
      return;
    }

    try {
      const response = await renameMutation.mutateAsync({
        fileId: fileMetadata.id,
        fileName: pendingRename,
        replaceDuplicate: false,
        keepBoth: true,
      });

      if (response.success) {
        addToast({
          title: response.message || "File renamed successfully",
          color: "success",
        });
        onReplaceClose();
        setPendingRename(null);
      }
    } catch (error) {
      logger.error("Keep both error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to rename file",
          color: "danger",
        });
      }
    }
  };

  const handleUnprotectConfirm = async () => {
    if (!fileMetadata) {
      return;
    }

    try {
      await toggleProtectionMutation.mutateAsync({
        fileId: fileMetadata.id,
        isSecure: false,
      });

      addToast({
        title: "File unprotected successfully",
        color: "success",
      });
      onUnprotectConfirmClose();
    } catch (error) {
      logger.error("Unprotect file error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to unprotect file",
          color: "danger",
        });
      }
    }
  };

  const handleSecureSuccess = async (downloadUrlOrOtp: string) => {
    if (secureAction === "preview") {
      // Open preview with the URL
      setPreviewUrl(downloadUrlOrOtp);
      onPreviewOpen();
    } else if (secureAction === "delete") {
      // Proceed with delete confirmation
      onDeleteOpen();
    } else if (secureAction === "archive") {
      // Proceed with archive confirmation
      onArchiveOpen();
    } else if (secureAction === "rename") {
      setVerifiedOtp(null); // No OTP needed since it was already verified and consumed
      setOtpVerifiedAt(Date.now()); // Track when it was verified
      onRenameOpen();
    } else if (secureAction === "unprotect") {
      // OTP verified, show confirmation dialog
      onUnprotectConfirmOpen();
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
            fileId={fileMetadata?.id}
            onClose={() => setShowSecureAccess(false)}
            onSuccess={handleSecureSuccess}
          />
        )}

        <div className="flex items-center space-x-1">
          {/* Primary Actions - Always Visible */}
          <Button
            isIconOnly
            className="text-gray-600 hover:text-blue-600"
            isDisabled={isLoadingPreview}
            size="sm"
            title="Preview file"
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
            title="Download"
            variant="light"
            onPress={handleDownload}
          >
            <Download className="w-4 h-4" />
          </Button>

          {/* Secondary Actions - Dropdown Menu */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                className="text-gray-600 hover:text-gray-800"
                size="sm"
                title="More actions"
                variant="light"
              >
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="File actions"
              onAction={(key) => {
                console.log("DropdownMenu onAction called with key:", key);
                if (key === "edit") handleRenameClick();
                else if (key === "protection") handleToggleProtection();
                else if (key === "archive") {
                  console.log("Archive action triggered from dropdown");
                  handleArchive();
                }
              }}
            >
              <DropdownItem
                key="edit"
                startContent={<Edit3 className="w-4 h-4" />}
              >
                Rename
              </DropdownItem>
              <DropdownItem
                key="protection"
                startContent={
                  file.isSecure ? (
                    <LockOpen className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )
                }
              >
                {file.isSecure ? "Unprotect" : "Protect"}
              </DropdownItem>
              <DropdownItem
                key="archive"
                className="text-warning"
                color="warning"
                startContent={<Archive className="w-4 h-4" />}
              >
                Archive
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

        {/* Rename Modal */}
        <RenameFileModal
          currentFileName={file.name}
          isLoading={renameMutation.isPending}
          isOpen={isRenameOpen}
          onClose={onRenameClose}
          onRename={handleRename}
        />

        {/* Replace Confirmation Modal */}
        <ReplaceFileConfirmation
          fileName={pendingRename || ""}
          isLoading={renameMutation.isPending}
          isOpen={isReplaceOpen}
          onClose={onReplaceClose}
          onKeepBoth={handleKeepBothConfirm}
          onReplace={handleReplaceConfirm}
        />

        {/* Unprotect Confirmation Modal */}
        <Modal
          isOpen={isUnprotectConfirmOpen}
          onOpenChange={onUnprotectConfirmClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex gap-2 items-center">
                  <LockOpen className="w-5 h-5 text-warning" />
                  <span>Unprotect File</span>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to remove protection from{" "}
                    <strong>{file.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    After unprotecting, anyone with access can view, download,
                    rename, or delete this file without verification.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="warning"
                    isLoading={toggleProtectionMutation.isPending}
                    onPress={async () => {
                      await handleUnprotectConfirm();
                      onClose();
                    }}
                  >
                    {toggleProtectionMutation.isPending
                      ? "Unprotecting..."
                      : "Unprotect"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Protect Confirmation Modal */}
        <Modal
          isOpen={isProtectConfirmOpen}
          onOpenChange={onProtectConfirmClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex gap-2 items-center">
                  <Lock className="w-5 h-5 text-success" />
                  <span>Protect File</span>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to protect{" "}
                    <strong>{file.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    After protecting, you will need to verify your identity with
                    an OTP code to view, download, rename, or delete this file.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    isLoading={toggleProtectionMutation.isPending}
                    onPress={async () => {
                      await handleProtectConfirm();
                      onClose();
                    }}
                  >
                    {toggleProtectionMutation.isPending
                      ? "Protecting..."
                      : "Protect"}
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
          fileId={fileMetadata?.id}
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
          <DropdownMenu
            aria-label="File actions"
            onAction={(key) => {
              console.log("Grid DropdownMenu onAction called with key:", key);
              if (key === "view") handleView();
              else if (key === "download") handleDownload();
              else if (key === "rename") handleRenameClick();
              else if (key === "protection") handleToggleProtection();
              else if (key === "archive") {
                console.log("Grid: Archive action triggered from dropdown");
                handleArchive();
              }
            }}
          >
            <DropdownItem
              key="view"
              isDisabled={isLoadingPreview}
              startContent={<Eye className="w-4 h-4" />}
            >
              {isLoadingPreview ? "Opening..." : "View"}
            </DropdownItem>
            <DropdownItem
              key="download"
              isDisabled={downloadMutation.isPending}
              startContent={<Download className="w-4 h-4" />}
            >
              {downloadMutation.isPending ? "Downloading..." : "Download"}
            </DropdownItem>
            <DropdownItem
              key="rename"
              startContent={<Edit3 className="w-4 h-4" />}
            >
              Rename
            </DropdownItem>
            <DropdownItem
              key="protection"
              startContent={
                file.isSecure ? (
                  <LockOpen className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )
              }
            >
              {file.isSecure ? "Unprotect" : "Protect"}
            </DropdownItem>
            <DropdownItem
              key="archive"
              className="text-warning"
              color="warning"
              startContent={<Archive className="w-4 h-4" />}
            >
              Archive
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

      {/* Rename Modal */}
      <RenameFileModal
        currentFileName={file.name}
        isLoading={renameMutation.isPending}
        isOpen={isRenameOpen}
        onClose={onRenameClose}
        onRename={handleRename}
      />

      {/* Replace Confirmation Modal */}
      <ReplaceFileConfirmation
        fileName={pendingRename || ""}
        isLoading={renameMutation.isPending}
        isOpen={isReplaceOpen}
        onClose={onReplaceClose}
        onKeepBoth={handleKeepBothConfirm}
        onReplace={handleReplaceConfirm}
      />

      {/* Unprotect Confirmation Modal */}
      <Modal
        isOpen={isUnprotectConfirmOpen}
        onOpenChange={onUnprotectConfirmClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <LockOpen className="w-5 h-5 text-warning" />
                <span>Unprotect File</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to remove protection from{" "}
                  <strong>{file.name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  After unprotecting, anyone with access can view, download,
                  rename, or delete this file without verification.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={toggleProtectionMutation.isPending}
                  onPress={async () => {
                    await handleUnprotectConfirm();
                    onClose();
                  }}
                >
                  {toggleProtectionMutation.isPending
                    ? "Unprotecting..."
                    : "Unprotect"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Protect Confirmation Modal */}
      <Modal isOpen={isProtectConfirmOpen} onOpenChange={onProtectConfirmClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <Lock className="w-5 h-5 text-success" />
                <span>Protect File</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to protect <strong>{file.name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  After protecting, you will need to verify your identity with
                  an OTP code to view, download, rename, or delete this file.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="success"
                  isLoading={toggleProtectionMutation.isPending}
                  onPress={async () => {
                    await handleProtectConfirm();
                    onClose();
                  }}
                >
                  {toggleProtectionMutation.isPending
                    ? "Protecting..."
                    : "Protect"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal isOpen={isArchiveOpen} onOpenChange={onArchiveOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <Archive className="w-5 h-5 text-warning" />
                <span>Archive File</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to archive <strong>{file.name}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Archived files can be restored later from the archived files
                  view.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="warning"
                  isLoading={archiveMutation.isPending}
                  onPress={async () => {
                    await handleArchiveConfirm();
                    onClose();
                  }}
                >
                  {archiveMutation.isPending ? "Archiving..." : "Archive"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
