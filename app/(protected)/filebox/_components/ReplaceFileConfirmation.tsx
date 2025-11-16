"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle } from "lucide-react";

type ReplaceFileConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  isLoading?: boolean;
};

export function ReplaceFileConfirmation({
  isOpen,
  onClose,
  onConfirm,
  fileName,
  isLoading = false,
}: ReplaceFileConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center text-warning">
              <AlertTriangle className="w-6 h-6" />
              <span>Replace Existing File?</span>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700">
                A file named <strong>{fileName}</strong> already exists. Do you
                want to replace it?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. The existing file will be
                permanently deleted.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="warning"
                onPress={onConfirm}
                isLoading={isLoading}
              >
                Replace
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
