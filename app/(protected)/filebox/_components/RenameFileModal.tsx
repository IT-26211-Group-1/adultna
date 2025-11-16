"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Edit3 } from "lucide-react";

type RenameFileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newFileName: string) => void;
  currentFileName: string;
  isLoading?: boolean;
};

export function RenameFileModal({
  isOpen,
  onClose,
  onRename,
  currentFileName,
  isLoading = false,
}: RenameFileModalProps) {
  const [newFileName, setNewFileName] = useState(currentFileName);
  const [error, setError] = useState("");

  const handleRename = () => {
    const trimmedName = newFileName.trim();

    if (!trimmedName) {
      setError("File name cannot be empty");

      return;
    }

    if (trimmedName === currentFileName) {
      setError("New file name is the same as current name");

      return;
    }

    if (trimmedName.length > 255) {
      setError("File name is too long (max 255 characters)");

      return;
    }

    onRename(trimmedName);
  };

  const handleClose = () => {
    setNewFileName(currentFileName);
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-3 items-center">
              <Edit3 className="w-5 h-5 text-success" />
              <span>Rename File</span>
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="File name"
                placeholder="Enter new file name"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleRename();
                  }
                }}
                errorMessage={error}
                isInvalid={!!error}
                isDisabled={isLoading}
                classNames={{
                  input: "text-base",
                  label: "text-sm",
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current name: {currentFileName}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={handleClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onPress={handleRename}
                isLoading={isLoading}
              >
                Rename
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
