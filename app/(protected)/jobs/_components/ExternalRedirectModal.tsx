"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { LoadingButton } from "@/components/ui/Button";
import { ExternalLink, AlertTriangle } from "lucide-react";

type ExternalRedirectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  jobUrl: string;
  onConfirm: () => void;
};

export default function ExternalRedirectModal({
  isOpen,
  onClose,
  companyName,
  jobUrl,
  onConfirm,
}: ExternalRedirectModalProps) {
  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-md bg-black/30 z-[9999] fixed inset-0",
        wrapper: "z-[10000]",
        base: "z-[10001]",
      }}
      isOpen={isOpen}
      placement="center"
      portalContainer={
        typeof window !== "undefined" ? document.body : undefined
      }
      size="lg"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 px-6 pt-6 pb-2">
          <h3 className="text-lg font-semibold text-[#11553F]">
            You are leaving AdultNa
          </h3>
          <p className="text-xs text-gray-600">
            This will redirect you to an external job listing.
          </p>
        </ModalHeader>
        <ModalBody className="px-6 py-2">
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-amber-800 font-medium text-sm">
                  You are being redirected to: {companyName}
                </p>
                <p className="text-amber-700 text-xs mt-1 break-all">
                  {jobUrl}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-700 leading-relaxed italic">
                <span className="font-medium text-[#11553F]">Disclaimer: </span>
                Always verify job legitimacy and never share personal
                information unless you&apos;re certain of the employer&apos;s
                authenticity.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="px-6 py-6 flex justify-end">
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-transparent border-0"
              onClick={onClose}
            >
              Cancel
            </button>
            <LoadingButton
              className="flex items-center justify-center gap-2 px-6 py-3 h-auto text-sm font-medium bg-[#11553F] hover:bg-[#0d4532] text-white rounded-lg border-0"
              onClick={onConfirm}
            >
              <span className="flex items-center gap-2">
                Continue
                <ExternalLink size={14} />
              </span>
            </LoadingButton>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
