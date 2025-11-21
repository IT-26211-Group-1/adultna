"use client";
import { CategoriesUpload } from "./CategoriesUpload";
import { Upload } from "lucide-react";
import { Button, Switch, useDisclosure } from "@heroui/react";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  uploadDocumentSchema,
  type UploadDocumentForm,
} from "@/validators/fileBoxSchema";
import {
  useFileboxUpload,
  useFileboxQuota,
} from "@/hooks/queries/useFileboxQueries";
import { addToast } from "@heroui/toast";
import { ApiError } from "@/lib/apiClient";
import { formatFileSize } from "@/types/filebox";
import { logger } from "@/lib/logger";
import { ReplaceFileConfirmation } from "./ReplaceFileConfirmation";
import { Modal } from "@/components/ui/Modal";

interface UploadDocumentProps {
  onClose?: () => void;
}

export function UploadDocument({ onClose }: UploadDocumentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [pendingUpload, setPendingUpload] = useState<UploadDocumentForm | null>(
    null,
  );
  const {
    isOpen: isReplaceOpen,
    onOpen: onReplaceOpen,
    onClose: onReplaceClose,
  } = useDisclosure();

  const { data: quotaResponse } = useFileboxQuota();
  const quota = quotaResponse?.data;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<UploadDocumentForm>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      isSecure: false,
    },
    mode: "onChange",
  });

  const watchedFile = watch("file");

  // Validate storage quota when file is selected
  const validateStorageQuota = (file: File): boolean => {
    if (!quota) {
      setStorageError("Unable to check storage quota");

      return false;
    }

    if (quota.isQuotaExceeded) {
      setStorageError(
        "Storage quota exceeded. Please delete some files to free up space.",
      );

      return false;
    }

    if (file.size > quota.remainingStorageBytes) {
      setStorageError(
        `File size (${formatFileSize(file.size)}) exceeds available storage (${formatFileSize(quota.remainingStorageBytes)})`,
      );

      return false;
    }

    setStorageError(null);

    return true;
  };
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (validateStorageQuota(file)) {
        setValue("file", file, { shouldValidate: true });
      } else {
        // Clear the file input
        event.target.value = "";
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      if (validateStorageQuota(file)) {
        setValue("file", file, { shouldValidate: true });
      }
    }
  };

  const handleRemoveFile = () => {
    setValue("file", null as any);
    setStorageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadMutation = useFileboxUpload();

  const handleCancel = () => {
    onClose?.();
  };

  const onSubmit = async (data: UploadDocumentForm) => {
    // Final validation before upload
    if (!validateStorageQuota(data.file)) {
      addToast({
        title: storageError || "Storage quota exceeded",
        color: "danger",
      });

      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        file: data.file,
        category: data.category,
        isSecure: data.isSecure || false,
        replaceDuplicate: false,
      });

      if (result.statusCode === 409) {
        setPendingUpload(data);
        onReplaceOpen();

        return;
      }

      if (result.success) {
        addToast({
          title: "Document uploaded successfully",
          color: "success",
        });

        onClose?.();
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Duplicate file detected - show modal
        setPendingUpload(data);
        onReplaceOpen();

        return;
      }

      logger.error("Upload error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to upload document",
          color: "danger",
        });
      } else {
        addToast({
          title: "An unexpected error occurred",
          color: "danger",
        });
      }
    }
  };

  const handleReplaceConfirm = async () => {
    if (!pendingUpload) {
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        file: pendingUpload.file,
        category: pendingUpload.category,
        isSecure: pendingUpload.isSecure || false,
        replaceDuplicate: true,
        keepBoth: false,
      });

      if (result.success) {
        addToast({
          title: "File uploaded successfuly",
          color: "success",
        });

        onReplaceClose();
        setPendingUpload(null);
        onClose?.();
      }
    } catch (error) {
      logger.error("Replace upload error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to upload document",
          color: "danger",
        });
      }
    }
  };

  const handleKeepBothConfirm = async () => {
    if (!pendingUpload) {
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync({
        file: pendingUpload.file,
        category: pendingUpload.category,
        isSecure: pendingUpload.isSecure || false,
        replaceDuplicate: false,
        keepBoth: true,
      });

      if (result.success) {
        addToast({
          title: "Document uploaded successfully",
          color: "success",
        });

        onReplaceClose();
        setPendingUpload(null);
        onClose?.();
      }
    } catch (error) {
      logger.error("Keep both upload error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to upload document",
          color: "danger",
        });
      }
    }
  };

  return (
    <>
      <Modal
        open={!isReplaceOpen}
        onClose={handleCancel}
        title="Upload a New Document"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center space-y-6">
            {/* Error Messages */}
            {errors.file && (
              <p className="text-sm text-red-600">{errors.file.message}</p>
            )}
            {storageError && (
              <p className="text-sm text-red-600 font-medium">
                {storageError}
              </p>
            )}

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : watchedFile
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              onClick={handleBrowseClick}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {watchedFile ? (
                // File uploaded state
                <div className="space-y-4">
                  <div className="text-green-500">
                    <Upload className="mx-auto h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {watchedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(watchedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => handleRemoveFile()}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                // Default upload state
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <Upload className="mx-auto h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {isDragOver
                        ? "Drop your document here"
                        : "Choose a file or drag & drop it here"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, JPG, PNG up to 10MB
                  </p>
                  <Button
                    size="md"
                    variant="bordered"
                    className="bg-white"
                    onPress={() => handleBrowseClick()}
                  >
                    Browse File
                  </Button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <Controller
              control={control}
              name="file"
              render={({ field: _field }) => (
                <input
                  ref={fileInputRef}
                  accept=".pdf,.docx,.doc,.jpg,.png"
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFileSelect}
                />
              )}
            />
          </div>

          <hr className="border-gray-200" />

          {/* Category Section */}
          <div className="space-y-3">
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="category-select"
              >
                Document Category
              </label>
              <p className="text-xs text-gray-500">
                Choose a category to organize your document
              </p>
            </div>
            {errors.category && (
              <p className="text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <CategoriesUpload
                  id="category-select"
                  placeholder="Select a category..."
                  selectedCategory={field.value}
                  onSelectionChange={field.onChange}
                  className="w-full"
                />
              )}
            />
          </div>

          {/* Secure Access Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Secure Access</h4>
              <p className="text-xs text-gray-500 mt-1">
                Require OTP verification to access this document
              </p>
            </div>
            <Controller
              control={control}
              name="isSecure"
              render={({ field }) => (
                <Switch
                  isSelected={field.value}
                  onValueChange={field.onChange}
                  size="md"
                  color="success"
                  classNames={{
                    wrapper: "mr-0",
                  }}
                />
              )}
            />
          </div>

          {/* Action Buttons - Right aligned */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="bordered"
              size="md"
              onPress={handleCancel}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="md"
              className="bg-adult-green hover:bg-adult-green/90 text-white px-6"
              isDisabled={
                !isValid || uploadMutation.isPending || !!storageError
              }
              isLoading={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Replace Confirmation Modal */}
      <ReplaceFileConfirmation
        fileName={pendingUpload?.file.name || ""}
        isLoading={uploadMutation.isPending}
        isOpen={isReplaceOpen}
        onClose={() => {
          onReplaceClose();
          setPendingUpload(null);
        }}
        onKeepBoth={handleKeepBothConfirm}
        onReplace={handleReplaceConfirm}
      />
    </>
  );
}
