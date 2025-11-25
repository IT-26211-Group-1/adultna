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
import { BackButton } from "@/components/ui/BackButton";
import {
  useResume,
  useCreateResume,
  useUpdateResume,
  useExportResume,
  useSaveToFilebox,
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

  const [resumeData, setResumeData] = useState<ResumeData>({} as ResumeData);

  useEffect(() => {
    if (existingResume && existingResume.id !== loadedResumeId) {
      setResumeData(mapApiResumeToResumeData(existingResume));
      setLoadedResumeId(existingResume.id);
      setCurrentResumeId(existingResume.id);
    }
  }, [existingResume, loadedResumeId]);

  // Reset completion state when step changes (for Edit Resume functionality)
  const previousStepRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentStep !== previousStepRef.current && isCompleted) {
      setIsCompleted(false);
    }
    previousStepRef.current = currentStep;
  }, [currentStep, isCompleted]);

  const createResume = useCreateResume();
  const updateResume = useUpdateResume(currentResumeId || "");
  const exportResume = useExportResume();
  const saveToFilebox = useSaveToFilebox(currentResumeId || "");

  const isSaving = createResume.isPending || updateResume.isPending;
  const isExporting = exportResume.isPending;
  const isSavingToFilebox = saveToFilebox.isPending;

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
        // Check if there's at least one work experience with required fields filled
        if (
          !resumeData.workExperiences ||
          resumeData.workExperiences.length === 0
        ) {
          return false;
        }

        return resumeData.workExperiences.some(
          (exp) =>
            exp.jobTitle?.trim() &&
            exp.employer?.trim() &&
            exp.startDate &&
            exp.description?.trim(),
        );
      case "education":
        // Check if there's at least one education item with required fields filled
        if (
          !resumeData.educationItems ||
          resumeData.educationItems.length === 0
        ) {
          return false;
        }

        return resumeData.educationItems.some(
          (edu) =>
            edu.schoolName?.trim() &&
            edu.degree?.trim() &&
            edu.fieldOfStudy?.trim() &&
            edu.graduationDate,
        );
      case "certifications":
        // Check if there's at least one certification with certificate name filled
        if (!resumeData.certificates || resumeData.certificates.length === 0) {
          return false;
        }

        return resumeData.certificates.some((cert) => cert.certificate?.trim());
      case "skills":
        // Check if there's at least one skill filled
        if (!resumeData.skills || resumeData.skills.length === 0) {
          return false;
        }

        return resumeData.skills.some((skill) => skill.skill?.trim());
      case "summary":
        // Summary is not required
        return true;
      default:
        return true;
    }
  }, [resumeData, currentStep]);

  const handleSave = useCallback(
    async (
      onSuccessCallback?: () => void,
      dataOverrides?: Partial<ResumeData & { status?: "draft" | "completed" }>,
    ) => {
      const dataToSave = { ...resumeData, ...dataOverrides };

      if (!currentResumeId && templateId && isValidTemplateId(templateId)) {
        const payload = mapResumeDataToCreatePayload(dataToSave, templateId);

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
      } else if (currentResumeId && dataToSave.firstName) {
        const payload = mapResumeDataToUpdatePayload(dataToSave);

        updateResume.mutate(payload, {
          onSuccess: () => {
            setHasUnsavedChanges(false);
            lastSavedDataRef.current = { ...dataToSave };
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

  // Wait for resume data to load before rendering forms in edit mode
  if (resumeId && !existingResume) {
    return <LoadingSpinner fullScreen />;
  }

  // Ensure resumeData is populated from existingResume before rendering
  if (resumeId && existingResume && loadedResumeId !== existingResume.id) {
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
          setResumeData((prev) => ({ ...prev, status: "completed" }) as any);
          setIsCompleted(true);
        }
      };

      // If completing the last step, mark resume as completed when saving
      const statusOverride = isLastStep
        ? { status: "completed" as const }
        : undefined;

      handleSave(navigateNext, statusOverride);
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

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];

      setStep(previousStep.key);
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

  const handleSaveToFilebox = async () => {
    if (currentResumeId) {
      try {
        await saveToFilebox.mutateAsync();
        addToast({
          title: "Saved to Filebox!",
          color: "success",
        });
      } catch {
        addToast({
          title: "Failed to save to Filebox",
          color: "danger",
        });
      }
    }
  };

  // Show completion page if resume is completed
  if (isCompleted) {
    return <Completed resumeData={resumeData} setResumeData={setResumeData} />;
  }

  const handleTitleChange = (newTitle: string) => {
    setResumeData((prev) => ({ ...prev, title: newTitle }));
  };

  const handleBackToResumes = () => {
    router.push("/resume-builder/my-resumes");
  };

  return (
    <div className="flex grow flex-col min-h-screen">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <BackButton onClick={handleBackToResumes} />
            <div className="flex-1">
              {currentResumeId ? (
                <InlineEditableTitle
                  currentTitle={
                    resumeData.title ||
                    existingResume?.title ||
                    "Untitled Resume"
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
          </div>
          <div className="flex items-center gap-3 text-sm">
            {currentResumeId && (
              <>
                <button
                  className="px-4 py-2 bg-[#11553F] hover:bg-[#0e4634] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSavingToFilebox}
                  onClick={handleSaveToFilebox}
                >
                  {isSavingToFilebox ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      Save to Filebox
                    </>
                  )}
                </button>
                <ExportButton
                  isExporting={isExporting}
                  onExport={handleExport}
                />
              </>
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
                  key={currentResumeId || "new-resume"}
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              )}
            </div>
            <div className="p-6">
              <div className="max-w-xs mx-auto space-y-3">
                {!isContactForm && (
                  <div className="mb-4">
                    <BackButton onClick={handleBack} />
                  </div>
                )}
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
