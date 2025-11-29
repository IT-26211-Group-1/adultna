"use client";

import { memo, useCallback } from "react";
import { Button } from "@heroui/button";
import { Download } from "lucide-react";
import { useDownloadGuidePdf } from "@/hooks/queries/useDownloadGuidePdf";
import { useLanguage } from "@/contexts/LanguageContext";

type DownloadPdfButtonProps = {
  slug: string;
};

const DownloadPdfButtonComponent = ({ slug }: DownloadPdfButtonProps) => {
  const { language } = useLanguage();
  const { mutate: downloadPdf, isPending } = useDownloadGuidePdf();

  const handleDownload = useCallback(() => {
    downloadPdf({ slug, language });
  }, [downloadPdf, slug, language]);

  const languageLabel = language === "en" ? "English" : "Filipino";
  const ariaLabel = isPending
    ? `Generating PDF in ${languageLabel}...`
    : `Download guide as PDF in ${languageLabel}`;

  return (
    <Button
      aria-label={ariaLabel}
      aria-busy={isPending}
      className="border-adult-green text-adult-green hover:bg-adult-green/10 focus-visible:ring-2 focus-visible:ring-adult-green focus-visible:ring-offset-2"
      isDisabled={isPending}
      isLoading={isPending}
      size="sm"
      startContent={!isPending ? <Download className="w-4 h-4" aria-hidden="true" /> : undefined}
      variant="bordered"
      onPress={handleDownload}
    >
      <span className="sr-only">{ariaLabel}</span>
      <span aria-hidden="true">
        {isPending ? "Generating PDF..." : "Download PDF"}
      </span>
    </Button>
  );
};

export const DownloadPdfButton = memo(DownloadPdfButtonComponent);
