"use client";

import { Button } from "@heroui/button";
import { Download } from "lucide-react";
import { useDownloadGuidePdf } from "@/hooks/queries/useDownloadGuidePdf";
import { useLanguage } from "@/contexts/LanguageContext";

type DownloadPdfButtonProps = {
  slug: string;
};

export function DownloadPdfButton({ slug }: DownloadPdfButtonProps) {
  const { language } = useLanguage();
  const { mutate: downloadPdf, isPending } = useDownloadGuidePdf();

  const handleDownload = () => {
    downloadPdf({ slug, language });
  };

  return (
    <Button
      aria-label="Download guide as PDF"
      className="border-adult-green text-adult-green hover:bg-adult-green/10"
      isLoading={isPending}
      size="sm"
      startContent={!isPending ? <Download className="w-4 h-4" /> : undefined}
      variant="bordered"
      onPress={handleDownload}
    >
      {isPending ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
}
