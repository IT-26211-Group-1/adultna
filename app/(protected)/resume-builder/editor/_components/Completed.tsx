"use client";

import { Button } from "@heroui/react";
import ResumePreview from "./ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";
import { useExportResume } from "@/hooks/queries/useResumeQueries";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { Download, FileText, Sparkles, Users } from "lucide-react";

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
      router.push(
        `/resume-builder/editor?resumeId=${resumeData.id}&step=contact`,
      );
    }
  };

  const handleStartNewResume = () => {
    router.push("/resume-builder");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Resume Preview */}
            <div className="bg-gray-50 rounded-lg p-6 overflow-auto max-h-[85vh]">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Your Completed Resume</h2>
                </div>
                <p className="text-sm text-gray-600">Preview your professionally crafted resume</p>
              </div>
              <ResumePreview resumeData={resumeData} />
            </div>

            {/* Right: Success Message and Actions */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="bg-gray-50 rounded-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Congratulations! 🎉
                  </h1>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Your resume looks amazing and is ready to help you land your dream job. You've taken an important step toward your career goals!
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary Action - Export to PDF */}
                  <Button
                    className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    isLoading={exportResume.isPending}
                    onPress={handleExportToPDF}
                    startContent={!exportResume.isPending && <Download className="h-4 w-4" />}
                  >
                    {exportResume.isPending ? "Preparing PDF..." : "Download PDF"}
                  </Button>

                  {/* Secondary Actions */}
                  <Button
                    className="w-full py-2.5 text-sm font-medium border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                    variant="bordered"
                    onPress={handleEditResume}
                    startContent={<FileText className="h-3.5 w-3.5" />}
                  >
                    Edit Resume
                  </Button>

                  <Button
                    className="w-full py-2.5 text-sm font-medium border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                    variant="bordered"
                    onPress={handleStartNewResume}
                    startContent={<Sparkles className="h-3.5 w-3.5" />}
                  >
                    Create New Resume
                  </Button>
                </div>

                {/* Cover Letter Invitation */}
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0">
                      <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1 text-sm">Complete Your Application Package</h3>
                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        Stand out even more with a personalized cover letter! A well-written cover letter can increase your chances of landing an interview by up to 40%.
                      </p>
                      <Button
                        className="w-full text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                        size="sm"
                        onPress={() => router.push("/cover-letter")}
                      >
                        Create Cover Letter
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Encouragement Note */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 italic">
                    "Success is where preparation meets opportunity. You're prepared—now go find those opportunities!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
