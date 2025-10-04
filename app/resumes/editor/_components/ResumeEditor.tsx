"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { Navbar } from "@/components/ui/Navbar";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";
import { LoadingButton } from "@/components/ui/Button";
import Completed from "./Completed";

export default function ResumeEditor() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].key;

  const [resumeData, setResumeData] = useState<ResumeData>({} as ResumeData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find((step) => step.key === currentStep)?.component;
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const currentStepTitle = steps.find((step) => step.key === currentStep)?.title;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isContactForm = currentStep === "contact";

  const handleContinue = () => {
    if (isFormValid) {
      if (!isLastStep) {
        const nextStep = steps[currentStepIndex + 1];
        setStep(nextStep.key);
      } else {
        // Complete the resume and show completion page
        console.log("Resume completed!", resumeData);
        setIsCompleted(true);
      }
    }
  };

  // Validate current step requirements
  const validateCurrentStep = () => {
    switch (currentStep) {
      case "contact":
        return !!(resumeData.firstName && resumeData.lastName && resumeData.email && resumeData.phone);
      case "work":
        // Work experience is optional, so always valid
        return true;
      case "education":
        // Education is optional, so always valid
        return true;
      case "certifications":
        // Certifications are optional, so always valid
        return true;
      case "skills":
        // Skills are optional, so always valid
        return true;
      case "summary":
        // Summary is optional, so always valid
        return true;
      default:
        return true;
    }
  };

  const handleSkip = () => {
    if (!isLastStep && !isContactForm) {
      const nextStep = steps[currentStepIndex + 1];
      setStep(nextStep.key);
    }
  };
  

  // Update form validation whenever resumeData or currentStep changes
  useEffect(() => {
    setIsFormValid(validateCurrentStep());
  }, [resumeData, currentStep]);

  // Show completion page if resume is completed
  if (isCompleted) {
    return <Completed resumeData={resumeData} />;
  }

  return (
    <div className="flex grow pt-16 flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        {/* <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p> */}
        <Navbar/>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
              {FormComponent && <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />}
            </div>
            <div className="p-6">
              <div className="max-w-xs mx-auto space-y-3">
                <LoadingButton
                  onClick={handleContinue}
                  className="w-full bg-[#11553F] hover:bg-[#0e4634] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid}
                >
                  {isLastStep ? "Complete" : "Continue"}
                </LoadingButton>
                
                {!isContactForm && !isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    Skip {currentStepTitle}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 md:border-l">
            <ResumePreviewSection
              resumeData={resumeData}
              setResumeData={setResumeData}
              className="w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}