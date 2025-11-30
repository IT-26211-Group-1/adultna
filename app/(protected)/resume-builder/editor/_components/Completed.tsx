"use client";

import { Button } from "@heroui/react";
import ResumePreview from "./ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";
import { useExportResume, useSaveToFilebox } from "@/hooks/queries/useResumeQueries";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { Download, FileText, Users, Save } from "lucide-react";

interface CompletedProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export default function Completed({ resumeData }: CompletedProps) {
  const router = useRouter();
  const exportResume = useExportResume();
  const saveToFilebox = useSaveToFilebox(resumeData.id || "");

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
      router.push(`/resume-builder/editor?resumeId=${resumeData.id}&step=summary`);
    }
  };

  const handleStartNewResume = () => {
    router.push("/resume-builder");
  };

  const handleSaveToFilebox = async () => {
    if (resumeData.id) {
      try {
        await saveToFilebox.mutateAsync();
        addToast({
          title: "Saved to Filebox!",
          description: "Your resume has been saved",
          color: "success",
        });
      } catch {
        addToast({ title: "Failed to save to Filebox", color: "danger" });
      }
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-5 mt-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Resume Complete
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="text-emerald-600">Your Resume is Ready!</span>
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your resume looks amazing and is ready to help you land your dream job. You&apos;ve taken an important step toward your career goals!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Resume Preview */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 overflow-auto max-h-[80vh]">
                <ResumePreview resumeData={resumeData} />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="w-full max-w-md space-y-8">

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    onClick={handleExportToPDF}
                    disabled={exportResume.isPending}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {exportResume.isPending ? (
                        "Preparing PDF..."
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    className="w-full px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:shadow-sm text-sm"
                    onClick={handleEditResume}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      Edit Resume
                    </div>
                  </button>

                  <button
                    className="w-full px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSaveToFilebox}
                    disabled={saveToFilebox.isPending}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {saveToFilebox.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save to Filebox
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    className="px-4 py-2 bg-transparent text-gray-600 rounded-lg font-medium transition-all duration-200 hover:text-gray-800 hover:bg-gray-50 text-sm"
                    onClick={handleStartNewResume}
                  >
                    Create New Resume
                  </button>
                </div>

                {/* Cover Letter Invitation */}
                <div className="border rounded-lg p-4" style={{borderColor: '#FCE2A9', backgroundColor: '#FEF3D9'}}>
                  <div className="mb-3">
                    <h3 className="text-small font-semibold mb-1" style={{color: '#D4A574'}}>
                      Ready to Take It to the Next Level?
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You&apos;re already doing amazing! Now let&apos;s add a personal touch with a cover letter that tells your unique story.
                    </p>
                  </div>
                  <button
                    className="w-full px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                    style={{backgroundColor: '#D4A574'}}
                    onClick={() => router.push("/cover-letter")}
                  >
                    Create Cover Letter
                  </button>
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
