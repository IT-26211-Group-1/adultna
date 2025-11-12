"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import {
  useGenerateUploadUrl,
  useUploadFile,
  useImportResume,
  useExportCoverLetter,
  useChangeTone,
} from "./queries/useCoverLetterQueries";
import type { CoverLetterStyle } from "@/types/cover-letter";

export function useCoverLetterEditor() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentCoverLetterId, setCurrentCoverLetterId] = useState<
    string | null
  >(null);
  const [selectedStyle, setSelectedStyle] = useState<CoverLetterStyle>("formal");

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

  const handleGenerateCoverLetter = async () => {
    if (!uploadedFile) return;

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
        title: `Cover Letter - ${new Date().toLocaleDateString()}`,
        style: selectedStyle,
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
      console.error(error);
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

  const handleChangeTone = async (newStyle: CoverLetterStyle) => {
    if (!currentCoverLetterId) return;

    try {
      await changeTone.mutateAsync({
        currentContent: "",
        newStyle,
      });
      addToast({
        title: "Tone changed successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Failed to change tone",
        color: "danger",
      });
      console.error(error);
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
