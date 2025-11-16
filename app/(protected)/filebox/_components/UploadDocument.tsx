"use client";
import { Categories } from "./Categories";
import { Upload } from "lucide-react";
import { Card, CardBody, Button, Checkbox, useDisclosure } from "@heroui/react";
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

interface UploadDocumentProps {
  onClose?: () => void;
}

export function UploadDocument({ onClose }: UploadDocumentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [pendingUpload, setPendingUpload] = useState<UploadDocumentForm | null>(null);
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
      });

      if (result.success) {
        addToast({
          title: "Document uploaded and duplicate replaced",
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

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Upload a New Document
            </h1>
          </div>

          {/* Select File Section */}
          <div className="space-y-3 mb-6">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="file-upload"
            >
              Select File
            </label>
            {errors.file && (
              <p className="text-sm text-red-600">{errors.file.message}</p>
            )}
            {storageError && (
              <p className="text-sm text-red-600 font-medium">{storageError}</p>
            )}
            <Card
              className={`border-2 border-dashed transition-all duration-200 ${
                isDragOver
                  ? "border-green-400 bg-green-50"
                  : watchedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <CardBody
                className="p-12 text-center cursor-pointer"
                onClick={handleBrowseClick}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {watchedFile ? (
                  // File uploaded state
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {watchedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(watchedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button
                        color="default"
                        variant="bordered"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Default upload state
                  <div className="space-y-4">
                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {isDragOver
                          ? "Drop your document here"
                          : "Click to upload or drag and drop"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

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

          {/* Category Section */}
          <div className="space-y-3 mb-6">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="category-select"
            >
              Category
            </label>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Categories
                  id="category-select"
                  includeAllCategories={false}
                  placeholder="Select Category"
                  selectedCategory={field.value}
                  onSelectionChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Checkbox Section */}
          <div className="py-2 mb-8">
            <Controller
              control={control}
              name="isSecure"
              render={({ field }) => (
                <Checkbox
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                  isSelected={field.value}
                  size="md"
                  onValueChange={field.onChange}
                >
                  Enable secure access (OTP required)
                </Checkbox>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              variant="bordered"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 py-3 bg-adult-green hover:bg-adult-green/90 text-white font-medium"
              isDisabled={
                !isValid || uploadMutation.isPending || !!storageError
              }
              isLoading={uploadMutation.isPending}
              type="submit"
              variant="solid"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </div>

      {/* Replace Confirmation Modal */}
      <ReplaceFileConfirmation
        isOpen={isReplaceOpen}
        onClose={() => {
          onReplaceClose();
          setPendingUpload(null);
        }}
        onConfirm={handleReplaceConfirm}
        fileName={pendingUpload?.file.name || ""}
        isLoading={uploadMutation.isPending}
      />
    </div>
  );
}
