"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import ProgressStepper from "./ProgressStepper";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import { LoadingButton } from "@/components/ui/Button";
import Completed from "./Completed";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ExportButton } from "./ExportButton";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);

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
    if (currentStep !== previousStepRef.current) {
      if (isCompleted) {
        setIsCompleted(false);
      }
      // Reset validation state when changing steps
      setIsCurrentFormValid(true);
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

  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsCurrentFormValid(isValid);
  }, []);

  const searchParamsRef = useRef(searchParams);
  const routerRef = useRef(router);

  useEffect(() => {
    searchParamsRef.current = searchParams;
    routerRef.current = router;
  }, [searchParams, router]);

  const handleSave = useCallback(
    async (
      onSuccessCallback?: () => void,
      dataOverrides?: Partial<ResumeData & { status?: "draft" | "completed" }>,
    ) => {
      const dataToSave = { ...resumeData, ...dataOverrides };

      if (!currentResumeId && templateId && isValidTemplateId(templateId)) {
        // Prevent duplicate creates if one is already in progress
        if (createResume.isPending) {
          if (onSuccessCallback) {
            onSuccessCallback();
          }

          return;
        }

        const payload = mapResumeDataToCreatePayload(dataToSave, templateId);

        createResume.mutate(payload, {
          onSuccess: (newResume) => {
            setCurrentResumeId(newResume.id);
            setHasUnsavedChanges(false);
            lastSavedDataRef.current = { ...resumeData };
            const newParams = new URLSearchParams(searchParamsRef.current);

            newParams.delete("templateId");
            newParams.set("resumeId", newResume.id);
            routerRef.current.replace(
              `/resume-builder/editor?${newParams.toString()}`,
              {
                scroll: false,
              },
            );
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
    [currentResumeId, templateId, resumeData, createResume, updateResume],
  );

  const handleSaveRef = useRef(handleSave);

  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  const debouncedAutoSave = useRef(
    debounce(() => {
      if (!isInitialMount.current) {
        handleSaveRef.current();
      }
    }, 1000),
  );

  useEffect(() => {
    if (isInitialMount.current) {
      const hasData =
        Object.keys(resumeData).length > 0 && resumeData.firstName;

      if (hasData) {
        lastSavedDataRef.current = { ...resumeData };
        isInitialMount.current = false;
      }

      return;
    }

    if (hasResumeChanged(lastSavedDataRef.current, resumeData)) {
      setHasUnsavedChanges(true);
      debouncedAutoSave.current();
    }

    return () => {
      debouncedAutoSave.current.cancel();
    };
  }, [resumeData]);

  // Beforeunload handler to warn about data loss on refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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



  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Form with Breadcrumb */}
      <div className="w-full md:w-1/2 flex flex-col">
        {/* Breadcrumb Section */}
        <div className="bg-transparent w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
                <Breadcrumb
                  items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Resume Builder", href: "/resume-builder" },
                    {
                      label: resumeData.title || existingResume?.title || "Untitled Resume",
                      current: true
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            <ProgressStepper currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                key={currentResumeId || "new-resume"}
                resumeData={resumeData}
                setResumeData={setResumeData}
                onValidationChange={handleValidationChange}
              />
            )}
          </div>
          <div className="p-6">
            <div className="max-w-xs mx-auto space-y-3">
              {!isContactForm && (
                <div className="mb-4">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={handleBack}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                  </button>
                </div>
              )}
              <LoadingButton
                className="w-full bg-[#11553F] hover:bg-[#0e4634] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || !isCurrentFormValid}
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
      </div>

      {/* Right Side - Resume Preview (Full Height) */}
      <div className="hidden md:flex md:w-1/2 md:border-l h-screen sticky top-0">
        <ResumePreviewSection
          className="w-full"
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      </div>
    </div>
  );
}
