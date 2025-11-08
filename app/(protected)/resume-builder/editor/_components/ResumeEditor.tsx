"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import { LoadingButton } from "@/components/ui/Button";
import Completed from "./Completed";
import { useResume, useCreateResume, useUpdateResume, useExportResume } from "@/hooks/queries/useResumeQueries";
import { TemplateId, isValidTemplateId } from "@/constants/templates";
import { useDebounce } from "@/hooks/useDebounce";

export default function ResumeEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStep = searchParams.get("step") || steps[0].key;
  const templateId = searchParams.get("templateId") as TemplateId | null;
  const resumeId = searchParams.get("resumeId") || null;

  const { data: existingResume, isLoading: isLoadingResume } = useResume(resumeId || undefined);

  const initialResumeData = useMemo(() => {
    return existingResume ? (existingResume as ResumeData) : ({} as ResumeData);
  }, [existingResume]);

  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(resumeId);

  const createResume = useCreateResume();
  const updateResume = useUpdateResume(currentResumeId || "");
  const exportResume = useExportResume();

  const isSaving = createResume.isPending || updateResume.isPending;
  const isExporting = exportResume.isPending;

  const debouncedResumeData = useDebounce(resumeData, 3000);

  const handleAutoSave = useCallback(async () => {
    if (!templateId || !isValidTemplateId(templateId)) return;

    createResume.mutate(
      {
        title: `${resumeData.firstName || "My"} ${resumeData.lastName || "Resume"}`,
        templateId,
        status: "draft",
        firstName: resumeData.firstName,
        lastName: resumeData.lastName,
        email: resumeData.email,
        phone: resumeData.phone,
        city: resumeData.city,
        region: resumeData.region,
        birthDate: resumeData.birthDate,
        linkedin: resumeData.linkedin,
        portfolio: resumeData.portfolio,
        workExperiences: resumeData.workExperiences?.map((exp, index) => ({
          ...exp,
          order: index,
        })),
        educationItems: resumeData.educationItems?.map((edu, index) => ({
          ...edu,
          order: index,
        })),
        certificates: resumeData.certificates?.map((cert, index) => ({
          certificate: cert.certificate,
          issuingOrganization: cert.issuingOrganization,
          order: index,
        })),
        skills: resumeData.skills?.map((skill, index) => ({
          skill,
          order: index,
        })),
        summary: resumeData.summary,
      },
      {
        onSuccess: (newResume) => {
          setCurrentResumeId(newResume.id);
          const newParams = new URLSearchParams(searchParams);
          newParams.delete("templateId");
          newParams.set("resumeId", newResume.id);
          window.history.replaceState(null, "", `?${newParams.toString()}`);
        },
      }
    );
  }, [templateId, resumeData, createResume, searchParams]);

  const handleAutoUpdate = useCallback(async () => {
    if (!currentResumeId) return;

    updateResume.mutate({
      title: `${resumeData.firstName || "My"} ${resumeData.lastName || "Resume"}`,
      firstName: resumeData.firstName,
      lastName: resumeData.lastName,
      email: resumeData.email,
      phone: resumeData.phone,
      city: resumeData.city,
      region: resumeData.region,
      birthDate: resumeData.birthDate,
      linkedin: resumeData.linkedin,
      portfolio: resumeData.portfolio,
      workExperiences: resumeData.workExperiences?.map((exp, index) => ({
        ...exp,
        order: index,
      })),
      educationItems: resumeData.educationItems?.map((edu, index) => ({
        ...edu,
        order: index,
      })),
      certificates: resumeData.certificates?.map((cert, index) => ({
        certificate: cert.certificate,
        issuingOrganization: cert.issuingOrganization,
        order: index,
      })),
      skills: resumeData.skills?.map((skill, index) => ({
        skill,
        order: index,
      })),
      summary: resumeData.summary,
    });
  }, [currentResumeId, resumeData, updateResume]);

  useEffect(() => {
    if (existingResume && !resumeData.firstName) {
      setResumeData(existingResume as ResumeData);
      setCurrentResumeId(existingResume.id);
    }
  }, [existingResume, resumeData.firstName]);

  useEffect(() => {
    if (!currentResumeId && debouncedResumeData.firstName) {
      handleAutoSave();
    } else if (currentResumeId && debouncedResumeData.firstName) {
      handleAutoUpdate();
    }
  }, [debouncedResumeData, currentResumeId, handleAutoSave, handleAutoUpdate]);

  if (!templateId && !resumeId) {
    router.push("/resume-builder");
    return null;
  }

  if (isLoadingResume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adult-green" />
      </div>
    );
  }

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

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

  const handleContinue = () => {
    if (isFormValid) {
      if (!isLastStep) {
        const nextStep = steps[currentStepIndex + 1];

        setStep(nextStep.key);
      } else {
        console.log("Resume completed!", resumeData);
        setIsCompleted(true);
      }
    }
  };

  const handleSkip = () => {
    if (!isLastStep && !isContactForm) {
      const nextStep = steps[currentStepIndex + 1];

      setStep(nextStep.key);
    }
  };

  const handleExport = () => {
    if (currentResumeId) {
      exportResume.mutate(currentResumeId);
    }
  };

  // Show completion page if resume is completed
  if (isCompleted) {
    return <Completed resumeData={resumeData} />;
  }

  return (
    <div className="flex grow flex-col min-h-screen">
      <header className="space-y-1.5 border-b px-3 py-5 text-center relative">
        <div className="absolute right-4 top-4 flex items-center gap-3 text-sm">
          {currentResumeId && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-[#11553F] hover:bg-[#0e4634] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </>
              )}
            </button>
          )}
          {isSaving && (
            <span className="text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
              Saving...
            </span>
          )}
          {!isSaving && currentResumeId && (
            <span className="text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
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
