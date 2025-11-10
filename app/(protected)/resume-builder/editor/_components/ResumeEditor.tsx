"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import { LoadingButton } from "@/components/ui/Button";
import Completed from "./Completed";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ExportButton } from "./ExportButton";
import {
  useResume,
  useCreateResume,
  useUpdateResume,
  useExportResume,
} from "@/hooks/queries/useResumeQueries";
import { TemplateId, isValidTemplateId } from "@/constants/templates";
import {
  mapResumeDataToCreatePayload,
  mapResumeDataToUpdatePayload,
  mapApiResumeToResumeData,
} from "@/lib/resume/mappers";
import { addToast } from "@heroui/toast";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { debounce } from "@/lib/utils/debounce";
import InlineEditableTitle from "./InlineEditableTitle";
import { hasResumeChanged } from "@/lib/resume/diffResume";

export default function ResumeEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStep = searchParams.get("step") || steps[0].key;
  const templateId = searchParams.get("templateId") as TemplateId | null;
  const resumeId = searchParams.get("resumeId") || null;

  const { data: existingResume, isLoading: isLoadingResume } = useResume(
    resumeId || undefined,
  );

  const [loadedResumeId, setLoadedResumeId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(
    resumeId,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedDataRef = useRef<ResumeData | null>(null);
  const isInitialMount = useRef(true);

  const [resumeData, setResumeData] = useState<ResumeData>(() =>
    existingResume
      ? mapApiResumeToResumeData(existingResume)
      : ({} as ResumeData),
  );

  useEffect(() => {
    if (existingResume && loadedResumeId !== existingResume.id) {
      setResumeData(mapApiResumeToResumeData(existingResume));
      setLoadedResumeId(existingResume.id);
      setCurrentResumeId(existingResume.id);
    }
  }, [existingResume?.id]);

  const createResume = useCreateResume();
  const updateResume = useUpdateResume(currentResumeId || "");
  const exportResume = useExportResume();

  const isSaving = createResume.isPending || updateResume.isPending;
  const isExporting = exportResume.isPending;

  const FormComponent = steps.find(
    (step) => step.key === currentStep,
  )?.component;
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const currentStepTitle = steps.find(
    (step) => step.key === currentStep,
  )?.title;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isContactForm = currentStep === "contact";

  const isFormValid = useMemo(() => {
    switch (currentStep) {
      case "contact":
        return !!(
          resumeData.firstName &&
          resumeData.lastName &&
          resumeData.email &&
          resumeData.phone
        );
      case "work":
      case "education":
      case "certifications":
      case "skills":
      case "summary":
        return true;
      default:
        return true;
    }
  }, [resumeData, currentStep]);

  const handleSave = useCallback(
    async (onSuccessCallback?: () => void) => {
      if (!currentResumeId && templateId && isValidTemplateId(templateId)) {
        const payload = mapResumeDataToCreatePayload(resumeData, templateId);

        createResume.mutate(payload, {
          onSuccess: (newResume) => {
            setCurrentResumeId(newResume.id);
            setHasUnsavedChanges(false);
            lastSavedDataRef.current = { ...resumeData };
            const newParams = new URLSearchParams(searchParams);

            newParams.delete("templateId");
            newParams.set("resumeId", newResume.id);
            router.replace(`/resume-builder/editor?${newParams.toString()}`, {
              scroll: false,
            });
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
          onError: (error: any) => {
            addToast({
              title: "Failed to save resume",
              description: error?.message || "Please try again",
              color: "danger",
            });
          },
        });
      } else if (currentResumeId && resumeData.firstName) {
        const payload = mapResumeDataToUpdatePayload(resumeData);

        updateResume.mutate(payload, {
          onSuccess: () => {
            setHasUnsavedChanges(false);
            lastSavedDataRef.current = { ...resumeData };
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
          onError: (error: any) => {
            addToast({
              title: "Failed to update resume",
              description: error?.message || "Please try again",
              color: "danger",
            });
          },
        });
      } else {
        if (onSuccessCallback) {
          onSuccessCallback();
        }
      }
    },
    [
      currentResumeId,
      templateId,
      resumeData,
      createResume,
      updateResume,
      searchParams,
      router,
    ],
  );

  // Auto-save when resumeData changes
  const debouncedAutoSave = useMemo(
    () =>
      debounce(() => {
        if (!isInitialMount.current) {
          handleSave();
        }
      }, 1000),
    [handleSave],
  );

  useEffect(() => {
    // Skip on initial mount or when data is empty
    if (isInitialMount.current) {
      const hasData =
        Object.keys(resumeData).length > 0 && resumeData.firstName;

      if (hasData) {
        lastSavedDataRef.current = { ...resumeData };
        isInitialMount.current = false;
      }

      return;
    }

    // Check if data has actually changed using deep comparison
    if (hasResumeChanged(lastSavedDataRef.current, resumeData)) {
      setHasUnsavedChanges(true);
      debouncedAutoSave();
    }

    return () => {
      debouncedAutoSave.cancel();
    };
  }, [resumeData, debouncedAutoSave]);

  // Beforeunload handler to warn about data loss on refresh
  useEffect(() => {
    window.onbeforeunload = () => {
      return "Are you sure you want to refresh? Data might not be saved.";
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  if (!templateId && !resumeId) {
    router.push("/resume-builder");

    return null;
  }

  if (isLoadingResume) {
    return <LoadingSpinner fullScreen />;
  }

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);

    router.replace(`/resume-builder/editor?${newSearchParams.toString()}`, {
      scroll: false,
    });
  }

  const handleContinue = () => {
    if (isFormValid) {
      const navigateNext = () => {
        if (!isLastStep) {
          const nextStep = steps[currentStepIndex + 1];

          setStep(nextStep.key);
        } else {
          console.log("Resume completed!", resumeData);
          setIsCompleted(true);
        }
      };

      handleSave(navigateNext);
    }
  };

  const handleSkip = () => {
    if (!isLastStep && !isContactForm) {
      const navigateNext = () => {
        const nextStep = steps[currentStepIndex + 1];

        setStep(nextStep.key);
      };

      handleSave(navigateNext);
    }
  };

  const handleExport = () => {
    if (currentResumeId) {
      exportResume.mutate(currentResumeId, {
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

  // Show completion page if resume is completed
  if (isCompleted) {
    return <Completed resumeData={resumeData} />;
  }

  const handleTitleChange = (newTitle: string) => {
    setResumeData((prev) => ({ ...prev, title: newTitle }));
  };

  return (
    <div className="flex grow flex-col min-h-screen">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {currentResumeId ? (
              <InlineEditableTitle
                currentTitle={
                  resumeData.title || existingResume?.title || "Untitled Resume"
                }
                resumeId={currentResumeId}
                onTitleChange={handleTitleChange}
              />
            ) : (
              <h1 className="text-2xl font-bold">
                {resumeData.title || "Untitled Resume"}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {currentResumeId && (
              <ExportButton isExporting={isExporting} onExport={handleExport} />
            )}
            <SaveStatusIndicator
              hasSaved={!!currentResumeId && !isSaving && !hasUnsavedChanges}
              hasUnsavedChanges={hasUnsavedChanges && !isSaving}
              isSaving={isSaving}
            />
          </div>
        </div>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
              {FormComponent && (
                <FormComponent
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              )}
            </div>
            <div className="p-6">
              <div className="max-w-xs mx-auto space-y-3">
                <LoadingButton
                  className="w-full bg-[#11553F] hover:bg-[#0e4634] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid}
                  onClick={handleContinue}
                >
                  {isLastStep ? "Complete" : "Continue"}
                </LoadingButton>

                {!isContactForm && !isLastStep && (
                  <button
                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                    onClick={handleSkip}
                  >
                    Skip {currentStepTitle}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 md:border-l">
            <ResumePreviewSection
              className="w-full"
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
