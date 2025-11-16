"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoverLetterLanding } from "./CoverLetterLanding";
import { logger } from "@/lib/logger";
import {
  useGenerateUploadUrl,
  useUploadFile,
  useImportResume,
} from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";
import type { CoverLetterStyle } from "@/types/cover-letter";

export default function CoverLetterContainer() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] =
    useState<CoverLetterStyle>("professional");

  const generateUploadUrl = useGenerateUploadUrl();
  const uploadFile = useUploadFile();
  const importResume = useImportResume();

  const isProcessing =
    generateUploadUrl.isPending ||
    uploadFile.isPending ||
    importResume.isPending;

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleGenerateCoverLetter = async (newStyle: CoverLetterStyle) => {
    if (!uploadedFile) return;

    setSelectedStyle(newStyle);

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
        style: newStyle,
      });

      if (!coverLetter || !coverLetter.id) {
        throw new Error("Invalid cover letter response from server");
      }

      router.push(`/cover-letter/editor?id=${coverLetter.id}`);
    } catch (error) {
      addToast({
        title: "Failed to generate cover letter",
        color: "danger",
      });
      logger.error(error);
    }
  };

  return (
    <CoverLetterLanding
      isProcessing={isProcessing}
      selectedStyle={selectedStyle}
      uploadedFile={uploadedFile}
      onChangeTone={handleGenerateCoverLetter}
      onFileUpload={handleFileUpload}
      onRemoveFile={handleRemoveFile}
    />
  );
}
