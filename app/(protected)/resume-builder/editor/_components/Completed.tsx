"use client";

import { Button } from "@heroui/react";
import ResumePreview from "./ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";
import { useExportResume } from "@/hooks/queries/useResumeQueries";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

interface CompletedProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export default function Completed({ resumeData }: CompletedProps) {
  const router = useRouter();
  const exportResume = useExportResume();

  const handleExportToPDF = () => {
    if (resumeData.id) {
      exportResume.mutate(resumeData.id, {
        onSuccess: () => {
          addToast({
            title: "Resume exported successfully",
            color: "success",
          });
        },
        onError: (error: any) => {
          addToast({
            title: "Failed to export resume",
            description: error?.message || "Please try again",
            color: "danger",
          });
        },
      });
    }
  };

  const handleEditResume = () => {
    if (resumeData.id) {
      router.push(`/resume-builder/editor?resumeId=${resumeData.id}&step=contact`);
    }
  };

  const handleStartNewResume = () => {
    router.push("/resume-builder");
  };

  return (
    <div className="flex grow pt-16 flex-col">
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Resume Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8 overflow-auto max-h-[85vh]">
              <ResumePreview resumeData={resumeData} />
            </div>

            {/* Right: Success Message and Actions */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    You&apos;re all set!
                  </h1>
                  <p className="text-gray-600 italic">
                    Your resume is ready to go :)
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full py-3 text-base"
                    variant="bordered"
                    onPress={handleEditResume}
                  >
                    Edit Resume
                  </Button>

                  <Button
                    className="w-full py-3 text-base"
                    isLoading={exportResume.isPending}
                    variant="bordered"
                    onPress={handleExportToPDF}
                  >
                    {exportResume.isPending ? "Exporting..." : "Export to PDF"}
                  </Button>

                  <Button
                    className="w-full py-3 text-base"
                    variant="bordered"
                    onPress={() => router.push("/cover-letters")}
                  >
                    Create Cover Letter
                  </Button>

                  <Button
                    className="w-full py-3 text-base"
                    variant="bordered"
                    onPress={handleStartNewResume}
                  >
                    Start New Resume
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
