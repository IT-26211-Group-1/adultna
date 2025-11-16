"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Radio,
  RadioGroup,
} from "@heroui/react";

type ReplaceFileConfirmationProps = {
  isOpen: boolean;
  onClose: () => void;
  onReplace: () => void;
  onKeepBoth: () => void;
  fileName: string;
  isLoading?: boolean;
};

export function ReplaceFileConfirmation({
  isOpen,
  onClose,
  onReplace,
  onKeepBoth,
  fileName,
  isLoading = false,
}: ReplaceFileConfirmationProps) {
  const [selectedOption, setSelectedOption] = useState("replace");

  const handleConfirm = () => {
    if (selectedOption === "replace") {
      onReplace();
    } else {
      onKeepBoth();
    }
  };

  return (
    <Modal
      classNames={{
        base: "bg-gray-900",
        header: "border-b border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-700",
      }}
      isOpen={isOpen}
      size="md"
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-white text-lg font-normal">
              Upload options
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-300 text-sm mb-4">
                {fileName} already exists in this location. Do you want to
                replace the existing file with a new version or keep both files?
                Replacing the file won't change sharing settings.
              </p>
              <RadioGroup
                classNames={{
                  base: "space-y-3",
                }}
                value={selectedOption}
                onValueChange={setSelectedOption}
              >
                <Radio
                  classNames={{
                    base: "m-0 p-0",
                    wrapper: "border-gray-600",
                    control: "bg-adult-green",
                    label: "text-white text-sm",
                  }}
                  value="replace"
                >
                  Replace existing file
                </Radio>
                <Radio
                  classNames={{
                    base: "m-0 p-0",
                    wrapper: "border-gray-600",
                    control: "bg-adult-green",
                    label: "text-white text-sm",
                  }}
                  value="keepBoth"
                >
                  Keep both files
                </Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter className="flex gap-3 justify-end">
              <Button
                className="text-blue-400 hover:bg-gray-800"
                isDisabled={isLoading}
                variant="light"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6"
                isLoading={isLoading}
                onPress={handleConfirm}
              >
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
