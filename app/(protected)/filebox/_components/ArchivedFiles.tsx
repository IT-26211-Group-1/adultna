"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import { RotateCcw, Trash2, EllipsisVertical, Archive } from "lucide-react";
import {
  useFileboxArchivedFiles,
  useFileboxRestore,
  useFileboxPermanentDelete,
} from "@/hooks/queries/useFileboxQueries";
import { addToast } from "@heroui/toast";
import { ApiError } from "@/lib/apiClient";
import { logger } from "@/lib/logger";

type ArchivedFilesProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ArchivedFiles({ isOpen, onClose }: ArchivedFilesProps) {
  const {
    data: archivedFilesResponse,
    isLoading,
    error,
  } = useFileboxArchivedFiles();

  const restoreMutation = useFileboxRestore();
  const permanentDeleteMutation = useFileboxPermanentDelete();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const archivedFiles =
    archivedFilesResponse?.success && archivedFilesResponse.data?.files
      ? archivedFilesResponse.data.files
      : [];

  const handleRestore = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowRestoreConfirm(true);
  };

  const handlePermanentDelete = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowDeleteConfirm(true);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedFileId) return;

    try {
      await restoreMutation.mutateAsync(selectedFileId);
      addToast({
        title: "File restored successfully",
        color: "success",
      });
      setShowRestoreConfirm(false);
      setSelectedFileId(null);
    } catch (error) {
      logger.error("Restore error:", error);
      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to restore file",
          color: "danger",
        });
      }
    }
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!selectedFileId) return;

    try {
      await permanentDeleteMutation.mutateAsync(selectedFileId);
      addToast({
        title: "File permanently deleted",
        color: "success",
      });
      setShowDeleteConfirm(false);
      setSelectedFileId(null);
    } catch (error) {
      logger.error("Permanent delete error:", error);
      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to permanently delete file",
          color: "danger",
        });
      }
    }
  };

  const selectedFile = archivedFiles.find((f) => f.id === selectedFileId);

  return (
    <>
      <Modal
        isOpen={isOpen}
        scrollBehavior="inside"
        size="4xl"
        onClose={onClose}
      >
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <Archive className="w-5 h-5 text-warning" />
                <span>Archived Files</span>
              </ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-danger">
                    Failed to load archived files
                  </div>
                ) : archivedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No archived files
                  </div>
                ) : (
                  <Table aria-label="Archived files table">
                    <TableHeader>
                      <TableColumn>FILE NAME</TableColumn>
                      <TableColumn>CATEGORY</TableColumn>
                      <TableColumn>SIZE</TableColumn>
                      <TableColumn>ARCHIVED DATE</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {archivedFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.fileName}</TableCell>
                          <TableCell className="capitalize">
                            {file.category}
                          </TableCell>
                          <TableCell>
                            {(file.fileSize / 1024).toFixed(2)} KB
                          </TableCell>
                          <TableCell>
                            {file.deletedAt
                              ? new Date(file.deletedAt).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
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
                              <DropdownMenu aria-label="Archived file actions">
                                <DropdownItem
                                  key="restore"
                                  startContent={
                                    <RotateCcw className="w-4 h-4" />
                                  }
                                  onPress={() => handleRestore(file.id)}
                                >
                                  Restore
                                </DropdownItem>
                                <DropdownItem
                                  key="delete"
                                  className="text-danger"
                                  color="danger"
                                  startContent={<Trash2 className="w-4 h-4" />}
                                  onPress={() => handlePermanentDelete(file.id)}
                                >
                                  Permanently Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onCloseModal}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={showRestoreConfirm}
        size="md"
        onOpenChange={setShowRestoreConfirm}
      >
        <ModalContent>
          {(onCloseConfirm) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <RotateCcw className="w-5 h-5 text-success" />
                <span>Restore File</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to restore{" "}
                  <strong>{selectedFile?.fileName}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  This file will be moved back to your active files.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onCloseConfirm}
                >
                  Cancel
                </Button>
                <Button
                  color="success"
                  isLoading={restoreMutation.isPending}
                  onPress={handleRestoreConfirm}
                >
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        size="md"
        onOpenChange={setShowDeleteConfirm}
      >
        <ModalContent>
          {(onCloseConfirm) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <Trash2 className="w-5 h-5 text-danger" />
                <span>Permanently Delete File</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to permanently delete{" "}
                  <strong>{selectedFile?.fileName}</strong>?
                </p>
                <p className="text-sm text-danger-600 mt-2 font-semibold">
                  ⚠️ This action cannot be undone. The file will be permanently
                  removed from the system.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onCloseConfirm}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={permanentDeleteMutation.isPending}
                  onPress={handlePermanentDeleteConfirm}
                >
                  {permanentDeleteMutation.isPending
                    ? "Deleting..."
                    : "Permanently Delete"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
