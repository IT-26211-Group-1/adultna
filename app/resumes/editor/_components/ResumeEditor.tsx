"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { Navbar } from "@/components/ui/Navbar";
// import Footer from "./Footer";
// import ResumePreviewSection from "./ResumePreviewSection";
import { steps } from "./steps";
// import useAutoSaveResume from "./useAutoSaveResume";
import ContactForm from "./forms/ContactForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import EducationForm from "./forms/EducationForm";
import CertificationForm from "./forms/CertificationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import Navigator from "./Navigator";
import { ResumeData } from "@/validators/resumeSchema";
import ResumePreviewSection from "./ResumePreviewSection";

export default function ResumeEditor() {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].key;

  const [resumeData, setResumeData] = useState<ResumeData>({} as ResumeData)

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find((step) => step.key === currentStep)?.component;

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
          <div className="w-full space-y-6 overflow-y-auto p-3 md:w-1/2">
            {/* <ContactForm /> */}
            {/* <WorkExperienceForm /> */}
            {/* <EducationForm /> */}
            {/* <CertificationForm /> */}
            {/* <SkillsForm /> */}
            {/* <SummaryForm /> */}
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent
              resumeData={resumeData}
              setResumeData={setResumeData}
            />}
          </div>
          <div className="hidden md:flex md:w-1/2 md:border-l">
            <ResumePreviewSection
              resumeData={resumeData}
              setResumeData={setResumeData}
              className="w-full"
            />
          </div>
          {/* <div className="hidden w-1/2 overflow-y-auto border-l p-3 md:flex">
            <pre>{JSON.stringify(resumeData, null, 2)}</pre>
          </div> */}
        </div>
      </main>
      <footer>
        <Navigator
          currentStep={currentStep}
          setCurrentStep={setStep}
        />
      </footer>
    </div>
  );
}