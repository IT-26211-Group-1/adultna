"use client";

import React, { useState } from "react";
import { Trash2Icon, ArchiveIcon, ArchiveRestoreIcon } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/react";
import { useGuidesQueries } from "@/hooks/queries/admin/useGuidesQueries";
import type { BatchOperationResponse } from "@/hooks/queries/admin/useGuidesQueries";

type BatchGuideActionsProps = {
  selectedGuideIds: string[];
  onClearSelection: () => void;
  isArchiveView?: boolean;
};

export function BatchGuideActions({
  selectedGuideIds,
  onClearSelection,
  isArchiveView = false,
}: BatchGuideActionsProps) {
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
    useState(false);

  const {
    batchArchiveGuidesAsync,
    isBatchArchiving,
    batchRestoreGuidesAsync,
    isBatchRestoring,
    batchPermanentDeleteGuidesAsync,
    isBatchPermanentDeleting,
  } = useGuidesQueries();

  const selectedCount = selectedGuideIds.length;

  const handleBatchArchive = async () => {
    try {
      const result = (await batchArchiveGuidesAsync(
        selectedGuideIds
      )) as BatchOperationResponse;

      if (result.success) {
        addToast({
          title: "Batch Archive Completed",
          description: `${result.results.successful.length} guide(s) archived successfully. ${result.results.failed.length} failed.`,
          color: "success",
        });

        if (result.results.failed.length > 0) {
          console.error("Failed guides:", result.results.failed);
        }

        onClearSelection();
      }
    } catch (error) {
      addToast({
        title: "Batch Archive Failed",
        description: "An error occurred while archiving guides",
        color: "danger",
      });
    } finally {
      setShowArchiveModal(false);
    }
  };

  const handleBatchRestore = async () => {
    try {
      const result = (await batchRestoreGuidesAsync(
        selectedGuideIds
      )) as BatchOperationResponse;

      if (result.success) {
        addToast({
          title: "Batch Restore Completed",
          description: `${result.results.successful.length} guide(s) restored successfully. ${result.results.failed.length} failed.`,
          color: "success",
        });

        if (result.results.failed.length > 0) {
          console.error("Failed guides:", result.results.failed);
        }

        onClearSelection();
      }
    } catch (error) {
      addToast({
        title: "Batch Restore Failed",
        description: "An error occurred while restoring guides",
        color: "danger",
      });
    } finally {
      setShowRestoreModal(false);
    }
  };

  const handleBatchPermanentDelete = async () => {
    try {
      const result = (await batchPermanentDeleteGuidesAsync(
        selectedGuideIds
      )) as BatchOperationResponse;

      if (result.success) {
        addToast({
          title: "Batch Delete Completed",
          description: `${result.results.successful.length} guide(s) permanently deleted. ${result.results.failed.length} failed.`,
          color: "success",
        });

        if (result.results.failed.length > 0) {
          console.error("Failed guides:", result.results.failed);
        }

        onClearSelection();
      }
    } catch (error) {
      addToast({
        title: "Batch Delete Failed",
        description: "An error occurred while permanently deleting guides",
        color: "danger",
      });
    } finally {
      setShowPermanentDeleteModal(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between bg-adult-green/5 border border-adult-green/20 rounded-xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">
            {selectedCount} guide{selectedCount > 1 ? "s" : ""} selected
          </span>
          <button
            className="text-sm text-adult-green hover:text-adult-green/80 font-medium transition-colors duration-200"
            onClick={onClearSelection}
          >
            Clear selection
          </button>
        </div>

        <div className="flex items-center gap-3">
          {!isArchiveView ? (
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-adult-green hover:bg-adult-green/90 text-white rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg shadow-adult-green/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              disabled={isBatchArchiving}
              onClick={() => setShowArchiveModal(true)}
            >
              <ArchiveIcon className="w-4 h-4" />
              {isBatchArchiving ? "Archiving..." : "Archive Selected"}
            </button>
          ) : (
            <>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-adult-green hover:bg-adult-green/90 text-white rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg shadow-adult-green/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={isBatchRestoring}
                onClick={() => setShowRestoreModal(true)}
              >
                <ArchiveRestoreIcon className="w-4 h-4" />
                {isBatchRestoring ? "Restoring..." : "Restore Selected"}
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={isBatchPermanentDeleting}
                onClick={() => setShowPermanentDeleteModal(true)}
              >
                <Trash2Icon className="w-4 h-4" />
                {isBatchPermanentDeleting
                  ? "Deleting..."
                  : "Permanently Delete Selected"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Archive Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
      >
        <ModalContent>
          <ModalHeader>Archive Guides</ModalHeader>
          <ModalBody>
            <p className="text-gray-700">
              Are you sure you want to archive {selectedCount} guide
              {selectedCount > 1 ? "s" : ""}? They can be restored later.
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => setShowArchiveModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-white bg-adult-green rounded-lg hover:bg-adult-green/90 transition-all duration-200 hover:shadow-lg shadow-adult-green/25"
              onClick={handleBatchArchive}
            >
              Archive
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
      >
        <ModalContent>
          <ModalHeader>Restore Guides</ModalHeader>
          <ModalBody>
            <p className="text-gray-700">
              Are you sure you want to restore {selectedCount} guide
              {selectedCount > 1 ? "s" : ""}?
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => setShowRestoreModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-white bg-adult-green rounded-lg hover:bg-adult-green/90 transition-all duration-200 hover:shadow-lg shadow-adult-green/25"
              onClick={handleBatchRestore}
            >
              Restore
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Permanent Delete Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={showPermanentDeleteModal}
        onClose={() => setShowPermanentDeleteModal(false)}
      >
        <ModalContent>
          <ModalHeader>Permanently Delete Guides</ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <p className="text-gray-700 font-semibold">
                WARNING: This action cannot be undone!
              </p>
              <p className="text-gray-700">
                Are you sure you want to permanently delete {selectedCount}{" "}
                guide
                {selectedCount > 1 ? "s" : ""}? This will remove them from the
                database completely.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => setShowPermanentDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-lg shadow-red-600/25"
              onClick={handleBatchPermanentDelete}
            >
              Permanently Delete
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
