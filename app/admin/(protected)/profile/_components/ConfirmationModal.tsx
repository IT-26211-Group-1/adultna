import { Modal } from "@/components/ui/Modal";
import { Button } from "@heroui/react";
import { ReactNode } from "react";

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
};

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} size="sm" title={title} onClose={onClose}>
      <div className="space-y-6">
        {children || <p className="text-gray-600">{message}</p>}

        <div className="flex justify-end gap-3">
          <Button isDisabled={isLoading} variant="bordered" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            className="bg-adult-green text-white hover:bg-adult-green/80"
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
