import { Button } from "@heroui/react";
import { FileUserIcon, PenLineIcon } from "lucide-react";
import Link from "next/link";
import { steps } from "./steps";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
//   showSmResumePreview: boolean;
//   setShowSmResumePreview: (show: boolean) => void;
//   isSaving: boolean;
}

export default function Navigator({
  currentStep,
  setCurrentStep,
//   showSmResumePreview,
//   setShowSmResumePreview,
//   isSaving,
}: FooterProps) {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep,
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep,
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="bordered"
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous step
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next step
          </Button>
        </div>
        <Button
          variant="bordered"
          size="sm"
          isIconOnly
        //   onClick={() => setShowSmResumePreview(!showSmResumePreview)}
          className="md:hidden"
        //   title={
        //     showSmResumePreview ? "Show input form" : "Show resume preview"
        //   }
        >
          {/* {showSmResumePreview ? <PenLineIcon size={16} /> : <FileUserIcon size={16} />} */}
        </Button>
        <div className="flex items-center gap-3">
          <Button 
            variant="bordered" 
            as={Link} 
            href="/resumes"
          >
            Close
          </Button>
          {/* <p
            className={`text-default-500 transition-opacity ${
            //   isSaving ? "opacity-100" : "opacity-0"
            }`}
          >
            Saving...
          </p> */}
        </div>
      </div>
    </footer>
  );
}