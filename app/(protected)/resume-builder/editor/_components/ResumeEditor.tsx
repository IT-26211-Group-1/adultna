"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import ProgressStepper from "./ProgressStepper";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import { LoadingButton } from "@/components/ui/Button";
import Completed from "./Completed";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  useResume,
  useCreateResume,
  useUpdateResume,
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
import ColorPicker from "./ColorPicker";

export default function ResumeEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStep = searchParams.get("step") || steps[0].key;
  const stepParamValue = searchParams.get("step");
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

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const [resumeData, setResumeData] = useState<ResumeData>({} as ResumeData);
  const [isCurrentFormValid, setIsCurrentFormValid] = useState(true);

  useEffect(() => {
    if (existingResume && existingResume.id !== loadedResumeId) {
      setResumeData(mapApiResumeToResumeData(existingResume));
      setLoadedResumeId(existingResume.id);
      setCurrentResumeId(existingResume.id);

      if (existingResume.status === "completed" && !stepParamValue) {
        setIsCompleted(true);
      }
    }
  }, [existingResume, loadedResumeId, stepParamValue]);

  // Reset completion state when step changes (for Edit Resume functionality)
  const previousStepRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentStep !== previousStepRef.current) {
      if (isCompleted) {
        setIsCompleted(false);
      }
      setIsCurrentFormValid(true);
      previousStepRef.current = currentStep;
    }
  }, [currentStep, isCompleted]);

  const createResume = useCreateResume();
  const updateResume = useUpdateResume(currentResumeId || "");

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

      // Clean up invalid data before saving
      let dataOverrides: Partial<ResumeData> = {};

      if (currentStep === "certifications") {
        // Remove certifications that exceed character limits
        const validCertificates = resumeData.certificates?.filter(
          (cert) =>
            cert.certificate &&
            cert.certificate.length <= 100 &&
            (!cert.issuingOrganization ||
              cert.issuingOrganization.length <= 100),
        );

        dataOverrides = { certificates: validCertificates || [] };
      }

      handleSave(navigateNext, dataOverrides);
    }
  };

  const handleEditTitle = () => {
    setTempTitle(
      resumeData.title || existingResume?.title || "Untitled Resume",
    );
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setResumeData({ ...resumeData, title: tempTitle.trim() });
      setIsEditingTitle(false);
    }
  };

  const handleCancelEditTitle = () => {
    setTempTitle("");
    setIsEditingTitle(false);
  };

  // Show completion page if resume is completed
  if (isCompleted) {
    return <Completed resumeData={resumeData} setResumeData={setResumeData} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Form with Breadcrumb */}
      <div className="w-full md:w-1/2 flex flex-col overflow-hidden">
        {/* Breadcrumb Section */}
        <div className="bg-transparent w-full flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-3">
                      <Breadcrumb
                        items={[
                          { label: "Dashboard", href: "/dashboard" },
                          { label: "Resume Builder", href: "/resume-builder" },
                        ]}
                      />
                      <span className="text-gray-400">/</span>
                      <div className="flex items-center gap-2">
                        <input
                          ref={(input) => {
                            if (input) input.focus();
                          }}
                          className="text-sm font-medium text-gray-900 bg-white border border-emerald-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-48"
                          placeholder="Enter resume title"
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveTitle();
                            if (e.key === "Escape") handleCancelEditTitle();
                          }}
                        />
                        <button
                          className="text-emerald-600 hover:text-emerald-800 transition-colors p-1"
                          title="Save title"
                          onClick={handleSaveTitle}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          title="Cancel editing"
                          onClick={handleCancelEditTitle}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 18L18 6M6 6l12 12"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Breadcrumb
                        items={[
                          { label: "Dashboard", href: "/dashboard" },
                          { label: "Resume Builder", href: "/resume-builder" },
                          {
                            label:
                              resumeData.title ||
                              existingResume?.title ||
                              "Untitled Resume",
                            current: true,
                          },
                        ]}
                      />
                      <button
                        className="text-gray-400 hover:text-emerald-600 transition-colors p-1 ml-1"
                        title="Edit resume title"
                        onClick={handleEditTitle}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed Progress Stepper */}
          <div className="flex-shrink-0 bg-gray-50 px-6 py-2 flex justify-center md:pl-16">
            <div className="w-full max-w-lg">
              <ProgressStepper
                currentStep={currentStep}
                resumeData={resumeData}
                setCurrentStep={setStep}
              />
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6 flex justify-center md:pl-16">
            <div className="w-full max-w-lg">
              {/* Mobile Color Picker */}
              <div className="md:hidden mb-6 flex justify-center">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">
                    Resume Color:
                  </span>
                  <ColorPicker
                    color={resumeData.colorHex}
                    onChange={(color) =>
                      setResumeData({ ...resumeData, colorHex: color.hex })
                    }
                  />
                </div>
              </div>

              {FormComponent && (
                <FormComponent
                  key={currentResumeId || "new-resume"}
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  onValidationChange={handleValidationChange}
                />
              )}

              {/* Buttons Section */}
              <div className="p-4 flex-shrink-0">
                <div className="max-w-xs mx-auto space-y-3">
                  <LoadingButton
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-out disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-md focus:ring-2 focus:ring-emerald-500/30 focus:outline-none text-sm"
                    disabled={!isFormValid || !isCurrentFormValid}
                    onClick={handleContinue}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span>{isLastStep ? "Complete Resume" : "Continue"}</span>
                      {!isLastStep && (
                        <svg
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M9 5l7 7-7 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      )}
                      {isLastStep && (
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      )}
                    </div>
                  </LoadingButton>

                  {!isContactForm && !isLastStep && (
                    <button
                      className="w-full text-xs text-gray-500 hover:text-emerald-600 transition-all duration-200 hover:underline hover:underline-offset-2 py-1.5 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      onClick={handleSkip}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Skip {currentStepTitle}</span>
                        <svg
                          className="w-2.5 h-2.5 opacity-60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Resume Preview (Full Height) */}
      <div className="hidden md:flex md:w-1/2 h-screen sticky top-0">
        <ResumePreviewSection
          className="w-full"
          resumeData={resumeData}
          setResumeData={setResumeData}
        />
      </div>
    </div>
  );
}
