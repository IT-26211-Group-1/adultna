"use client";

import { useState } from "react";
import { addToast } from "@heroui/toast";
import { logger } from "@/lib/logger";
import {
  useGenerateUploadUrl,
  useUploadFile,
  useImportResume,
  useExportCoverLetter,
  useChangeTone,
} from "./queries/useCoverLetterQueries";
import type { CoverLetterStyle } from "@/types/cover-letter";

export function useCoverLetterEditor() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentCoverLetterId, setCurrentCoverLetterId] = useState<
    string | null
  >(null);
  const [selectedStyle, setSelectedStyle] =
    useState<CoverLetterStyle>("formal");

  const generateUploadUrl = useGenerateUploadUrl();
  const uploadFile = useUploadFile();
  const importResume = useImportResume();
  const exportCoverLetter = useExportCoverLetter();
  const changeTone = useChangeTone(currentCoverLetterId || "");

  const isProcessing =
    generateUploadUrl.isPending ||
    uploadFile.isPending ||
    importResume.isPending;

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleGenerateCoverLetter = async (
    styleOverride?: CoverLetterStyle,
  ) => {
    if (!uploadedFile) return;

    const styleToUse = styleOverride || selectedStyle;

    try {
      const { uploadUrl, fileKey } = await generateUploadUrl.mutateAsync({
        fileName: uploadedFile.name,
        contentType: uploadedFile.type,
        fileSize: uploadedFile.size,
      });

      await uploadFile.mutateAsync({ uploadUrl, file: uploadedFile });

      const coverLetter = await importResume.mutateAsync({
        fileKey,
        fileName: uploadedFile.name,
        title: "Untitled Cover Letter",
        style: styleToUse,
      });

      if (!coverLetter || !coverLetter.id) {
        throw new Error("Invalid cover letter response from server");
      }

      setCurrentCoverLetterId(coverLetter.id);
      addToast({
        title: "Cover letter generated successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Failed to generate cover letter",
        color: "danger",
      });
      logger.error(error);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setCurrentCoverLetterId(null);
  };

  const handleDownloadPDF = async () => {
    if (!currentCoverLetterId) return;

    try {
      await exportCoverLetter.mutateAsync(currentCoverLetterId);
      addToast({
        title: "PDF downloaded successfully!",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to download PDF",
        color: "danger",
      });
    }
  };

  const handleChangeTone = async ({
    sectionId,
    currentContent,
    targetTone,
  }: {
    sectionId: string;
    currentContent: string;
    targetTone: string;
  }) => {
    if (!currentCoverLetterId) return;

    try {
      const result = await changeTone.mutateAsync({
        sectionId,
        currentContent,
        targetTone,
      });

      addToast({
        title: "Tone changed successfully!",
        color: "success",
      });

      return result;
    } catch (error) {
      addToast({
        title: "Failed to change tone",
        color: "danger",
      });
      logger.error(error);
      throw error;
    }
  };

  return {
    uploadedFile,
    currentCoverLetterId,
    isProcessing,
    selectedStyle,
    setSelectedStyle,
    handleFileUpload,
    handleGenerateCoverLetter,
    handleRemoveFile,
    handleDownloadPDF,
    handleChangeTone,
  };
}
