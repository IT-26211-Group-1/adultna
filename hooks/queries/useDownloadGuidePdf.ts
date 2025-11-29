import { useMutation } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";

type DownloadPdfParams = {
  slug: string;
  language: "en" | "fil";
};

export function useDownloadGuidePdf() {
  return useMutation({
    mutationFn: async ({ slug, language }: DownloadPdfParams) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/guides/public/${slug}/pdf?lang=${language}`,
          {
            method: "GET",
            signal: controller.signal,
            headers: {
              Accept: "application/pdf",
            },
          },
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = "Failed to generate PDF";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `Server error: ${response.status}`;
          }

          throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/pdf")) {
          throw new Error("Invalid response format. Expected PDF.");
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("PDF file is empty");
        }

        return { blob, filename: `${slug}-${language}.pdf` };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === "AbortError") {
          throw new Error("PDF generation timeout. Please try again.");
        }

        throw error;
      }
    },
    onSuccess: ({ blob, filename }) => {
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);

        addToast({
          title: "PDF downloaded successfully",
          color: "success",
        });
      } catch (error) {
        addToast({
          title: "Failed to download PDF file",
          color: "danger",
        });
        throw error;
      }
    },
    onError: (error: Error) => {
      addToast({
        title: error.message || "Failed to generate PDF",
        color: "danger",
      });
    },
  });
}
