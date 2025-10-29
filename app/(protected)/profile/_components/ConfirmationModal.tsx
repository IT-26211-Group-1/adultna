import { Modal } from "@/components/ui/Modal";
import { Button } from "@heroui/react";

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
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
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} title={title} size="sm" onClose={onClose}>
      <div className="space-y-6">
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end gap-3">
          <Button
            variant="bordered"
            onClick={onClose}
            isDisabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className="bg-adult-green text-white hover:bg-adult-green/80"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
