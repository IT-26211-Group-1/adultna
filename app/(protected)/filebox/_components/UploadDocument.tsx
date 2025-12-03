"use client";
import { CategoriesUpload } from "./CategoriesUpload";
import { Upload, X, FileIcon } from "lucide-react";
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

interface FileUploadStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error" | "duplicate";
  error?: string;
}

const MAX_FILES = 10;

export function UploadDocument({ onClose }: UploadDocumentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<UploadDocumentForm | null>(
    null
  );
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
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
  const watchedCategory = watch("category");

  // Validate storage quota for multiple files
  const validateStorageQuota = (filesToValidate: File[]): boolean => {
    if (!quota) {
      setStorageError("Unable to check storage quota");
      return false;
    }

    if (quota.isQuotaExceeded) {
      setStorageError(
        "Storage quota exceeded. Please delete some files to free up space."
      );
      return false;
    }

    const totalSize = filesToValidate.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > quota.remainingStorageBytes) {
      setStorageError(
        `Total file size (${formatFileSize(totalSize)}) exceeds available storage (${formatFileSize(quota.remainingStorageBytes)})`
      );
      return false;
    }

    setStorageError(null);
    return true;
  };
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const addFiles = (newFiles: File[]) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Filter out duplicates and files that are too large
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        addToast({
          title: `${file.name} is too large (max ${formatFileSize(MAX_FILE_SIZE)})`,
          color: "warning",
        });
        return false;
      }

      if (
        files.some(
          (f) => f.file.name === file.name && f.file.size === file.size
        )
      ) {
        return false;
      }

      return true;
    });

    if (files.length + validFiles.length > MAX_FILES) {
      addToast({
        title: `Maximum ${MAX_FILES} files allowed`,
        color: "warning",
      });
      return;
    }

    const newFileStatuses: FileUploadStatus[] = validFiles.map((file) => ({
      file,
      status: "pending",
    }));

    const allFiles = [...files, ...newFileStatuses];
    setFiles(allFiles);

    // Validate storage quota
    validateStorageQuota(allFiles.map((f) => f.file));

    // Set first file to the form for validation compatibility
    if (allFiles.length > 0 && !watchedFile) {
      setValue("file", allFiles[0].file, { shouldValidate: true });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
    // Reset input to allow selecting the same files again
    event.target.value = "";
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
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setStorageError(null);

    if (updatedFiles.length > 0) {
      validateStorageQuota(updatedFiles.map((f) => f.file));
      setValue("file", updatedFiles[0].file, { shouldValidate: true });
    } else {
      setValue("file", null as any);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadMutation = useFileboxUpload();

  const handleCancel = () => {
    onClose?.();
  };

  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  };

  const onSubmit = async (data: UploadDocumentForm) => {
    if (files.length === 0) {
      addToast({
        title: "Please select at least one file",
        color: "warning",
      });
      return;
    }

    // Final validation before upload
    if (!validateStorageQuota(files.map((f) => f.file))) {
      addToast({
        title: storageError || "Storage quota exceeded",
        color: "danger",
      });
      return;
    }

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      const fileStatus = files[i];

      if (fileStatus.status !== "pending") {
        continue;
      }

      // Create AbortController for this upload
      const controller = new AbortController();
      setAbortController(controller);

      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
      );

      try {
        const result = await uploadMutation.mutateAsync({
          file: fileStatus.file,
          category: data.category,
          isSecure: data.isSecure || false,
          replaceDuplicate: false,
          signal: controller.signal,
        });

        if (result.statusCode === 409) {
          // Duplicate file
          duplicateCount++;
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? { ...f, status: "duplicate", error: "File already exists" }
                : f
            )
          );
        } else if (result.success) {
          successCount++;
          setFiles((prev) =>
            prev.map((f, idx) => (idx === i ? { ...f, status: "success" } : f))
          );
        } else {
          errorCount++;
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    status: "error",
                    error: result.message || "Upload failed",
                  }
                : f
            )
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === "AbortError" || error.message === "Upload cancelled")
        ) {
          addToast({
            title: "Upload cancelled",
            color: "warning",
          });
          setIsUploading(false);
          return;
        }

        errorCount++;
        logger.error("Upload error:", error);

        const errorMessage =
          error instanceof ApiError
            ? error.message
            : "An unexpected error occurred";

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: errorMessage } : f
          )
        );
      }
    }

    setIsUploading(false);
    setAbortController(null);

    // Show summary toast
    const totalFiles = files.length;
    if (successCount === totalFiles) {
      addToast({
        title: `Successfully uploaded ${successCount} ${successCount === 1 ? "file" : "files"}`,
        color: "success",
      });
      onClose?.();
    } else if (successCount > 0) {
      const message = [];
      if (successCount > 0) message.push(`${successCount} uploaded`);
      if (duplicateCount > 0)
        message.push(
          `${duplicateCount} duplicate${duplicateCount > 1 ? "s" : ""}`
        );
      if (errorCount > 0) message.push(`${errorCount} failed`);

      addToast({
        title: message.join(", "),
        color: "warning",
      });
    } else if (duplicateCount > 0 && errorCount === 0) {
      addToast({
        title: `${duplicateCount} file${duplicateCount > 1 ? "s" : ""} already exist${duplicateCount === 1 ? "s" : ""}`,
        color: "warning",
      });
    } else {
      addToast({
        title: `Failed to upload ${errorCount} file${errorCount > 1 ? "s" : ""}`,
        color: "danger",
      });
    }
  };

  const handleReplaceConfirm = async () => {
    if (!pendingUpload) {
      return;
    }

    // Create AbortController for this upload
    const controller = new AbortController();

    setAbortController(controller);

    try {
      const result = await uploadMutation.mutateAsync({
        file: pendingUpload.file,
        category: pendingUpload.category,
        isSecure: pendingUpload.isSecure || false,
        replaceDuplicate: true,
        keepBoth: false,
        signal: controller.signal,
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
      // Check if error is due to cancellation
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message === "Upload cancelled")
      ) {
        addToast({
          title: "Upload cancelled",
          color: "warning",
        });

        return;
      }

      logger.error("Replace upload error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to upload document",
          color: "danger",
        });
      }
    } finally {
      setAbortController(null);
    }
  };

  const handleKeepBothConfirm = async () => {
    if (!pendingUpload) {
      return;
    }

    // Create AbortController for this upload
    const controller = new AbortController();

    setAbortController(controller);

    try {
      const result = await uploadMutation.mutateAsync({
        file: pendingUpload.file,
        category: pendingUpload.category,
        isSecure: pendingUpload.isSecure || false,
        replaceDuplicate: false,
        keepBoth: true,
        signal: controller.signal,
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
      // Check if error is due to cancellation
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message === "Upload cancelled")
      ) {
        addToast({
          title: "Upload cancelled",
          color: "warning",
        });

        return;
      }

      logger.error("Keep both upload error:", error);

      if (error instanceof ApiError) {
        addToast({
          title: error.message || "Failed to upload document",
          color: "danger",
        });
      }
    } finally {
      setAbortController(null);
    }
  };

  return (
    <>
      <Modal
        open={!isReplaceOpen}
        size="md"
        title="Upload a New Document"
        onClose={handleCancel}
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center space-y-6">
            {/* Error Messages */}
            {errors.file && (
              <p className="text-sm text-red-600">{errors.file.message}</p>
            )}
            {storageError && (
              <p className="text-sm text-red-600 font-medium">{storageError}</p>
            )}

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-blue-400 bg-blue-50"
                  : files.length > 0
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
              role="button"
              tabIndex={0}
              onClick={handleBrowseClick}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBrowseClick();
                }
              }}
            >
              <div className="space-y-4">
                <div
                  className={
                    files.length > 0 ? "text-green-500" : "text-gray-400"
                  }
                >
                  <Upload className="mx-auto h-12 w-12" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {isDragOver
                      ? "Drop your documents here"
                      : files.length > 0
                        ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                        : "Choose files or drag & drop them here"}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  PDF, DOC, JPG, PNG up to 10MB each (max {MAX_FILES} files)
                </p>
                <Button
                  className="bg-white"
                  size="md"
                  variant="bordered"
                  onPress={() => handleBrowseClick()}
                >
                  {files.length > 0 ? "Add More Files" : "Browse Files"}
                </Button>
              </div>
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
                  multiple
                  type="file"
                  onChange={handleFileSelect}
                />
              )}
            />
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Selected Files ({files.length}/{MAX_FILES})
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((fileItem, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      fileItem.status === "success"
                        ? "bg-green-50 border-green-200"
                        : fileItem.status === "error"
                          ? "bg-red-50 border-red-200"
                          : fileItem.status === "duplicate"
                            ? "bg-yellow-50 border-yellow-200"
                            : fileItem.status === "uploading"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                        {fileItem.status === "uploading" && " - Uploading..."}
                        {fileItem.status === "success" && " - ✓ Uploaded"}
                        {fileItem.status === "error" &&
                          ` - Error: ${fileItem.error}`}
                        {fileItem.status === "duplicate" && " - Already exists"}
                      </p>
                    </div>
                    {fileItem.status === "pending" && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleRemoveFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className="border-gray-200" />

          {/* Category Section */}
          <div className="space-y-3">
            <div className="flex flex-col space-y-2">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="category-select"
              >
                Document Category <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500">
                Choose a category to organize your document
              </p>
            </div>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <CategoriesUpload
                  className="w-full"
                  id="category-select"
                  placeholder="Select a category..."
                  selectedCategory={field.value}
                  onSelectionChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Secure Access Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Secure Access
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Requires OTP verification to access this document
              </p>
            </div>
            <Controller
              control={control}
              name="isSecure"
              render={({ field }) => (
                <Switch
                  classNames={{
                    wrapper: "mr-0",
                  }}
                  color="success"
                  isSelected={field.value}
                  size="md"
                  onValueChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Action Buttons - Right aligned */}
          <div className="flex justify-end gap-3 pt-4">
            {isUploading ? (
              <>
                <Button
                  className="px-6 text-red-600 border-red-600 hover:bg-red-50"
                  size="md"
                  variant="bordered"
                  onPress={handleCancelUpload}
                >
                  Cancel Upload
                </Button>
                <Button
                  isDisabled
                  isLoading
                  className="bg-adult-green hover:bg-adult-green/90 text-white px-6"
                  size="md"
                  type="button"
                >
                  Uploading {files.filter((f) => f.status === "success").length}
                  /{files.length}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="px-6"
                  size="md"
                  variant="bordered"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-adult-green hover:bg-adult-green/90 text-white px-6"
                  isDisabled={!isValid || !!storageError || files.length === 0}
                  size="md"
                  type="submit"
                >
                  Upload {files.length > 0 ? `(${files.length})` : ""}
                </Button>
              </>
            )}
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
